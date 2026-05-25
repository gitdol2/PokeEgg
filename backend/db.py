"""
데이터 접근 계층 (Data Access Layer)
현재는 JSON 파일 기반, 나중에 MySQL로 교체 예정
"""

import json
import os
import threading
import urllib.request
import urllib.error
from datetime import datetime


DB_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(DB_DIR, 'users.json')
POKEMON_DATA_FILE = os.path.join(DB_DIR, 'pokemon_data.json')

_lock = threading.Lock()


# ===== JSON 파일 읽기/쓰기 헬퍼 =====

def _read_json(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def _write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ===== Users DB =====

def get_all_users():
    """모든 유저 반환"""
    with _lock:
        return _read_json(USERS_FILE)


def _save_all_users(users):
    with _lock:
        _write_json(USERS_FILE, users)


def user_exists(nickname):
    """닉네임 중복 체크"""
    users = get_all_users()
    return nickname in users


def register_user(nickname, password):
    """신규 유저 등록"""
    with _lock:
        users = _read_json(USERS_FILE)
        if nickname in users:
            return False  # 이미 존재
        users[nickname] = {
            "password": password,
            "created": datetime.now().isoformat(),
            "currency": {
                "pt": 0,
                "silver": 0,
                "gold": 0,
                "cp": 0
            },
            "inventory": {},       # { "pokemon_id": count, ... }
            "dex": [],             # [pokemon_id, ...] 보유한 도감 번호
            "partner": None,       # 파트너 포켓몬 id
            "playtime": 0,         # 초 단위
            "character": 1,        # 선택한 캐릭터 id
            "held_items": {}       # { "pokemon_id": "item_name", ... }
        }
        _write_json(USERS_FILE, users)
        return True


def check_password(nickname, password):
    """비밀번호 확인"""
    users = get_all_users()
    user = users.get(nickname)
    if user is None:
        return False
    return user["password"] == password


def get_user(nickname):
    """특정 유저 정보 반환 (비밀번호 제외)"""
    users = get_all_users()
    user = users.get(nickname)
    if user is None:
        return None
    # 비밀번호 제외하고 반환
    return {k: v for k, v in user.items() if k != "password"}


def update_user(nickname, data):
    """유저 데이터 업데이트 (부분 업데이트)"""
    with _lock:
        users = _read_json(USERS_FILE)
        if nickname not in users:
            return False
        users[nickname].update(data)
        _write_json(USERS_FILE, users)
        return True


def delete_user(nickname):
    """유저 계정 삭제"""
    with _lock:
        users = _read_json(USERS_FILE)
        if nickname not in users:
            return False
        del users[nickname]
        _write_json(USERS_FILE, users)
        return True


# ===== Pokemon Master Data =====

def get_pokemon_data_all():
    """모든 포켓몬 마스터 데이터 반환"""
    with _lock:
        return _read_json(POKEMON_DATA_FILE)


def get_pokemon_data(pokemon_id):
    """특정 포켓몬 마스터 데이터 반환"""
    data = get_pokemon_data_all()
    return data.get(str(pokemon_id))


def init_pokemon_data():
    """pokemon_data.json이 없으면 기본 데이터로 초기화"""
    if os.path.exists(POKEMON_DATA_FILE):
        return

    # 프론트엔드 script.js의 POKEMON_TIERS, TIER_INFO 기반 기본 데이터
    TIER_PRICE = {
        'COMMON': 10, 'UNCOMMON': 20, 'RARE': 50,
        'EPIC': 200, 'UNIQUE': 500, 'LEGENDARY': 1000
    }

    POKEMON_TIERS = {
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
        1: 'UNCOMMON', 2: 'UNCOMMON', 3: 'UNCOMMON',
        4: 'UNCOMMON', 5: 'UNCOMMON', 6: 'UNCOMMON',
        7: 'UNCOMMON', 8: 'UNCOMMON', 9: 'UNCOMMON',
        25: 'UNCOMMON', 26: 'UNCOMMON',
        35: 'UNCOMMON', 36: 'UNCOMMON', 37: 'UNCOMMON', 38: 'UNCOMMON',
        39: 'UNCOMMON', 40: 'UNCOMMON', 58: 'UNCOMMON', 59: 'UNCOMMON',
        113: 'UNCOMMON', 130: 'UNCOMMON',
        133: 'UNCOMMON', 134: 'UNCOMMON', 135: 'UNCOMMON', 136: 'UNCOMMON',
        143: 'UNCOMMON',
        149: 'RARE',
        144: 'LEGENDARY', 145: 'LEGENDARY', 146: 'LEGENDARY',
        150: 'LEGENDARY', 151: 'LEGENDARY',
    }

    NON_EVOLVING = [
        3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40,
        45, 47, 49, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80,
        83, 85, 87, 89, 91, 94, 97, 99, 101, 103, 105, 106, 107, 110,
        112, 113, 114, 115, 119, 121, 122, 124, 125, 126, 127, 128,
        130, 131, 132, 134, 135, 136, 139, 141, 142, 143,
        144, 145, 146, 149, 150, 151
    ]

    # 진화 체인 (간단한 next evolution 매핑)
    EVOLUTION_CHAIN = {
        1: 2, 2: 3, 4: 5, 5: 6, 7: 8, 8: 9,
        10: 11, 11: 12, 13: 14, 14: 15, 16: 17, 17: 18,
        19: 20, 21: 22, 23: 24, 25: 26, 27: 28, 29: 30, 30: 31,
        32: 33, 33: 34, 35: 36, 37: 38, 39: 40,
        41: 42, 43: 44, 44: 45, 46: 47, 48: 49,
        50: 51, 52: 53, 54: 55, 56: 57, 58: 59,
        60: 61, 61: 62, 63: 64, 64: 65, 66: 67, 67: 68,
        69: 70, 70: 71, 72: 73, 74: 75, 75: 76,
        77: 78, 79: 80, 81: 82, 84: 85, 86: 87, 88: 89,
        90: 91, 92: 93, 93: 94, 95: None, 96: 97, 98: 99,
        100: 101, 102: 103, 104: 105, 108: None, 109: 110,
        111: 112, 116: 117, 118: 119, 120: 121,
        123: None, 129: 130, 133: 134, 137: None,
        138: 139, 140: 141, 147: 148, 148: 149
    }

    data = {}
    for i in range(1, 152):
        tier = POKEMON_TIERS.get(i, 'COMMON')
        sid = str(i)
        data[sid] = {
            "tier": tier,
            "price": TIER_PRICE[tier],
            "evolves_to": EVOLUTION_CHAIN.get(i),
            "can_evolve": i not in NON_EVOLVING,
            "held_item": None
        }

    with _lock:
        _write_json(POKEMON_DATA_FILE, data)


# ===== PokeAPI 캐싱 =====

POKEAPI_CACHE_FILE = os.path.join(DB_DIR, 'pokeapi_cache.json')

def _fetch_json(url):
    """PokeAPI에서 JSON 데이터 가져오기"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'PokeEgg/1.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"PokeAPI fetch error: {url} - {e}")
        return None


def get_pokeapi_cache():
    """캐시된 PokeAPI 데이터 반환"""
    with _lock:
        return _read_json(POKEAPI_CACHE_FILE)


def _save_pokeapi_cache(data):
    with _lock:
        _write_json(POKEAPI_CACHE_FILE, data)


def refresh_pokeapi_cache():
    """PokeAPI에서 모든 1세대 포켓몬 데이터를 가져와 캐싱"""
    cache = {}
    for i in range(1, 152):
        species_url = f"https://pokeapi.co/api/v2/pokemon-species/{i}"
        pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{i}"
        
        species_data = _fetch_json(species_url)
        pokemon_data = _fetch_json(pokemon_url)
        
        if species_data and pokemon_data:
            # 필요한 필드만 추출
            entry = {
                "id": i,
                "name_ko": None,
                "habitat": None,
                "flavor_text": None,
                "types": [],
                "stats": [],
                "genus": None
            }
            
            # 한글 이름
            for name_entry in species_data.get("names", []):
                if name_entry.get("language", {}).get("name") == "ko":
                    entry["name_ko"] = name_entry["name"]
                    break
            if not entry["name_ko"]:
                entry["name_ko"] = species_data.get("name", f"pokemon_{i}")
            
            # 서식지
            if species_data.get("habitat"):
                entry["habitat"] = species_data["habitat"]["name"]
            
            # 도감 설명 (한글)
            for flavor in species_data.get("flavor_text_entries", []):
                if flavor.get("language", {}).get("name") == "ko":
                    entry["flavor_text"] = flavor["flavor_text"].replace("\n", " ").replace("\f", " ")
                    break
            if not entry["flavor_text"]:
                for flavor in species_data.get("flavor_text_entries", []):
                    if flavor.get("language", {}).get("name") == "en":
                        entry["flavor_text"] = flavor["flavor_text"].replace("\n", " ").replace("\f", " ")
                        break
            
            # 분류
            for genus_entry in species_data.get("genera", []):
                if genus_entry.get("language", {}).get("name") == "ko":
                    entry["genus"] = genus_entry["genus"]
                    break
            
            # 타입
            for t in pokemon_data.get("types", []):
                entry["types"].append(t["type"]["name"])
            
            # 능력치
            for stat in pokemon_data.get("stats", []):
                entry["stats"].append({
                    "name": stat["stat"]["name"],
                    "base": stat["base_stat"]
                })
            
            cache[str(i)] = entry
        
        # 진행상황 출력
        if i % 10 == 0:
            print(f"PokeAPI 캐싱 진행 중: {i}/151")
    
    _save_pokeapi_cache(cache)
    print(f"PokeAPI 캐싱 완료! {len(cache)}마리 저장됨")
    return cache


def get_all_pokemon_details():
    """모든 포켓몬 상세 정보 반환 (캐시 사용)"""
    cache = get_pokeapi_cache()
    if not cache:
        # 캐시 없으면 새로 가져오기
        cache = refresh_pokeapi_cache()
    return cache
