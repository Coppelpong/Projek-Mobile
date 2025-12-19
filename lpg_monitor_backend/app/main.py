# UPDATE ROUTER READINGS - FIX
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router
from app.routes import auth, devices, readings  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "backend running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ==========================================
# DAFTARKAN ROUTER (JANGAN DIHAPUS)
# ==========================================
app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(readings.router) 