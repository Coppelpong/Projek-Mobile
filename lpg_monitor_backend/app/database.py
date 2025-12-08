from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ======================================================
# MONGODB ATLAS
# ======================================================
MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is missing")

client = AsyncIOMotorClient(MONGODB_URI)
db = client["lpg_monitor_db"]

users_collection = db["users"]
devices_collection = db["devices"]
readings_collection = db["readings"]
analytics_collection = db["analytics"]

# ======================================================
# SQL DATABASE
# ======================================================
DATABASE_URL = os.getenv("DATABASE_URL")  # should be PostgreSQL or MySQL

engine = create_engine(DATABASE_URL)
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
    "get_db",
]
