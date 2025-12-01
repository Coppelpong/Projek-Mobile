from fastapi import APIRouter, HTTPException, Depends, Body
from passlib.context import CryptContext
from app.database import users_collection
from app.utils.jwt_handler import create_access_token
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Model input (jika kamu belum punya file models)
from pydantic import BaseModel, EmailStr

class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# REGISTER
@router.post("/register")
async def register_user(user: UserIn):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
    }

    result = await users_collection.insert_one(new_user)
    return {"status": "ok", "user_id": str(result.inserted_id)}

# LOGIN
@router.post("/login")
async def login_user(user: UserLogin):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(user.password, existing["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"user_id": str(existing["_id"])})
    return {"status": "ok", "token": token, "user": {"username": existing["username"], "email": existing["email"]}}
