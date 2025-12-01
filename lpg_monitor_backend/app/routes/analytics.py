from fastapi import APIRouter

router = APIRouter()

@router.get('/usage')
def usage():
    return {"message": "analytics usage endpoint"}
