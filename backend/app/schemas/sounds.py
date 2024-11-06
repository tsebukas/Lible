from pydantic import BaseModel

class SoundBase(BaseModel):
    name: str

class SoundCreate(SoundBase):
    pass

class SoundUpdate(SoundBase):
    pass

class Sound(SoundBase):
    id: int
    filename: str

    class Config:
        from_attributes = True
