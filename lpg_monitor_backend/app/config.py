import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_EXPIRE = os.getenv("JWT_EXPIRE", "7d")
