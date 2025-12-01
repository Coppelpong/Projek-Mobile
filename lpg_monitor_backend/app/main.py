from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, devices

app = FastAPI()

# ⬇️ tambahkan ini (CORS setup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # atau ganti dengan ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(devices.router)
