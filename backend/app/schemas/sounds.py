from pydantic import BaseModel

class SoundBase(BaseModel):
    name: str
    filename: str

class SoundCreate(SoundBase):
    pass

class SoundUpdate(SoundBase):
    pass

class Sound(SoundBase):
    id: int

    class Config:
        from_attributes = True
