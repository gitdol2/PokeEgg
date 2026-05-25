// ===== API 설정 =====
const API_BASE = 'http://localhost:8000';

// ===== 현재 로그인된 유저 상태 =====
let currentUser = null;

const HABITAT_KO = {
    'cave': '동굴', 'forest': '숲', 'grassland': '초원', 'mountain': '산',
    'rare': '희귀', 'rough-terrain': '거친 지형', 'sea': '바다', 'urban': '도시', 'waters-edge': '물가'
};

const HABITAT_COLORS = {
    'cave': '#c9bbac', 'forest': '#c6ff41', 'grassland': '#3cff35', 'mountain': '#ffd54a',
    'rare': '#ed86ff', 'rough-terrain': '#ff8f26', 'sea': '#80acff', 'urban': '#bfc7cf',
    'waters-edge': '#60FFD0', 'unknown': '#FFFFFF'
};

const TYPE_COLORS = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030', ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
};

const TYPE_NAMES_KO = {
    normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음',
    fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레',
    rock: '바위', ghost: '고스트', dragon: '드래곤', dark: '악', steel: '강철', fairy: '페어리'
};

const STAT_NAMES_KO = ['HP', '공격', '방어', '특공', '특방', '스피드'];

const NON_EVOLVING_GEN1 = [
    3,6,9,12,15,18,20,22,24,26,28,31,34,36,38,40,45,47,49,53,55,57,59,62,65,68,71,73,76,78,80,83,85,87,89,91,94,97,99,
    101,103,105,106,107,110,112,113,114,115,119,121,122,124,125,126,127,128,130,131,132,134,135,136,139,141,142,143,
    144,145,146,149,150,151
];

const TIER_INFO = {
    'COMMON': { name: '일반', color: '#FFFFFF', weight: 80 },
    'UNCOMMON': { name: '고급', color: '#88E088', weight: 15 },
    'RARE': { name: '레어', color: '#8888E0', weight: 4 },
    'EPIC': { name: '에픽', color: '#E088E0', weight: 0.8 },
    'UNIQUE': { name: '유니크', color: '#F8C840', weight: 0.1 },
    'LEGENDARY': { name: '레전더리', color: '#FF8040', weight: 0.005 }
};

// https://wiki.pokerogue.net/ko:gameplay:egg_weights 참고
const POKEMON_TIERS = {
    // ===== COMMON (일반) =====
    10: 'COMMON', 11: 'COMMON', 12: 'COMMON', 13: 'COMMON', 14: 'COMMON', 15: 'COMMON',
    16: 'COMMON', 17: 'COMMON', 18: 'COMMON', 19: 'COMMON', 20: 'COMMON',
    21: 'COMMON', 22: 'COMMON', 23: 'COMMON', 24: 'COMMON',
    27: 'COMMON', 28: 'COMMON', 29: 'COMMON', 30: 'COMMON', 31: 'COMMON',
    32: 'COMMON', 33: 'COMMON', 34: 'COMMON',
    41: 'COMMON', 42: 'COMMON', 43: 'COMMON', 44: 'COMMON', 45: 'COMMON',
    46: 'COMMON', 47: 'COMMON', 48: 'COMMON', 49: 'COMMON',
    50: 'COMMON', 51: 'COMMON', 52: 'COMMON', 53: 'COMMON',
    54: 'COMMON', 55: 'COMMON', 56: 'COMMON', 57: 'COMMON',
    60: 'COMMON', 61: 'COMMON', 62: 'COMMON', 63: 'COMMON', 64: 'COMMON', 65: 'COMMON',
    66: 'COMMON', 67: 'COMMON', 68: 'COMMON', 69: 'COMMON', 70: 'COMMON', 71: 'COMMON',
    72: 'COMMON', 73: 'COMMON', 74: 'COMMON', 75: 'COMMON', 76: 'COMMON',
    77: 'COMMON', 78: 'COMMON', 79: 'COMMON', 80: 'COMMON',
    81: 'COMMON', 82: 'COMMON', 83: 'COMMON', 84: 'COMMON', 85: 'COMMON',
    86: 'COMMON', 87: 'COMMON', 88: 'COMMON', 89: 'COMMON',
    90: 'COMMON', 91: 'COMMON', 92: 'COMMON', 93: 'COMMON', 94: 'COMMON',
    95: 'COMMON', 96: 'COMMON', 97: 'COMMON', 98: 'COMMON', 99: 'COMMON',
    100: 'COMMON', 101: 'COMMON', 102: 'COMMON', 103: 'COMMON',
    104: 'COMMON', 105: 'COMMON', 106: 'COMMON', 107: 'COMMON',
    108: 'COMMON', 109: 'COMMON', 110: 'COMMON', 111: 'COMMON', 112: 'COMMON',
    114: 'COMMON', 115: 'COMMON', 116: 'COMMON', 117: 'COMMON',
    118: 'COMMON', 119: 'COMMON', 120: 'COMMON', 121: 'COMMON',
    122: 'COMMON', 123: 'COMMON', 124: 'COMMON', 125: 'COMMON', 126: 'COMMON',
    127: 'COMMON', 128: 'COMMON', 129: 'COMMON',
    131: 'COMMON', 132: 'COMMON', 137: 'COMMON',
    138: 'COMMON', 139: 'COMMON', 140: 'COMMON', 141: 'COMMON', 142: 'COMMON',
    147: 'COMMON', 148: 'COMMON',

    // ===== UNCOMMON (고급) - Pokerogue Common 중 높은 가중치 =====
    1: 'UNCOMMON', 2: 'UNCOMMON', 3: 'UNCOMMON',
    4: 'UNCOMMON', 5: 'UNCOMMON', 6: 'UNCOMMON',
    7: 'UNCOMMON', 8: 'UNCOMMON', 9: 'UNCOMMON',
    25: 'UNCOMMON', 26: 'UNCOMMON',
    35: 'UNCOMMON', 36: 'UNCOMMON', 37: 'UNCOMMON', 38: 'UNCOMMON',
    39: 'UNCOMMON', 40: 'UNCOMMON', 58: 'UNCOMMON', 59: 'UNCOMMON',
    113: 'UNCOMMON', 130: 'UNCOMMON',
    133: 'UNCOMMON', 134: 'UNCOMMON', 135: 'UNCOMMON', 136: 'UNCOMMON',
    143: 'UNCOMMON',

    // ===== RARE (레어) =====
    149: 'RARE',

    // ===== EPIC (에픽) =====
    // (Gen1에는 해당 없음)

    // ===== UNIQUE (유니크) =====
    // (Gen1에는 해당 없음)

    // ===== LEGENDARY (레전더리) =====
    144: 'LEGENDARY', 145: 'LEGENDARY', 146: 'LEGENDARY',
    150: 'LEGENDARY', 151: 'LEGENDARY',
};

// ===== 상태 변수 =====
let isSelectMode = false;
let isAllSelected = false;
const selectedItems = new Set();
let currentSelectedId = null;
let currentSelectedCount = 0;
let lastLeftPanelRequestId = 0;
let isSortAsc = true;

const filterState = { gen: new Set(), tier: new Set(), type: new Set(), habitat: new Set() };

const inventoryData = [];
const grid = document.getElementById('inventory-grid');

// ===== 프로필 / 로그인 / 로딩 상태 =====
let isLoggedIn = false;
let isLoading = false;
let preloadedPokemonData = {};
let playtimeSeconds = 0;
let playtimeInterval = null;
let selectedCharacter = 1;
let partnerPokemonId = null;
let dexSelectedId = null;

// ===== API 호출 헬퍼 =====
async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || 'API 오류');
    }
    return data;
}

async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || 'API 오류');
    }
    return data;
}

const CHARACTERS = [
    { id: 1, name: '이상해씨' }, { id: 4, name: '파이리' }, { id: 7, name: '꼬부기' },
    { id: 25, name: '피카츄' }, { id: 133, name: '이브이' }, { id: 143, name: '잠만보' },
    { id: 149, name: '망나뇽' }, { id: 150, name: '뮤츠' }, { id: 151, name: '뮤' },
];

// ===== 로딩 시스템 =====
const LOADING_MESSAGES = [
    'API 서버 연결 중...', '포켓몬 데이터 불러오는 중...', '종 정보 로딩 중...',
    '능력치 데이터 수집 중...', '도감 데이터 초기화 중...', 'Static files 불러오는 중...',
    'Database initializing...', '거의 다 됐어요!'
];

function showLoadingScreen() {
    document.getElementById('loading-screen').classList.add('active');
    document.getElementById('loading-icon').style.display = 'block';
    isLoading = true;
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('active');
    document.getElementById('loading-icon').style.display = 'none';
    isLoading = false;
}

function updateLoadingProgress(percent, message) {
    const fill = document.getElementById('loading-bar-fill');
    const percentEl = document.getElementById('loading-percent');
    const msgEl = document.getElementById('loading-screen-message');
    if (fill) fill.style.width = Math.min(100, percent) + '%';
    if (percentEl) percentEl.textContent = Math.floor(percent) + '%';
    if (msgEl && message) msgEl.textContent = message;
}

async function preloadAllPokemonData(onProgress) {
    const total = 151;
    let loaded = 0;

    // 백엔드 API에서 모든 포켓몬 상세 정보를 한 번에 가져오기
    try {
        if (onProgress) onProgress(5, '포켓몬 데이터 다운로드 중...');
        const result = await apiGet('/api/pokemon/all-details');
        const data = result.data || {};

        for (let i = 1; i <= total; i++) {
            const entry = data[String(i)];
            if (entry) {
                // displayPokemonData와 호환되는 형태로 변환
                preloadedPokemonData[i] = {
                    speciesData: {
                        names: entry.name_ko ? [{ language: { name: 'ko' }, name: entry.name_ko }] : [],
                        habitat: entry.habitat ? { name: entry.habitat } : null,
                        flavor_text_entries: entry.flavor_text ? [{ language: { name: 'ko' }, flavor_text: entry.flavor_text }] : [],
                        genera: entry.genus ? [{ language: { name: 'ko' }, genus: entry.genus }] : []
                    },
                    pokeData: {
                        types: entry.types.map(t => ({ type: { name: t } })),
                        stats: entry.stats.map(s => ({ stat: { name: s.name }, base_stat: s.base }))
                    }
                };
            }
            loaded++;
            const percent = 5 + (loaded / total) * 90;
            if (onProgress) onProgress(percent, `데이터 로딩 중... ${loaded}/${total}`);
        }
    } catch (e) {
        console.warn('백엔드 API에서 데이터를 가져오지 못했습니다. PokeAPI 직접 호출로 폴백합니다.', e);
        // 폴백: PokeAPI 직접 호출
        for (let i = 1; i <= total; i++) {
            try {
                const [speciesRes, pokeRes] = await Promise.all([
                    fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`),
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                ]);
                const speciesData = await speciesRes.json();
                const pokeData = await pokeRes.json();
                preloadedPokemonData[i] = { speciesData, pokeData };
            } catch (e2) {
                console.warn(`Failed to preload pokemon ${i}:`, e2);
            }
            loaded++;
            const percent = 5 + (loaded / total) * 90;
            if (onProgress) onProgress(percent, `데이터 로딩 중... ${loaded}/${total}`);
            if (loaded % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
    }

    if (onProgress) onProgress(100, '완료!');
}

// ===== 로그인 모달 =====
function showLoginModal(message, showButtons) {
    return new Promise((resolve) => {
        const modal = document.getElementById('login-modal');
        const msgEl = document.getElementById('login-modal-message');
        const btnsEl = document.getElementById('login-modal-btns');
        const yesBtn = document.getElementById('login-modal-yes');
        const noBtn = document.getElementById('login-modal-no');

        msgEl.textContent = message;
        btnsEl.style.display = showButtons ? 'flex' : 'none';
        noBtn.style.display = showButtons === 'yesno' ? 'inline-block' : 'none';
        modal.style.display = 'flex';

        yesBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        noBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
}




// ===== 로그인 / 프로필 =====
async function handleLogin() {
    if (isLoading) return;

    const nickname = document.getElementById('login-nickname').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!nickname) {
        document.getElementById('login-nickname').focus();
        return;
    }

    try {
        // 1. 먼저 닉네임 중복 체크
        const checkResult = await apiPost('/api/user/check', { nickname });

        if (checkResult.exists) {
            // 기존 유저 → 로그인 시도
            try {
                const result = await apiPost('/api/user/login', { nickname, password });
                currentUser = result.user;
                proceedLogin(nickname);
            } catch (error) {
                showLoginModal(error.message, true);
            }
        } else {
            // 신규 유저 → 가입 확인 모달
            const answer = await showLoginModal('등록되지 않은 닉네임입니다. 가입하시겠습니까?', 'yesno');
            if (answer) {
                try {
                    const result = await apiPost('/api/user/login', { nickname, password });
                    currentUser = result.user;
                    proceedLogin(nickname);
                } catch (error) {
                    showLoginModal('가입에 실패했습니다.', true);
                }
            }
        }
    } catch (error) {
        showLoginModal('서버 연결에 실패했습니다.', true);
    }
}

function proceedLogin(nickname) {
    showLoadingScreen();
    updateLoadingProgress(0, '데이터 로딩 준비 중...');

    if (Object.keys(preloadedPokemonData).length >= 151) {
        finishLogin(nickname);
        return;
    }

    preloadAllPokemonData((percent, msg) => {
        updateLoadingProgress(percent, msg);
    }).then(() => {
        finishLogin(nickname);
    });
}

function showAllTabs() {
    document.querySelectorAll('.tab[data-tab]:not([data-tab="profile"])').forEach(t => {
        t.style.display = '';
    });
}

function hideAllTabs() {
    document.querySelectorAll('.tab[data-tab]:not([data-tab="profile"])').forEach(t => {
        t.style.display = 'none';
    });
}

function finishLogin(nickname) {
    isLoggedIn = true;
    showAllTabs();

    // 유저 데이터 표시
    const user = currentUser || {};
    const currency = user.currency || {};
    const dexCount = (user.dex || []).length;

    // 인벤토리 데이터 로드 (백엔드 유저 데이터 기반)
    inventoryData.length = 0;
    const inv = user.inventory || {};
    for (let i = 1; i <= 151; i++) {
        const count = inv[String(i)];
        if (count && count > 0) {
            inventoryData.push({ id: i, count: count });
        }
    }

    document.getElementById('profile-nickname').textContent = nickname;
    document.getElementById('profile-pt').textContent = (currency.pt || 0) + ' pt';
    document.getElementById('profile-silver').textContent = currency.silver || 0;
    document.getElementById('profile-gold').textContent = currency.gold || 0;
    document.getElementById('profile-cp').textContent = (currency.cp || 0) + ' cp';
    document.getElementById('profile-dex').textContent = dexCount + '마리';
    document.getElementById('profile-startdate').textContent = user.created ? new Date(user.created).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR');

    // 파트너 포켓몬
    partnerPokemonId = user.partner || null;
    selectedCharacter = user.character || 1;

    // 플레이타임
    playtimeSeconds = user.playtime || 0;
    if (playtimeInterval) clearInterval(playtimeInterval);
    playtimeInterval = setInterval(() => {
        playtimeSeconds++;
        const h = String(Math.floor(playtimeSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((playtimeSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(playtimeSeconds % 60).padStart(2, '0');
        document.getElementById('profile-playtime').textContent = `${h}:${m}:${s}`;
    }, 1000);

    initCharacterGrid();
    updateProfileAvatar(selectedCharacter);
    updatePartnerDisplay();

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('profile-main').style.display = 'flex';

    hideLoadingScreen();
    switchTab('profile');

    renderGrid();
    renderDexGrid();
}

// ===== 캐릭터 선택 =====
function initCharacterGrid() {
    const grid = document.getElementById('profile-char-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach(char => {
        const cell = document.createElement('div');
        cell.className = 'char-cell' + (char.id === selectedCharacter ? ' active' : '');
        cell.dataset.charId = char.id;
        const img = document.createElement('img');
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${char.id}.gif`;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${char.id}.png`;
        img.src = spriteUrl;
        img.onerror = () => { img.src = fallbackUrl; };
        img.alt = char.name;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = char.name;
        cell.appendChild(img);
        cell.appendChild(nameSpan);
        cell.onclick = () => selectCharacter(char.id);
        grid.appendChild(cell);
    });
}

function selectCharacter(charId) {
    selectedCharacter = charId;
    document.querySelectorAll('.char-cell').forEach(c => c.classList.remove('active'));
    const cell = document.querySelector(`.char-cell[data-char-id="${charId}"]`);
    if (cell) cell.classList.add('active');
    updateProfileAvatar(charId);
}

function updateProfileAvatar(charId) {
    const avatar = document.getElementById('profile-avatar');
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${charId}.gif`;
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${charId}.png`;
    avatar.src = spriteUrl;
    avatar.onerror = () => { avatar.src = fallbackUrl; };
}

// ===== 파트너 포켓몬 =====
function updatePartnerDisplay() {
    const partnerEl = document.getElementById('profile-partner');
    if (partnerPokemonId) {
        const iconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${partnerPokemonId}.png`;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${partnerPokemonId}.png`;
        partnerEl.innerHTML = '';
        const img = document.createElement('img');
        img.className = 'partner-mini-dot';
        img.alt = 'partner';
        loadCroppedSprite(img, iconUrl, fallbackUrl);
        partnerEl.appendChild(img);
    } else {
        partnerEl.textContent = '-';
    }
}

async function setPartnerPokemon() {
    if (!dexSelectedId || !currentUser) return;
    partnerPokemonId = dexSelectedId;
    updatePartnerDisplay();
    document.getElementById('btn-set-partner').disabled = true;
    // 백엔드에 파트너 저장
    try {
        const nickname = document.getElementById('profile-nickname').textContent;
        await apiPost(`/api/user/${nickname}/update`, { data: { partner: partnerPokemonId } });
    } catch (e) {
        console.warn('파트너 저장 실패:', e);
    }
}

// ===== 도감 =====
function renderDexGrid() {
    const dexGrid = document.getElementById('profile-dex-grid');
    dexGrid.innerHTML = '';

    for (let i = 1; i <= 151; i++) {
        const cell = document.createElement('div');
        const owned = inventoryData.some(item => item.id === i);
        cell.className = 'dex-cell' + (owned ? ' owned' : ' unowned');
        if (dexSelectedId === i) cell.classList.add('active');
        cell.dataset.dexId = i;

        const iconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${i}.png`;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${i}.png`;

        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        loadCroppedSprite(img, iconUrl, fallbackUrl);

        const label = document.createElement('span');
        label.className = 'dex-no-label';
        label.textContent = String(i).padStart(3, '0');

        cell.appendChild(img);
        cell.appendChild(label);

        cell.onclick = () => handleDexCellClick(i, cell);
        dexGrid.appendChild(cell);
    }
}

function handleDexCellClick(id, cellElement) {
    dexSelectedId = id;
    document.querySelectorAll('.dex-cell').forEach(c => c.classList.remove('active'));
    cellElement.classList.add('active');

    const owned = inventoryData.some(item => item.id === id);
    document.getElementById('btn-set-partner').disabled = !owned;
}

// ===== 아바타 클릭 시 캐릭터 선택 화면 토글 =====
document.getElementById('profile-avatar-box').addEventListener('click', () => {
    const charSection = document.getElementById('profile-char-section');
    const dexSection = document.getElementById('profile-dex-section');
    const isVisible = charSection.style.display !== 'none';
    charSection.style.display = isVisible ? 'none' : 'flex';
    dexSection.style.display = isVisible ? 'flex' : 'none';
});

// ===== 파트너 지정 버튼 =====
document.getElementById('btn-set-partner').addEventListener('click', setPartnerPokemon);

// ===== 기존 함수들 =====
function getPokemonTierInfo(id) {
    const tier = POKEMON_TIERS[id] || 'COMMON';
    const priceMap = { 'COMMON': 10, 'UNCOMMON': 20, 'RARE': 50, 'EPIC': 200, 'UNIQUE': 500, 'LEGENDARY': 1000 };
    return { tier: tier, price: priceMap[tier], color: TIER_INFO[tier].color };
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
    const pokemonBallIconName = document.getElementById('pokemon-ball-icon-name');
    silverCoinIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shoal-salt.png';
    goldCoinIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png';
    pokemonBallIcon.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    if (pokemonBallIconName) {
        pokemonBallIconName.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
    }
    document.getElementById('sort-btn').innerHTML = `<span class="sort-arrow" style="color:#3366CC">▲</span> 도감번호`;
    document.getElementById('points-display').innerText = '0 pt';
    document.getElementById('silver-coin-display').innerText = '0';
    document.getElementById('gold-coin-display').innerText = '0';
    updateTotalPokemonCount();
}

function updateTotalPokemonCount() {
    const total = inventoryData.reduce((sum, item) => sum + item.count, 0);
    const displayEl = document.getElementById('pokemon-count-total-display');
    if (displayEl) displayEl.innerText = total;
}

function toggleSort() {
    isSortAsc = !isSortAsc;
    const arrowColor = isSortAsc ? '#3366CC' : '#FF6060';
    document.getElementById('sort-btn').innerHTML = `<span class="sort-arrow" style="color:${arrowColor}">${isSortAsc ? '▲' : '▼'}</span> 도감번호`;
    inventoryData.reverse();
    renderGrid();
}

function switchTab(tabName) {
    // 로그인 안 되어 있으면 프로필 탭만 접근 가능
    if (!isLoggedIn && tabName !== 'profile') {
        return;
    }

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));

    if (tabName === 'profile' && isLoading) {
        document.getElementById('loading-screen').classList.add('active');
    }

    const targetView = document.getElementById(`${tabName}-view`);
    if (targetView) targetView.classList.add('active');

    const container = document.getElementById('game-container');
    if (tabName === 'profile') {
        container.style.backgroundColor = 'var(--dp-bg)';
    } else if (tabName === 'combine') {
        container.style.backgroundColor = '#D06060';
    } else if (tabName === 'gacha') {
        container.style.backgroundColor = '#E8C840';
    } else {
        container.style.backgroundColor = 'var(--inventory-theme)';
    }

    if (tabName === 'combine') {
        initCombineView();
    } else if (tabName === 'gacha') {
        initGachaView();
    }
}

function clearLeftPanel() {
    currentSelectedId = null;
    currentSelectedCount = 0;
    document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active', 'selected'));
    selectedItems.clear();
    document.getElementById('pokemon-no').innerText = 'No.---';
    document.getElementById('pokemon-name').innerText = '';
    document.getElementById('pokemon-count-name').innerText = '0';
    document.getElementById('pokemon-habitat').innerText = '-';
    document.getElementById('pokemon-habitat').style.color = '#FFF';
    document.getElementById('pokemon-tier').innerText = '-';
    document.getElementById('pokemon-tier').style.color = '#FFF';
    document.getElementById('pokemon-price').innerText = '0';
    document.getElementById('pokemon-held-item').innerText = '없음';
    document.getElementById('pokemon-description').innerText = '';
    document.getElementById('type-badges').innerHTML = '';
    document.getElementById('pokemon-stats').innerHTML = STAT_NAMES_KO.map(name => `
        <div class="stat-item">
            <span class="stat-name">${name}</span>
            <span class="stat-val">-</span>
        </div>
    `).join('');
    document.getElementById('pokemon-sprite').src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    updateTotalPokemonCount();
    updateNormalButtons();
    updateSelectCountDisplay();
}

function renderGrid() {
    grid.innerHTML = '';

    // 필터 적용
    let filtered = inventoryData.filter(item => {
        // 세대 필터 (Gen1은 1세대만 있음)
        if (filterState.gen.size > 0) {
            if (!filterState.gen.has('1')) return false;
        }
        // 등급 필터
        if (filterState.tier.size > 0) {
            const tier = POKEMON_TIERS[item.id] || 'COMMON';
            if (!filterState.tier.has(tier)) return false;
        }
        // 타입 필터
        if (filterState.type.size > 0) {
            const data = preloadedPokemonData[item.id];
            if (data && data.pokeData && data.pokeData.types) {
                const types = data.pokeData.types.map(t => t.type.name);
                if (!types.some(t => filterState.type.has(t))) return false;
            }
        }
        // 서식지 필터
        if (filterState.habitat.size > 0) {
            const data = preloadedPokemonData[item.id];
            if (data && data.speciesData && data.speciesData.habitat) {
                if (!filterState.habitat.has(data.speciesData.habitat.name)) return false;
            } else {
                return false;
            }
        }
        return true;
    });

    const totalCells = Math.max(40, Math.ceil(filtered.length / 10) * 10);
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        if (i < filtered.length) {
            const item = filtered[i];
            cell.className = 'grid-cell';
            cell.dataset.id = item.id;
            const miniSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${item.id}.png`;
            const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${item.id}.png`;
            cell.innerHTML = `<img crossorigin="anonymous"><span class="count-badge">${item.count}</span><div class="select-checkbox"></div>`;
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
    const btnConvert = document.getElementById('btn-convert');
    const btnAuction = document.getElementById('btn-auction');
    if (currentSelectedCount === 0 || !currentSelectedId) {
        btnEvolve.disabled = true;
        btnConvert.disabled = true;
        btnAuction.disabled = true;
    } else {
        btnConvert.disabled = false;
        btnAuction.disabled = false;
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
        updateSelectCountDisplay();
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
        updateSelectCountDisplay();
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
    updateSelectCountDisplay();
}

async function updateLeftPanelData(item) {
    const requestId = ++lastLeftPanelRequestId;
    currentSelectedId = item.id;
    currentSelectedCount = item.count;
    updateNormalButtons();
    document.getElementById('pokemon-no').innerText = `No.${String(item.id).padStart(3, '0')}`;
    document.getElementById('pokemon-count-name').innerText = item.count;
    updateTotalPokemonCount();
    const tierInfo = getPokemonTierInfo(item.id);
    const tierEl = document.getElementById('pokemon-tier');
    tierEl.innerText = TIER_INFO[tierInfo.tier].name;
    tierEl.style.color = tierInfo.color;
    document.getElementById('pokemon-price').innerText = tierInfo.price;
    const spriteImg = document.getElementById('pokemon-sprite');
    const animatedUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${item.id}.gif`;
    const staticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;
    spriteImg.src = animatedUrl;
    spriteImg.onerror = () => { spriteImg.src = staticUrl; };
    // preload된 데이터만 사용, 없으면 기본 정보만 표시
    if (preloadedPokemonData[item.id]) {
        const { speciesData, pokeData } = preloadedPokemonData[item.id];
        displayPokemonData(item.id, speciesData, pokeData, requestId);
    } else {
        // preload 안 됐으면 이름/타입/능력치는 빈칸으로 두고 스프라이트만 표시
        document.getElementById('pokemon-name').innerText = `#${String(item.id).padStart(3, '0')}`;
        document.getElementById('pokemon-habitat').innerText = '로딩 중...';
        document.getElementById('pokemon-habitat').style.color = '#FFF';
        document.getElementById('pokemon-description').innerText = '';
        document.getElementById('type-badges').innerHTML = '';
        document.getElementById('pokemon-stats').innerHTML = STAT_NAMES_KO.map(name => `
            <div class="stat-item">
                <span class="stat-name">${name}</span>
                <span class="stat-val">-</span>
            </div>
        `).join('');
    }
}

async function displayPokemonData(id, speciesData, pokeData, requestId) {
    const koName = speciesData.names.find(n => n.language.name === 'ko').name;
    document.getElementById('pokemon-name').innerText = koName;

    const habitatName = speciesData.habitat ? speciesData.habitat.name : null;
    const habitatEl = document.getElementById('pokemon-habitat');
    if (habitatName) {
        habitatEl.innerText = HABITAT_KO[habitatName] || habitatName;
        habitatEl.style.color = HABITAT_COLORS[habitatName] || HABITAT_COLORS['unknown'];
    } else {
        habitatEl.innerText = '불명';
        habitatEl.style.color = HABITAT_COLORS['unknown'];
    }

    const descEl = document.getElementById('pokemon-description');
    const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'ko');
    if (flavorTextEntry) {
        descEl.innerText = flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ');
    } else {
        descEl.innerText = '도감 설명이 존재하지 않습니다.';
    }

    const heldItemEl = document.getElementById('pokemon-held-item');
    heldItemEl.innerText = '없음';

    const badgesContainer = document.getElementById('type-badges');
    badgesContainer.innerHTML = '';
    pokeData.types.forEach(t => {
        const badge = document.createElement('div');
        badge.className = 'type-badge';
        badge.innerText = TYPE_NAMES_KO[t.type.name] || t.type.name.toUpperCase();
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
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const isActive = modal.classList.contains('active');
    document.querySelectorAll('.filter-modal').forEach(m => m.classList.remove('active'));
    if (!isActive) modal.classList.add('active');
}

function toggleFilter(element, type, value) {
    const modal = element.closest('.filter-modal');
    if (!modal) return;
    if (value === 'all') {
        const items = modal.querySelectorAll('.filter-item');
        items.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
        filterState[type].clear();
        closeAllModals();
    } else {
        const allItem = modal.querySelector('.filter-item:first-child');
        if (allItem) allItem.classList.remove('active');
        element.classList.toggle('active');
        const activeItems = modal.querySelectorAll('.filter-item.active');
        if (activeItems.length === 0 && allItem) {
            allItem.classList.add('active');
            filterState[type].clear();
        } else {
            filterState[type].clear();
            activeItems.forEach(item => {
                const val = item.dataset.value;
                if (val && val !== 'all') {
                    filterState[type].add(val);
                }
            });
        }
    }
    updateFilterBadge(type);
    renderGrid();
}

function updateFilterBadge(type) {
    const badge = document.getElementById(`filter-badge-${type}`);
    if (!badge) return;
    const count = filterState[type].size;
    badge.textContent = count;
    if (count > 0) {
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

function updateSelectCountDisplay() {
    const display = document.getElementById('select-count-display');
    if (!display) return;
    display.textContent = `선택: ${selectedItems.size}`;
}

function closeAllModals() {
    document.querySelectorAll('.filter-modal').forEach(m => m.classList.remove('active'));
}

window.addEventListener('click', (e) => {
    if (!e.target.matches('.filter-btn') && !e.target.closest('.filter-modal')) {
        closeAllModals();
    }
});

function initFilterModals() {
    const tierOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'UNIQUE', 'LEGENDARY'];
    const tierModal = document.getElementById('tier-modal');
    tierModal.innerHTML = `<div class="filter-item active" data-value="all" onclick="toggleFilter(this, 'tier', 'all')"><div class="filter-checkbox"></div> 전체</div>` + 
        tierOrder.map(t => `<div class="filter-item" data-value="${t}" onclick="toggleFilter(this, 'tier', '${t}')"><div class="filter-checkbox"></div> ${TIER_INFO[t].name}</div>`).join('');

    const types = Object.keys(TYPE_COLORS);
    const typeModal = document.getElementById('type-modal');
    typeModal.innerHTML = `<div class="filter-item active" data-value="all" onclick="toggleFilter(this, 'type', 'all')"><div class="filter-checkbox"></div> 전체</div>` + 
        `<div class="filter-items-grid">` +
        types.map(t => `<div class="filter-item" data-value="${t}" onclick="toggleFilter(this, 'type', '${t}')"><div class="filter-checkbox"></div> ${TYPE_NAMES_KO[t]}</div>`).join('') +
        `</div>`;

    const habitats = Object.keys(HABITAT_KO);
    const habitatModal = document.getElementById('habitat-modal');
    habitatModal.innerHTML = `<div class="filter-item active" data-value="all" onclick="toggleFilter(this, 'habitat', 'all')"><div class="filter-checkbox"></div> 전체</div>` + 
        habitats.map(h => `<div class="filter-item" data-value="${h}" onclick="toggleFilter(this, 'habitat', '${h}')"><div class="filter-checkbox"></div> ${HABITAT_KO[h]}</div>`).join('');
}

function startBackgroundPreload() {
    if (Object.keys(preloadedPokemonData).length < 151) {
        preloadAllPokemonData().catch(e => console.warn('Background preload failed:', e));
    }
}

// ===== 로그아웃 =====
function handleLogout() {
    if (playtimeInterval) {
        clearInterval(playtimeInterval);
        playtimeInterval = null;
    }
    isLoggedIn = false;
    currentUser = null;
    currentSelectedId = null;
    currentSelectedCount = 0;
    inventoryData.length = 0;
    preloadedPokemonData = {};
    selectedItems.clear();
    isSelectMode = false;
    isAllSelected = false;
    partnerPokemonId = null;
    dexSelectedId = null;

    hideAllTabs();

    document.getElementById('profile-main').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-nickname').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-nickname').focus();

    // 인벤토리 초기화
    renderGrid();
    clearLeftPanel();
    switchTab('profile');
}

// ===== 계정 삭제 =====
async function handleDeleteAccount() {
    if (!currentUser) return;
    const nickname = document.getElementById('profile-nickname').textContent;
    const answer = await showLoginModal(
        `정말로 계정 "${nickname}"을(를) 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
        'yesno'
    );
    if (!answer) return;

    const confirmAnswer = await showLoginModal(
        '정말 삭제하시겠습니까? "예"를 누르면 계정이 영구 삭제됩니다.',
        'yesno'
    );
    if (!confirmAnswer) return;

    try {
        const res = await fetch(`${API_BASE}/api/user/${encodeURIComponent(nickname)}/delete`, {
            method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || '계정 삭제 실패');
        }
        showLoginModal('계정이 삭제되었습니다.', true);
        handleLogout();
    } catch (error) {
        showLoginModal('계정 삭제 실패: ' + error.message, true);
    }
}

// ===== 초기화 =====
document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('btn-logout').addEventListener('click', handleLogout);
document.getElementById('btn-delete-account').addEventListener('click', handleDeleteAccount);

document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
});
document.getElementById('login-nickname').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('login-password').focus();
});

// ===== 조합 시스템 =====
const COMBINE_SLOTS = [null, null, null]; // slot 0,1,2에 들어간 pokemon_id
let combineLockedTier = null; // 슬롯에 넣은 포켓몬의 등급 (모두 같은 등급이어야 함)
let combineSelectedSlot = null; // 현재 선택된 슬롯 인덱스 (0,1,2)

const COMBINE_RATES = {
    'COMMON':   { 'COMMON': 70, 'UNCOMMON': 30 },
    'UNCOMMON': { 'UNCOMMON': 70, 'RARE': 30 },
    'RARE':     { 'RARE': 65, 'EPIC': 35 },
    'EPIC':     { 'EPIC': 55, 'UNIQUE': 45 },
    'UNIQUE':   { 'UNIQUE': 50, 'LEGENDARY': 50 },
    'LEGENDARY': { 'LEGENDARY': 100 }
};

function initCombineView() {
    initCombineFilterModals();
    renderCombineGrid();
    updateCombineSlots();
    updateCombineRateTable();
    updateCombineExecuteBtn();
}

function initCombineFilterModals() {
    const tierOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'UNIQUE', 'LEGENDARY'];
    const tierModal = document.getElementById('combine-tier-modal');
    if (tierModal && !tierModal.dataset.initialized) {
        tierModal.innerHTML = `<div class="filter-item active" data-value="all" onclick="toggleCombineFilter(this, 'tier', 'all')"><div class="filter-checkbox"></div> 전체</div>` + 
            tierOrder.map(t => `<div class="filter-item" data-value="${t}" onclick="toggleCombineFilter(this, 'tier', '${t}')"><div class="filter-checkbox"></div> ${TIER_INFO[t].name}</div>`).join('');
        tierModal.dataset.initialized = 'true';
    }

    const types = Object.keys(TYPE_COLORS);
    const typeModal = document.getElementById('combine-type-modal');
    if (typeModal && !typeModal.dataset.initialized) {
        typeModal.innerHTML = `<div class="filter-item active" data-value="all" onclick="toggleCombineFilter(this, 'type', 'all')"><div class="filter-checkbox"></div> 전체</div>` + 
            `<div class="filter-items-grid">` +
            types.map(t => `<div class="filter-item" data-value="${t}" onclick="toggleCombineFilter(this, 'type', '${t}')"><div class="filter-checkbox"></div> ${TYPE_NAMES_KO[t]}</div>`).join('') +
            `</div>`;
        typeModal.dataset.initialized = 'true';
    }
}

const combineFilterState = { tier: new Set(), type: new Set() };

function toggleCombineFilter(element, type, value) {
    const modal = element.closest('.filter-modal');
    if (!modal) return;
    if (value === 'all') {
        const items = modal.querySelectorAll('.filter-item');
        items.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
        combineFilterState[type].clear();
        modal.classList.remove('active');
    } else {
        const allItem = modal.querySelector('.filter-item:first-child');
        if (allItem) allItem.classList.remove('active');
        element.classList.toggle('active');
        const activeItems = modal.querySelectorAll('.filter-item.active');
        if (activeItems.length === 0 && allItem) {
            allItem.classList.add('active');
            combineFilterState[type].clear();
        } else {
            combineFilterState[type].clear();
            activeItems.forEach(item => {
                const val = item.dataset.value;
                if (val && val !== 'all') {
                    combineFilterState[type].add(val);
                }
            });
        }
    }
    updateCombineFilterBadge(type);
    renderCombineGrid();
}

function updateCombineFilterBadge(type) {
    const badge = document.getElementById(`combine-filter-badge-${type}`);
    if (!badge) return;
    const count = combineFilterState[type].size;
    badge.textContent = count;
    if (count > 0) {
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

function renderCombineGrid() {
    const grid = document.getElementById('combine-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 필터 적용
    let filtered = inventoryData.filter(item => {
        // 등급 필터
        if (combineFilterState.tier.size > 0) {
            const tier = POKEMON_TIERS[item.id] || 'COMMON';
            if (!combineFilterState.tier.has(tier)) return false;
        }
        // 타입 필터
        if (combineFilterState.type.size > 0) {
            const data = preloadedPokemonData[item.id];
            if (data && data.pokeData && data.pokeData.types) {
                const types = data.pokeData.types.map(t => t.type.name);
                if (!types.some(t => combineFilterState.type.has(t))) return false;
            }
        }
        return true;
    });

    // 이미 슬롯에 있는 포켓몬은 count가 충분하지 않으면 제외
    filtered = filtered.filter(item => {
        const sameInSlots = COMBINE_SLOTS.filter(id => id === item.id).length;
        return item.count > sameInSlots;
    });

    const totalCells = Math.max(40, Math.ceil(filtered.length / 10) * 10);
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        if (i < filtered.length) {
            const item = filtered[i];
            cell.className = 'combine-grid-cell';
            cell.dataset.id = item.id;
            const miniSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${item.id}.png`;
            const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${item.id}.png`;
            cell.innerHTML = `<img crossorigin="anonymous"><span class="count-badge">${item.count}</span>`;
            const spriteImg = cell.querySelector('img');
            loadCroppedSprite(spriteImg, miniSpriteUrl, fallbackSpriteUrl);
            cell.onclick = () => handleCombineGridClick(item);
        } else {
            cell.className = 'combine-grid-cell';
            cell.style.visibility = 'hidden';
        }
        grid.appendChild(cell);
    }
}

function handleCombineGridClick(item) {
    if (combineSelectedSlot === null || combineSelectedSlot >= 3) return;

    // 레전더리 포켓몬은 조합 불가
    const itemTier = POKEMON_TIERS[item.id] || 'COMMON';
    if (itemTier === 'LEGENDARY') {
        showLoginModal('레전더리 포켓몬은 조합할 수 없습니다.', true);
        return;
    }

    // 등급 체크
    if (combineLockedTier !== null && combineLockedTier !== itemTier) {
        showLoginModal(`이미 ${TIER_INFO[combineLockedTier].name} 등급 포켓몬이 슬롯에 있습니다.\n같은 등급의 포켓몬만 넣을 수 있습니다.`, true);
        return;
    }

    // 인벤토리에서 count 감소
    const invItem = inventoryData.find(inv => inv.id === item.id);
    if (!invItem || invItem.count <= 0) return;

    // 같은 포켓몬을 여러 슬롯에 넣을 수 있도록 count 체크
    // 이미 슬롯에 있는 같은 포켓몬 개수 확인
    const sameInSlots = COMBINE_SLOTS.filter(id => id === item.id).length;
    if (sameInSlots >= invItem.count) {
        showLoginModal('인벤토리에 충분한 수량이 없습니다.', true);
        return;
    }

    invItem.count--;
    if (invItem.count <= 0) {
        const idx = inventoryData.indexOf(invItem);
        if (idx !== -1) inventoryData.splice(idx, 1);
    }

    // 슬롯에 추가
    COMBINE_SLOTS[combineSelectedSlot] = item.id;
    if (combineLockedTier === null) {
        combineLockedTier = itemTier;
        // 등급 필터를 해당 등급으로 고정
        combineFilterState.tier.clear();
        combineFilterState.tier.add(itemTier);
        updateCombineFilterBadge('tier');
        // 등급 모달의 active 상태 업데이트
        const tierModal = document.getElementById('combine-tier-modal');
        if (tierModal) {
            tierModal.querySelectorAll('.filter-item').forEach(el => {
                el.classList.toggle('active', el.dataset.value === itemTier);
            });
        }
    }

    combineSelectedSlot = null;
    updateCombineSlots();
    updateCombineRateTable();
    updateCombineExecuteBtn();
    renderCombineGrid();
    renderGrid(); // 인벤토리 그리드도 업데이트
    updateTotalPokemonCount();
}

function handleCombineSlotClick(slotIndex) {
    if (slotIndex >= 3) return;
    
    // 이미 포켓몬이 있는 슬롯 클릭 → 제거
    if (COMBINE_SLOTS[slotIndex] !== null) {
        const pokemonId = COMBINE_SLOTS[slotIndex];
        // 인벤토리에 다시 추가 (도감번호 순서 유지)
        const existing = inventoryData.find(inv => inv.id === pokemonId);
        if (existing) {
            existing.count++;
        } else {
            // 도감번호 순서에 맞게 삽입
            const insertIdx = inventoryData.findIndex(inv => inv.id > pokemonId);
            if (insertIdx === -1) {
                inventoryData.push({ id: pokemonId, count: 1 });
            } else {
                inventoryData.splice(insertIdx, 0, { id: pokemonId, count: 1 });
            }
        }
        COMBINE_SLOTS[slotIndex] = null;
        
        // 모든 슬롯이 비었으면 lockedTier 초기화 + 등급 필터 전체로 복귀
        if (COMBINE_SLOTS.every(s => s === null)) {
            combineLockedTier = null;
            combineFilterState.tier.clear();
            updateCombineFilterBadge('tier');
            const tierModal = document.getElementById('combine-tier-modal');
            if (tierModal) {
                tierModal.querySelectorAll('.filter-item').forEach(el => {
                    el.classList.toggle('active', el.dataset.value === 'all');
                });
            }
        }
        
        combineSelectedSlot = null;
        updateCombineSlots();
        updateCombineRateTable();
        updateCombineExecuteBtn();
        renderCombineGrid();
        renderGrid();
        updateTotalPokemonCount();
        return;
    }
    
    // 빈 슬롯 클릭 → 선택 상태로
    combineSelectedSlot = slotIndex;
    updateCombineSlots();
}

function getCommonTypes() {
    // 슬롯에 있는 포켓몬들의 공통 타입 찾기
    const filledSlots = COMBINE_SLOTS.filter(id => id !== null);
    if (filledSlots.length === 0) return [];
    
    const allTypes = filledSlots.map(id => {
        const data = preloadedPokemonData[id];
        return data ? data.pokeData.types.map(t => t.type.name) : [];
    });
    
    if (allTypes.length === 0 || allTypes.some(t => t.length === 0)) return [];
    
    // 첫 번째 포켓몬의 타입들 중에서 모든 포켓몬이 공통으로 가진 타입만 필터
    const commonTypes = allTypes[0].filter(type => 
        allTypes.every(types => types.includes(type))
    );
    
    return commonTypes;
}

function updateCombineSlots() {
    const commonTypes = getCommonTypes();
    
    for (let i = 0; i < 4; i++) {
        const slotEl = document.querySelector(`.combine-slot[data-slot="${i}"]`);
        if (!slotEl) continue;
        
        const spriteEl = slotEl.querySelector('.combine-slot-sprite');
        const nameEl = slotEl.querySelector('.combine-slot-name');
        const typeBadgeEl = slotEl.querySelector('.combine-slot-type-badge');
        
        if (i < 3 && COMBINE_SLOTS[i] !== null) {
            const pokemonId = COMBINE_SLOTS[i];
            const data = preloadedPokemonData[pokemonId];
            const name = data ? data.speciesData.names.find(n => n.language.name === 'ko').name : `#${pokemonId}`;
            const types = data ? data.pokeData.types.map(t => t.type.name) : [];
            
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
            const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            spriteEl.innerHTML = `<img crossorigin="anonymous">`;
            const img = spriteEl.querySelector('img');
            img.src = spriteUrl;
            img.onerror = () => { img.src = fallbackUrl; };
            
            nameEl.textContent = name;
            
            // 개별 타입 배지 표시
            if (types.length > 0) {
                typeBadgeEl.textContent = TYPE_NAMES_KO[types[0]] || types[0].toUpperCase();
                typeBadgeEl.style.backgroundColor = TYPE_COLORS[types[0]] || '#777';
                typeBadgeEl.classList.add('show');
            } else {
                typeBadgeEl.classList.remove('show');
            }
            
            const borderColor = combineLockedTier ? (TIER_INFO[combineLockedTier].color === '#FFFFFF' ? '#CCC' : TIER_INFO[combineLockedTier].color) : '#AAA';
            slotEl.style.borderColor = borderColor;
        } else if (i < 3) {
            spriteEl.innerHTML = '';
            nameEl.textContent = i === combineSelectedSlot ? '▼ 선택' : '비어있음';
            typeBadgeEl.classList.remove('show');
            slotEl.style.borderColor = '#AAA';
            slotEl.style.backgroundColor = i === combineSelectedSlot ? '#F0EBEB' : 'white';
        } else {
            // 결과 슬롯 (slot 3) - 항상 물음표만 표시
            spriteEl.innerHTML = '';
            nameEl.textContent = '?';
            
            // 공통 타입이 있으면 표시, 없으면 "무작위"
            const allFilled = COMBINE_SLOTS.every(s => s !== null);
            if (allFilled && commonTypes.length > 0) {
                typeBadgeEl.textContent = TYPE_NAMES_KO[commonTypes[0]] || commonTypes[0].toUpperCase();
                typeBadgeEl.style.backgroundColor = TYPE_COLORS[commonTypes[0]] || '#777';
                typeBadgeEl.classList.add('show');
            } else if (allFilled) {
                typeBadgeEl.textContent = '무작위';
                typeBadgeEl.style.backgroundColor = '#888';
                typeBadgeEl.classList.add('show');
            } else {
                typeBadgeEl.classList.remove('show');
            }
        }
    }
}

// 진화 라인이 있는 포켓몬의 기본 형태(1단계)만 포함
// NON_EVOLVING_GEN1 = 최종 진화체 목록이므로, 이 목록에 없는 포켓몬 중에서
// 진화 라인의 첫 단계(기본 형태)만 결과로 나올 수 있음
const BASIC_POKEMON = new Set([
    1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48,
    50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92,
    95, 96, 98, 100, 102, 104, 108, 109, 111, 114, 115, 116, 118, 120, 122, 123,
    124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144,
    145, 146, 147, 150, 151
]);

function getCombineResultId() {
    if (!COMBINE_SLOTS.every(s => s !== null)) return null;
    
    // 등급 기반 랜덤 결과
    const tier = combineLockedTier || 'COMMON';
    const rates = COMBINE_RATES[tier];
    if (!rates) return null;
    
    // 확률에 따라 결과 등급 결정
    const rand = Math.random() * 100;
    let cumulative = 0;
    let resultTier = tier;
    for (const [targetTier, pct] of Object.entries(rates)) {
        cumulative += pct;
        if (rand < cumulative) {
            resultTier = targetTier;
            break;
        }
    }
    
    // 공통 타입 찾기
    const commonTypes = getCommonTypes();
    
    // 결과 등급 + 기본 형태(Basic) 포켓몬 중 랜덤 선택
    let candidates = Object.entries(POKEMON_TIERS)
        .filter(([id, t]) => t === resultTier && BASIC_POKEMON.has(parseInt(id)))
        .map(([id]) => parseInt(id));
    
    // 공통 타입이 있으면 그 타입을 가진 포켓몬으로 필터
    if (commonTypes.length > 0) {
        const typeFiltered = candidates.filter(id => {
            const data = preloadedPokemonData[id];
            if (!data || !data.pokeData) return false;
            const types = data.pokeData.types.map(t => t.type.name);
            return types.some(t => commonTypes.includes(t));
        });
        if (typeFiltered.length > 0) {
            candidates = typeFiltered;
        }
    }
    
    if (candidates.length === 0) return COMBINE_SLOTS[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function updateCombineRateTable() {
    const container = document.getElementById('combine-rate-rows');
    if (!container) return;
    
    if (!combineLockedTier) {
        container.innerHTML = '';
        return;
    }
    const rates = COMBINE_RATES[combineLockedTier];
    if (!rates) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = Object.entries(rates).map(([targetTier, pct]) => `
        <div class="combine-rate-row">
            <span class="rate-tier" style="color:${TIER_INFO[targetTier].color}">${TIER_INFO[targetTier].name}</span>
            <span class="rate-pct">${pct}%</span>
        </div>
    `).join('');
}

function updateCombineExecuteBtn() {
    const btn = document.getElementById('btn-combine-execute');
    if (!btn) return;
    const allFilled = COMBINE_SLOTS.every(s => s !== null);
    btn.disabled = !allFilled;
}

function executeCombine() {
    if (!COMBINE_SLOTS.every(s => s !== null)) return;
    
    // 결과 포켓몬 결정
    const resultId = getCombineResultId();
    if (!resultId) return;
    
    // 슬롯 비우기
    COMBINE_SLOTS[0] = null;
    COMBINE_SLOTS[1] = null;
    COMBINE_SLOTS[2] = null;
    combineLockedTier = null;
    combineSelectedSlot = null;
    
    // 등급 필터 초기화
    combineFilterState.tier.clear();
    updateCombineFilterBadge('tier');
    const tierModal = document.getElementById('combine-tier-modal');
    if (tierModal) {
        tierModal.querySelectorAll('.filter-item').forEach(el => {
            el.classList.toggle('active', el.dataset.value === 'all');
        });
    }
    
    // 결과 포켓몬을 인벤토리에 추가 (도감번호 순서 유지)
    const existing = inventoryData.find(inv => inv.id === resultId);
    if (existing) {
        existing.count++;
    } else {
        const insertIdx = inventoryData.findIndex(inv => inv.id > resultId);
        if (insertIdx === -1) {
            inventoryData.push({ id: resultId, count: 1 });
        } else {
            inventoryData.splice(insertIdx, 0, { id: resultId, count: 1 });
        }
    }
    
    // 결과 표시
    const data = preloadedPokemonData[resultId];
    const name = data ? data.speciesData.names.find(n => n.language.name === 'ko').name : `#${resultId}`;
    showLoginModal(`조합 성공!\n${name}을(를) 얻었습니다!`, true);
    
    updateCombineSlots();
    updateCombineRateTable();
    updateCombineExecuteBtn();
    renderCombineGrid();
    renderGrid();
    updateTotalPokemonCount();
}

// 조합 버튼 이벤트
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-combine-execute');
    if (btn) {
        btn.addEventListener('click', executeCombine);
    }
    
    // 슬롯 클릭 이벤트
    document.querySelectorAll('.combine-slot[data-slot]').forEach(el => {
        const slotIdx = parseInt(el.dataset.slot);
        el.addEventListener('click', () => handleCombineSlotClick(slotIdx));
    });
});

// ===== 뽑기 시스템 =====
let gachaTicketCount = 0;
let gachaInitialized = false;

const GACHA_RATES = {
    'COMMON': 60,
    'UNCOMMON': 25,
    'RARE': 10,
    'EPIC': 3.5,
    'UNIQUE': 1.2,
    'LEGENDARY': 0.3
};

function initGachaView() {
    if (gachaInitialized) {
        updateGachaTicketDisplay();
        return;
    }
    gachaInitialized = true;
    updateGachaTicketDisplay();
    renderGachaResult([]);
}

function updateGachaTicketDisplay() {
    const ticketEl = document.getElementById('gacha-ticket-count');
    if (ticketEl) {
        ticketEl.textContent = gachaTicketCount;
    }
    // 티켓이 부족하면 버튼 비활성화
    document.getElementById('btn-gacha-1').disabled = gachaTicketCount < 1;
    document.getElementById('btn-gacha-10').disabled = gachaTicketCount < 10;
}

function getGachaResultTier() {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const [tier, rate] of Object.entries(GACHA_RATES)) {
        cumulative += rate;
        if (rand < cumulative) return tier;
    }
    return 'COMMON';
}

function getGachaPokemonId(tier) {
    // 해당 등급의 기본 형태(Basic) 포켓몬 중 랜덤 선택
    let candidates = Object.entries(POKEMON_TIERS)
        .filter(([id, t]) => t === tier && BASIC_POKEMON.has(parseInt(id)))
        .map(([id]) => parseInt(id));
    
    if (candidates.length === 0) {
        // 해당 등급에 기본 형태가 없으면 모든 포켓몬 중에서
        candidates = Object.entries(POKEMON_TIERS)
            .filter(([id, t]) => t === tier)
            .map(([id]) => parseInt(id));
    }
    
    if (candidates.length === 0) return 1; // 기본값: 이상해씨
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function renderGachaResult(results) {
    const grid = document.getElementById('gacha-result-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (results.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;color:#8B6914;font-size:12px;">뽑기를 실행하면 결과가 표시됩니다</div>';
        return;
    }
    
    results.forEach((result, index) => {
        const cell = document.createElement('div');
        cell.className = 'gacha-result-cell';
        cell.style.animationDelay = `${index * 0.1}s`;
        
        const data = preloadedPokemonData[result.id];
        const name = data ? data.speciesData.names.find(n => n.language.name === 'ko').name : `#${result.id}`;
        const tierInfo = TIER_INFO[result.tier];
        
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${result.id}.png`;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${result.id}.png`;
        
        cell.innerHTML = `
            <img crossorigin="anonymous">
            <span class="gacha-result-name">${name}</span>
            <span class="gacha-result-tier" style="color:${tierInfo.color}">${tierInfo.name}</span>
        `;
        
        const img = cell.querySelector('img');
        loadCroppedSprite(img, spriteUrl, fallbackUrl);
        
        grid.appendChild(cell);
    });
}

function startGacha(count) {
    if (typeof count !== 'number') {
        // 레버나 PULL 버튼 클릭 시 1회 뽑기
        count = 1;
    }
    
    if (gachaTicketCount < count) {
        showLoginModal('뽑기 티켓이 부족합니다.', true);
        return;
    }
    
    // 티켓 차감
    gachaTicketCount -= count;
    updateGachaTicketDisplay();
    
    // 뽑기 실행
    const results = [];
    for (let i = 0; i < count; i++) {
        const tier = getGachaResultTier();
        const id = getGachaPokemonId(tier);
        results.push({ id, tier });
        
        // 인벤토리에 추가
        const existing = inventoryData.find(inv => inv.id === id);
        if (existing) {
            existing.count++;
        } else {
            const insertIdx = inventoryData.findIndex(inv => inv.id > id);
            if (insertIdx === -1) {
                inventoryData.push({ id, count: 1 });
            } else {
                inventoryData.splice(insertIdx, 0, { id, count: 1 });
            }
        }
    }
    
    // 결과 표시
    renderGachaResult(results);
    
    // 알 애니메이션
    const egg = document.getElementById('gacha-egg');
    if (egg) {
        egg.classList.remove('shake', 'hatch');
        // 강제 리플로우
        void egg.offsetWidth;
        egg.classList.add('shake');
        setTimeout(() => {
            egg.classList.remove('shake');
            egg.classList.add('hatch');
            setTimeout(() => {
                egg.classList.remove('hatch');
            }, 800);
        }, 500);
    }
    
    // 디스플레이 업데이트
    const display = document.getElementById('gacha-display-text');
    if (display) {
        const tierNames = results.map(r => TIER_INFO[r.tier].name);
        const uniqueTiers = [...new Set(tierNames)];
        display.textContent = `${count}회 뽑기 완료! (${uniqueTiers.join(', ')})`;
        setTimeout(() => {
            display.textContent = '뽑기 기계';
        }, 3000);
    }
    
    // 인벤토리 그리드 업데이트
    renderGrid();
    updateTotalPokemonCount();
}

// ===== 반응형 리사이즈 =====
const BASE_WIDTH = 800;
const BASE_HEIGHT = 620; // top-tabs(약 40px) + game-container(540px) + 여유

function updateScale() {
    const wrapper = document.getElementById('app-wrapper');
    if (!wrapper) return;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const scaleX = maxWidth / BASE_WIDTH;
    const scaleY = maxHeight / BASE_HEIGHT;
    const scale = Math.min(scaleX, scaleY, 1); // 최대 1배율 (확대 안함)
    wrapper.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', updateScale);
window.addEventListener('load', updateScale);

initCurrencyBar();
initFilterModals();
renderGrid();
clearLeftPanel();
startBackgroundPreload();
