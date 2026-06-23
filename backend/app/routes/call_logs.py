from fastapi import APIRouter
from app.database import get_db
from app.models import CallLog
from typing import List

router = APIRouter(prefix="/call-logs", tags=["call-logs"])

@router.get("/", response_model=List[CallLog])
async def get_call_logs():
    db = get_db()
    cursor = db.call_logs.find({})
    logs = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        logs.append(CallLog(**doc))
    return logs
