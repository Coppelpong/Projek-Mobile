from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
from app.database import readings_collection
from app.models.reading import ReadingIn

router = APIRouter(prefix="/api/readings", tags=["Readings"])

@router.post("/{device_id}")
async def log_reading(device_id: str, data: ReadingIn):
    try:
        doc = {
            "device_id": ObjectId(device_id),
            "weightKg": data.weightKg,
            "percent": data.percent,
            "timestamp": datetime.utcnow()
        }
        await readings_collection.insert_one(doc)
        return {"status": "ok", "message": "Data logged", "data": doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/latest/{device_id}")
async def get_latest(device_id: str):
    doc = await readings_collection.find_one(
        {"device_id": ObjectId(device_id)},
        sort=[("timestamp", -1)]
    )
    if not doc:
        raise HTTPException(status_code=404, detail="No data found")
    return doc
