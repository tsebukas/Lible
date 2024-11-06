from typing import Optional, List
from datetime import date
from pydantic import BaseModel

class TimetableEventBase(BaseModel):
    event_name: str
    event_time: str
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
    weekdays: int

class TimetableCreate(TimetableBase):
    pass

class Timetable(TimetableBase):
    id: int
    user_id: int
    events: List[TimetableEvent] = []

    class Config:
        from_attributes = True
