"""
PokeEgg Backend API Server (FastAPI)
JSON 파일 기반 DB → 추후 MySQL로 교체 예정
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import Optional, Any
import os
from db import (
    user_exists, register_user, check_password, get_user,
    update_user, get_pokemon_data_all, get_pokemon_data,
    init_pokemon_data, get_all_pokemon_details, refresh_pokeapi_cache
)

app = FastAPI(title="PokeEgg API", version="1.0.0")

# CORS 설정 (개발용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== 정적 파일 서빙 (프론트엔드) =====
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')

# index.html을 루트(/)에서 서빙
@app.get("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>PokeEgg</h1>")

# CSS, JS, assets 등 정적 파일 서빙
app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

# ===== 서버 시작 시 pokemon_data.json 초기화 =====
@app.on_event("startup")
def startup():
    init_pokemon_data()


# ===== 요청/응답 모델 =====

class LoginRequest(BaseModel):
    nickname: str = Field(..., min_length=1, max_length=20)
    password: str = Field(default="", max_length=30)

class CheckUserRequest(BaseModel):
    nickname: str = Field(..., min_length=1, max_length=20)

class UpdateUserRequest(BaseModel):
    data: dict[str, Any]


# ===== 유저 API =====

@app.post("/api/user/login")
def login(req: LoginRequest):
    """로그인 또는 회원가입"""
    nickname = req.nickname.strip()
    password = req.password.strip()

    if not nickname:
        raise HTTPException(status_code=400, detail="닉네임을 입력해주세요.")

    if user_exists(nickname):
        if not check_password(nickname, password):
            raise HTTPException(
                status_code=401,
                detail="비밀번호가 틀렸습니다.\n가입을 원하는 경우 다른 닉네임으로 로그인을 시도해주세요."
            )
        user_data = get_user(nickname)
        return {"success": True, "is_new": False, "user": user_data}
    else:
        if register_user(nickname, password):
            user_data = get_user(nickname)
            return {"success": True, "is_new": True, "user": user_data}
        else:
            raise HTTPException(status_code=500, detail="가입에 실패했습니다.")


@app.post("/api/user/check")
def check_user(req: CheckUserRequest):
    """닉네임 중복 체크"""
    nickname = req.nickname.strip()
    exists = user_exists(nickname)
    return {"exists": exists}


@app.get("/api/user/{nickname}")
def get_user_data(nickname: str):
    """유저 정보 조회"""
    user_data = get_user(nickname)
    if user_data is None:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    return {"success": True, "user": user_data}


@app.post("/api/user/{nickname}/update")
def update_user_data(nickname: str, req: UpdateUserRequest):
    """유저 데이터 업데이트"""
    if not req.data:
        raise HTTPException(status_code=400, detail="데이터가 없습니다.")

    if update_user(nickname, req.data):
        user_data = get_user(nickname)
        return {"success": True, "user": user_data}
    else:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")


@app.post("/api/user/{nickname}/delete")
def delete_user_data(nickname: str):
    """유저 계정 삭제"""
    from db import delete_user
    if delete_user(nickname):
        return {"success": True, "message": "계정이 삭제되었습니다."}
    else:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")


# ===== 포켓몬 마스터 데이터 API =====

@app.get("/api/pokemon")
def get_all_pokemon_data():
    """모든 포켓몬 마스터 데이터 조회"""
    data = get_pokemon_data_all()
    return {"success": True, "data": data}


# ===== PokeAPI 캐시 엔드포인트 (pokemon/{id}보다 먼저 선언) =====

@app.get("/api/pokemon/all-details")
def get_all_pokemon_details_api():
    """모든 포켓몬 상세 정보 반환 (PokeAPI 캐시)"""
    data = get_all_pokemon_details()
    return {"success": True, "data": data}


@app.post("/api/pokemon/refresh-cache")
def refresh_pokeapi_cache_api():
    """PokeAPI 캐시 강제 갱신"""
    data = refresh_pokeapi_cache()
    return {"success": True, "count": len(data)}


@app.get("/api/pokemon/{pokemon_id}")
def get_single_pokemon_data(pokemon_id: int):
    """특정 포켓몬 마스터 데이터 조회"""
    data = get_pokemon_data(pokemon_id)
    if data is None:
        raise HTTPException(status_code=404, detail="포켓몬을 찾을 수 없습니다.")
    return {"success": True, "data": data}


# ===== 헬스 체크 =====

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "PokeEgg API is running"}
