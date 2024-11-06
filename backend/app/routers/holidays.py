from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Holiday
from ..schemas import (
    Holiday as HolidaySchema,
    HolidayCreate
)
from ..security import get_current_user

router = APIRouter(
    prefix="/api/holidays",
    tags=["holidays"]
)

@router.get("", response_model=List[HolidaySchema])
def get_holidays(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Holiday).all()

@router.post("", response_model=HolidaySchema)
def create_holiday(
    holiday: HolidayCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_holiday = Holiday(**holiday.model_dump())
    db.add(db_holiday)
    db.commit()
    db.refresh(db_holiday)
    return db_holiday
