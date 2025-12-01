from datetime import datetime, timedelta
from app.database import readings_collection
from bson import ObjectId

async def get_average_usage(device_id: str, period: str = "daily"):
    now = datetime.utcnow()
    if period == "daily":
        start = now - timedelta(days=1)
    elif period == "weekly":
        start = now - timedelta(weeks=1)
    else:
        start = now - timedelta(days=30)

    cursor = readings_collection.find({
        "device_id": ObjectId(device_id),
        "timestamp": {"$gte": start, "$lte": now}
    })
    data = [r async for r in cursor]
    if len(data) < 2:
        return {"averageUsageKg": 0, "samples": len(data)}

    total_used = sum(
        abs(data[i]["weightKg"] - data[i - 1]["weightKg"])
        for i in range(1, len(data))
    )
    return {
        "period": period,
        "averageUsageKg": total_used / len(data),
        "samples": len(data)
    }
