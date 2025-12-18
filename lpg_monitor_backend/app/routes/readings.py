from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
from app.database import readings_collection
from app.models.reading import ReadingIn

router = APIRouter(prefix="/api/readings", tags=["Readings"])

# 1. Endpoint untuk Arduino mengirim data (POST)
@router.post("/{device_id}")
async def log_reading(device_id: str, data: ReadingIn):
    try:
        doc = {
            # Kita simpan sebagai String agar konsisten dengan data dummy
            "device_id": device_id, 
            "weightKg": data.weightKg,
            "percent": data.percent,
            "timestamp": datetime.utcnow()
        }
        await readings_collection.insert_one(doc)
        
        # Konversi ObjectId ke string untuk response
        doc["_id"] = str(doc["_id"])
        return {"status": "ok", "message": "Data logged", "data": doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Endpoint untuk mengambil SATU data terakhir (GET Latest)
@router.get("/latest/{device_id}")
async def get_latest(device_id: str):
    # Cari device_id sebagai String
    doc = await readings_collection.find_one(
        {"device_id": device_id}, 
        sort=[("timestamp", -1)]
    )
    
    # Jika tidak ketemu sebagai String, coba cari sebagai ObjectId (jaga-jaga)
    if not doc:
        try:
            doc = await readings_collection.find_one(
                {"device_id": ObjectId(device_id)}, 
                sort=[("timestamp", -1)]
            )
        except:
            pass

    if not doc:
        raise HTTPException(status_code=404, detail="No data found")
    
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("device_id"), ObjectId):
        doc["device_id"] = str(doc["device_id"])
        
    return doc

# 3. Endpoint untuk mengambil HISTORY data (INI YANG HILANG SEBELUMNYA)
# Digunakan oleh Grafik di Frontend
@router.get("/{device_id}")
async def get_readings_history(device_id: str):
    # Ambil 50 data terakhir, urutkan dari yang terbaru
    cursor = readings_collection.find({"device_id": device_id}).sort("timestamp", 1).limit(50)
    readings = await cursor.to_list(length=50)

    # Jika kosong, coba cari pakai ObjectId (siapa tahu format lama)
    if not readings:
        try:
            cursor = readings_collection.find({"device_id": ObjectId(device_id)}).sort("timestamp", 1).limit(50)
            readings = await cursor.to_list(length=50)
        except:
            pass

    # Rapikan format data (ubah ObjectId jadi string)
    results = []
    for doc in readings:
        doc["_id"] = str(doc["_id"])
        if isinstance(doc.get("device_id"), ObjectId):
            doc["device_id"] = str(doc["device_id"])
        results.append(doc)

    return results