from pydantic import BaseModel, Field
from datetime import date, time
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    username: str
    language: str = "et"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_local_auth: bool

    class Config:
        from_attributes = True

# Timetable schemas
class TimetableBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    valid_from: date
    valid_until: Optional[date] = None
    weekdays: int = Field(..., ge=1, le=127)

class TimetableCreate(TimetableBase):
    pass

class Timetable(TimetableBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Event template schemas
class EventTemplateItemBase(BaseModel):
    offset_minutes: int = Field(..., ge=-120, le=120)
    event_name: str = Field(..., min_length=2, max_length=100)
    sound_id: int

class EventTemplateItemCreate(EventTemplateItemBase):
    pass

class EventTemplateItem(EventTemplateItemBase):
    id: int
    template_id: int

    class Config:
        from_attributes = True

class EventTemplateBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)

class EventTemplateCreate(EventTemplateBase):
    items: List[EventTemplateItemCreate]

class EventTemplate(EventTemplateBase):
    id: int
    items: List[EventTemplateItem]

    class Config:
        from_attributes = True

# Timetable event schemas
class TimetableEventBase(BaseModel):
    event_name: str = Field(..., min_length=2, max_length=100)
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

# Sound schemas
class SoundBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    filename: str

class SoundCreate(SoundBase):
    pass

class SoundUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

class Sound(SoundBase):
    id: int

    class Config:
        from_attributes = True

# Holiday schemas
class HolidayBase(BaseModel):
    valid_from: date
    valid_until: date

class HolidayCreate(HolidayBase):
    pass

class Holiday(HolidayBase):
    id: int

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    token: str
    refreshToken: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshToken(BaseModel):
    refreshToken: str

class LoginResponse(BaseModel):
    token: str
    refreshToken: Optional[str] = None
    user: User
