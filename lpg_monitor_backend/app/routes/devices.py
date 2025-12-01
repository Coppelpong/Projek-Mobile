from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.database import devices_collection
from app.utils.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/devices", tags=["Devices"])

# ✅ Model input dari frontend
class DeviceCreate(BaseModel):
    name: str
    location: str

@router.post("/", dependencies=[Depends(get_current_user)])
async def create_device(device: DeviceCreate, current_user: dict = Depends(get_current_user)):
    new_device = {
        "name": device.name,
        "location": device.location,
        "status": "active",
        "created_at": datetime.utcnow(),
        "user_id": str(current_user["_id"]),  # kaitkan dengan user login
    }
    result = await devices_collection.insert_one(new_device)
    return {"status": "ok", "device_id": str(result.inserted_id)}


# ✅ Ambil semua device milik user login
@router.get("/")
async def get_devices(current_user: dict = Depends(get_current_user)):
    devices = await devices_collection.find({"user_id": str(current_user["_id"])}).to_list(100)
    for d in devices:
        d["_id"] = str(d["_id"])
    return devices

