from typing import List, Optional
from pydantic import BaseModel, Field

class EventTemplateItemBase(BaseModel):
    event_name: str
    offset_minutes: int = Field(..., ge=-120, le=120)
    sound_id: int

class EventTemplateItemCreate(EventTemplateItemBase):
    pass

class EventTemplateItem(EventTemplateItemBase):
    id: int
    template_id: int

    class Config:
        from_attributes = True

class EventTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None

class EventTemplateCreate(EventTemplateBase):
    items: List[EventTemplateItemCreate]

class EventTemplate(EventTemplateBase):
    id: int
    items: List[EventTemplateItem] = []

    class Config:
        from_attributes = True
