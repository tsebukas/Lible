from datetime import date
from pydantic import BaseModel

class HolidayBase(BaseModel):
    name: str  # Lisatud name väli
    valid_from: date
    valid_until: date

class HolidayCreate(HolidayBase):
    pass

class HolidayUpdate(HolidayBase):  # Lisatud update skeem
    pass

class Holiday(HolidayBase):
    id: int

    class Config:
        from_attributes = True
