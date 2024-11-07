from typing import Optional, List
from datetime import date, time
from pydantic import BaseModel, Field

class TimetableEventBase(BaseModel):
    event_name: str
    event_time: time
    sound_id: int
    template_instance_id: Optional[int] = None
    is_template_base: bool = False

class TimetableEventCreate(TimetableEventBase):
    pass

class TimetableEvent(TimetableEventBase):
    id: int
    timetable_id: int

    class Config:
        from_attributes = True

class TimetableBase(BaseModel):
    name: str
    valid_from: date
    valid_until: Optional[date] = None
    weekdays: int = Field(..., ge=1, le=127)

class TimetableCreate(TimetableBase):
    pass

class Timetable(TimetableBase):
    id: int
    events: List[TimetableEvent] = []

    class Config:
        from_attributes = True
