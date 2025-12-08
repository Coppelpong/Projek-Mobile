from jose import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")
ALGORITHM = "HS256"
EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", 2))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
