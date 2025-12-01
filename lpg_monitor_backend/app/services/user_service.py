from app.database import users_collection
from app.schemas.user import UserInDB, UserResponse
from passlib.context import CryptContext
from datetime import datetime
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(email: str, password: str):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        return {"error": "User already exists"}
    
    # Hash password
    hashed_password = pwd_context.hash(password)
    
    # Create user document
    user_data = {
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    # Insert user
    result = await users_collection.insert_one(user_data)
    
    return {
        "message": "User created successfully", 
        "user_id": str(result.inserted_id),
        "email": email
    }

async def get_user_by_email(email: str):
    user = await users_collection.find_one({"email": email})
    return user

async def get_user_by_id(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return user

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)