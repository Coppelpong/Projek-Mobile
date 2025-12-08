from motor.motor_asyncio import AsyncIOMotorClient
import os

# =======================================
# MONGODB ATLAS CONNECTION
# =======================================

MONGO_URL = os.getenv("MONGO_URL")  # diambil dari Render Environment Variables

if not MONGO_URL:
    raise Exception("❌ MONGO_URL is missing. Set it in Render environment variables.")

client = AsyncIOMotorClient(MONGO_URL)
db = client["lpg_monitor_db"]

# Koleksi MongoDB
users_collection = db["users"]
devices_collection = db["devices"]
readings_collection = db["readings"]
analytics_collection = db["analytics"]

__all__ = [
    "db",
    "users_collection",
    "devices_collection",
    "readings_collection",
    "analytics_collection",
]
