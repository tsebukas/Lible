from pydantic import BaseModel
from typing import Optional
from .user import User

class Token(BaseModel):
    token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str

class LoginResponse(BaseModel):
    token: str
    refreshToken: Optional[str] = None
    user: User
