from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ======================================================
# MONGODB (untuk data sensor dan user)
# ======================================================
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client["lpg_monitor_db"]

# Koleksi MongoDB
users_collection = db["users"]
devices_collection = db["devices"]
readings_collection = db["readings"]
analytics_collection = db["analytics"]

# ======================================================
# SQL ALCHEMY (kalau kamu juga pakai relasional)
# ======================================================
# Kalau tidak pakai, boleh diabaikan bagian ini
DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./lpg_monitor.db"
)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db_sess = SessionLocal()
    try:
        yield db_sess
    finally:
        db_sess.close()

__all__ = [
    "db",
    "users_collection",
    "devices_collection",
    "readings_collection",
    "analytics_collection",
    "engine",
    "SessionLocal",
    "Base",
    "get_db"
]
