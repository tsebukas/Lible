from datetime import date
from pydantic import BaseModel

class HolidayBase(BaseModel):
    name: str
    valid_from: date
    valid_until: date

class HolidayCreate(HolidayBase):
    pass

class HolidayUpdate(HolidayBase):
    pass

class Holiday(HolidayBase):
    id: int

    class Config:
        from_attributes = True
