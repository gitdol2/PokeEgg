const HABITAT_KO = {
    'cave': '동굴', 'forest': '숲', 'grassland': '초원', 'mountain': '산',
    'rare': '희귀', 'rough-terrain': '거친 지형', 'sea': '바다', 'urban': '도시', 'waters-edge': '물가'
};

const NON_EVOLVING_GEN1 = [
    3,6,9,12,15,18,20,22,24,26,28,31,34,36,38,40,45,47,49,53,55,57,59,62,65,68,71,73,76,78,80,83,85,87,89,91,94,97,99,
    101,103,105,106,107,110,112,113,114,115,119,121,122,124,125,126,127,128,130,131,132,134,135,136,139,141,142,143,
    144,145,146,149,150,151
];

// 에러 방지를 위한 누락된 타입/능력치 상수 추가
const TYPE_COLORS = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030', ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
};
const STAT_NAMES_KO = ['HP', '공격', '방어', '특공', '특방', '스피드'];

let isSelectMode = false;
let isAllSelected = false;
const selectedItems = new Set();
let currentSelectedId = null;
let currentSelectedCount = 0;
let lastLeftPanelRequestId = 0;
let isSortAsc = true;

const inventoryData = [];
for (let i = 1; i <= 151; i++) {
    const count = Math.floor(Math.random() * 15);
    if (count > 0) {
        inventoryData.push({ id: i, count: count });
    }
}
const grid = document.getElementById('inventory-grid');

function getPokemonTierInfo(id) {
    if ([144, 145, 146, 150, 151].includes(id)) return { tier: 'LEGENDARY', price: 1000, color: '#FFCE4B' };
    if ([147, 148, 149, 143, 130, 131].includes(id)) return { tier: 'EPIC', price: 200, color: '#7038F8' };
    if (id <= 9 || [25, 133].includes(id)) return { tier: 'RARE', price: 50, color: '#6890F0' };
    return { tier: 'COMMON', price: 10, color: '#FFFFFF' };
}

function cropTransparentPadding(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(image, 0, 0, w, h);
    
    const imageData = ctx.getImageData(0, 0, w, h).data;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const alpha = imageData[(y * w + x) * 4 + 3];
            if (alpha > 20) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0 || maxY < 0) return canvas.toDataURL();
    
    const padding = 2;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(w - 1, maxX + padding);
    maxY = Math.min(h - 1, maxY + padding);
    
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const cropCtx = cropCanvas.getContext('2d');
    
    cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    return cropCanvas.toDataURL('image/png');
}

function loadCroppedSprite(img, url, fallbackUrl) {
    img.crossOrigin = 'anonymous';
    img.dataset.cropped = 'false';
    img.onload = () => {
        if (img.dataset.cropped === 'true') return;
        try {
            const trimmed = cropTransparentPadding(img);
            img.dataset.cropped = 'true';
            img.src = trimmed;
        } catch (error) {
            console.warn('Cropped sprite failed:', error);
        }
    };
    img.onerror = () => {
        if (!img.dataset.fallbacked) {
            img.dataset.fallbacked = 'true';
            img.src = fallbackUrl;
        }
    };
    img.src = url;
}

function initCurrencyBar() {
    const silverCoinIcon = document.getElementById('silver-coin-icon');
    const goldCoinIcon = document.getElementById('gold-coin-icon');
    const pokemonBallIcon = document.getElementById('pokemon-ball-icon');

    silverCoinIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png';
    goldCoinIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png';
    pokemonBallIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

    document.getElementById('points-display').innerText = '0 pt';
    document.getElementById('silver-coin-display').innerText = '0';
    document.getElementById('gold-coin-display').innerText = '0';
    document.getElementById('pokemon-count-display').innerText = inventoryData.length;
}

function toggleSort() {
    isSortAsc = !isSortAsc;
    document.getElementById('sort-btn').innerHTML = `<span class="sort-arrow">${isSortAsc ? '▲' : '▼'}</span> 도감번호`;
    inventoryData.reverse();
    renderGrid();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    if(tabName === 'inventory') {
        document.getElementById('inventory-view').classList.add('active');
        document.getElementById('gacha-view').classList.remove('active');
        clearLeftPanel();
        toggleSelectMode(false);
    } else {
        document.getElementById('inventory-view').classList.remove('active');
        document.getElementById('gacha-view').classList.add('active');
        document.getElementById('gacha-view').innerText = `${document.querySelector(`.tab[data-tab="${tabName}"]`).innerText} 화면 (준비중)`;
    }
}

function clearLeftPanel() {
    currentSelectedId = null;
    currentSelectedCount = 0;
    document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active', 'selected'));
    selectedItems.clear();

    document.getElementById('pokemon-no').innerText = `No.---`;
    document.getElementById('pokemon-name').innerText = ``;
    document.getElementById('pokemon-count').innerText = `보유: 0개`;
    document.getElementById('pokemon-tier').innerText = `-`;
    document.getElementById('pokemon-tier').style.color = `#FFF`;
    document.getElementById('pokemon-price').innerText = `0`;
    document.getElementById('pokemon-habitat').innerText = `-`;
    document.getElementById('type-badges').innerHTML = '';
    document.getElementById('pokemon-stats').innerHTML = '';
    document.getElementById('pokemon-sprite').src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    document.getElementById('pokemon-count-display').innerText = inventoryData.length;

    updateNormalButtons();
}

function renderGrid() {
    grid.innerHTML = '';
    const totalCells = Math.max(40, Math.ceil(inventoryData.length / 8) * 8);

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        if (i < inventoryData.length) {
            const item = inventoryData[i];
            cell.className = 'grid-cell';
            cell.dataset.id = item.id;

            const miniSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${item.id}.png`;
            const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${item.id}.png`;

            cell.innerHTML = `
                <img crossorigin="anonymous">
                <span class="count-badge">${item.count}</span>
                <div class="select-checkbox"></div>
            `;
            
            const spriteImg = cell.querySelector('img');
            loadCroppedSprite(spriteImg, miniSpriteUrl, fallbackSpriteUrl);

            if (isSelectMode && selectedItems.has(item.id)) {
                cell.classList.add('selected');
            } else if (!isSelectMode && currentSelectedId === item.id) {
                cell.classList.add('active');
            }

            cell.onclick = () => handleCellClick(item, cell);
        } else {
            cell.className = 'grid-cell empty';
        }
        grid.appendChild(cell);
    }
}

function updateNormalButtons() {
    const btnEvolve = document.getElementById('btn-evolve');
    const btnCombine = document.getElementById('btn-combine');
    const btnConvert = document.getElementById('btn-convert');
    const btnAuction = document.getElementById('btn-auction');

    if (currentSelectedCount === 0 || !currentSelectedId) {
        btnEvolve.disabled = true;
        btnCombine.disabled = true;
        btnConvert.disabled = true;
        btnAuction.disabled = true;
    } else {
        btnConvert.disabled = false;
        btnAuction.disabled = false;
        btnCombine.disabled = false;
        const canEvolve = (currentSelectedCount >= 10) && !NON_EVOLVING_GEN1.includes(currentSelectedId);
        btnEvolve.disabled = !canEvolve;
    }
}

function updateSelectModeButtons() {
    const btnConvertMulti = document.getElementById('btn-convert-multi');
    btnConvertMulti.disabled = selectedItems.size === 0;
}

function handleCellClick(item, cellElement) {
    if (isSelectMode) {
        if (selectedItems.has(item.id)) {
            selectedItems.delete(item.id);
            cellElement.classList.remove('selected');
        } else {
            selectedItems.add(item.id);
            cellElement.classList.add('selected');
        }
        if (selectedItems.size < inventoryData.length) isAllSelected = false;
        updateSelectModeButtons();
        updateLeftPanelData(item);
    } else {
        document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active'));
        cellElement.classList.add('active');
        updateLeftPanelData(item);
    }
}

function toggleSelectMode(mode) {
    isSelectMode = mode;
    const gridWrapper = document.getElementById('grid-wrapper');
    const normalBtns = document.getElementById('normal-btns');
    const selectBtns = document.getElementById('select-btns');

    if (isSelectMode) {
        gridWrapper.classList.add('select-mode');
        normalBtns.style.display = 'none';
        selectBtns.style.display = 'flex';

        const activeCell = document.querySelector('.grid-cell.active');
        if (activeCell && !activeCell.classList.contains('empty')) {
            const id = parseInt(activeCell.dataset.id);
            selectedItems.add(id);
            activeCell.classList.add('selected');
            activeCell.classList.remove('active');
        }
        updateSelectModeButtons();
    } else {
        gridWrapper.classList.remove('select-mode');
        normalBtns.style.display = 'flex';
        selectBtns.style.display = 'none';
        clearLeftPanel();
    }
}

function toggleSelectAll() {
    const cells = document.querySelectorAll('.grid-cell:not(.empty)');
    if (isAllSelected) {
        cells.forEach(cell => {
            selectedItems.delete(parseInt(cell.dataset.id));
            cell.classList.remove('selected');
        });
        isAllSelected = false;
    } else {
        cells.forEach(cell => {
            selectedItems.add(parseInt(cell.dataset.id));
            cell.classList.add('selected');
        });
        isAllSelected = true;
    }
    updateSelectModeButtons();
}

async function updateLeftPanelData(item) {
    const requestId = ++lastLeftPanelRequestId;
    currentSelectedId = item.id;
    currentSelectedCount = item.count;
    updateNormalButtons();

    document.getElementById('pokemon-no').innerText = `No.${String(item.id).padStart(3, '0')}`;
    document.getElementById('pokemon-count').innerText = `보유: ${item.count}개`;
    document.getElementById('pokemon-count-display').innerText = item.count;
    
    const tierInfo = getPokemonTierInfo(item.id);
    const tierEl = document.getElementById('pokemon-tier');
    tierEl.innerText = tierInfo.tier;
    tierEl.style.color = tierInfo.color;
    document.getElementById('pokemon-price').innerText = tierInfo.price;

    const spriteImg = document.getElementById('pokemon-sprite');
    const animatedUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${item.id}.gif`;
    const staticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

    spriteImg.src = animatedUrl;
    spriteImg.onerror = () => { spriteImg.src = staticUrl; };

    document.getElementById('loading').style.display = 'block';

    try {
        const [speciesRes, pokeRes] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${item.id}`),
            fetch(`https://pokeapi.co/api/v2/pokemon/${item.id}`)
        ]);

        if (requestId !== lastLeftPanelRequestId) return;
        const speciesData = await speciesRes.json();
        const pokeData = await pokeRes.json();

        const koName = speciesData.names.find(n => n.language.name === 'ko').name;
        document.getElementById('pokemon-name').innerText = koName;

        const habitatName = speciesData.habitat ? speciesData.habitat.name : null;
        document.getElementById('pokemon-habitat').innerText = habitatName ? (HABITAT_KO[habitatName] || habitatName) : '불명';
        
        const badgesContainer = document.getElementById('type-badges');
        badgesContainer.innerHTML = '';
        pokeData.types.forEach(t => {
            const badge = document.createElement('div');
            badge.className = 'type-badge';
            badge.innerText = t.type.name.toUpperCase();
            badge.style.backgroundColor = TYPE_COLORS[t.type.name] || '#777';
            badgesContainer.appendChild(badge);
        });

        const statsContainer = document.getElementById('pokemon-stats');
        statsContainer.innerHTML = pokeData.stats.map((statObj, idx) => `
            <div class="stat-item">
                <span class="stat-name">${STAT_NAMES_KO[idx]}</span>
                <span class="stat-val">${statObj.base_stat}</span>
            </div>
        `).join('');

    } catch (error) {
        if (requestId !== lastLeftPanelRequestId) return;
        console.error("API Error:", error);
        document.getElementById('pokemon-name').innerText = '오류';
        document.getElementById('pokemon-habitat').innerText = '오류';
    } finally {
        if (requestId !== lastLeftPanelRequestId) return;
        document.getElementById('loading').style.display = 'none';
    }
}

// 초기화 실행
initCurrencyBar();
renderGrid();
clearLeftPanel();