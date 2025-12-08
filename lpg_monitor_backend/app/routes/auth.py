from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from app.database import users_collection
from app.utils.jwt_handler import create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ===============================
# Pydantic Models
# ===============================
class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ===============================
# REGISTER USER
# ===============================
@router.post("/register")
async def register_user(user: UserIn):
    email_clean = user.email.strip().lower()

    existing = await users_collection.find_one({"email": email_clean})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = {
        "username": user.username,
        "email": email_clean,
        "password": hashed_password,
    }

    result = await users_collection.insert_one(new_user)

    return {
        "status": "ok",
        "user_id": str(result.inserted_id),
        "message": "Registration successful"
    }


# ===============================
# LOGIN USER
# ===============================
@router.post("/login")
async def login_user(user: UserLogin):
    email_clean = user.email.strip().lower()

    existing = await users_collection.find_one({"email": email_clean})
    if not existing:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not pwd_context.verify(user.password, existing["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"user_id": str(existing["_id"])})

    return {
        "status": "ok",
        "token": token,
        "user": {
            "id": str(existing["_id"]),
            "username": existing["username"],
            "email": existing["email"]
        }
    }

