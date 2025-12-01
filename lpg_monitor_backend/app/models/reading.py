from pydantic import BaseModel

class ReadingIn(BaseModel):
    weightKg: float
    percent: float
