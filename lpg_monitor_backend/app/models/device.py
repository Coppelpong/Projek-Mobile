from pydantic import BaseModel
from typing import Optional

class DeviceCreate(BaseModel):
    name: str
    mac: Optional[str]
    location: Optional[str]
    tareWeightKg: float = 3.0
    maxCapacityKg: float = 5.0
    lowThresholdPercent: float = 15.0
