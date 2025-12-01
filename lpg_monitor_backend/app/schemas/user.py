from pydantic import BaseModel, EmailStr, Field

# ------------------------------------------------------
# Skema data untuk membuat user baru
# ------------------------------------------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# ------------------------------------------------------
# Skema data yang dikembalikan ke client
# ------------------------------------------------------
class UserResponse(BaseModel):
    id: str | None = None
    email: EmailStr

    class Config:
        from_attributes = True  # pengganti orm_mode (Pydantic v2)


# ------------------------------------------------------
# Skema data untuk user yang disimpan di database
# ------------------------------------------------------
class UserInDB(BaseModel):
    id: str | None = None
    email: EmailStr
    hashed_password: str
