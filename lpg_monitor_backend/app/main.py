from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router yang sudah kamu buat
from app.routes import auth, devices, readings  # <--- Pastikan readings ada di sini

app = FastAPI()

# Konfigurasi CORS (Agar Frontend bisa akses)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan akses dari semua domain (Vercel, Localhost, dll)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cek status server
@app.get("/")
def read_root():
    return {"status": "backend running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ==========================================
# DAFTARKAN ROUTER DI SINI (PENTING!)
# ==========================================
app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(readings.router) 