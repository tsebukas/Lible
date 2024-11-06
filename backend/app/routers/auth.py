from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User
from .. import schemas
from ..security import authenticate_user, create_access_token, get_current_user
from ..security import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=schemas.LoginResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vale kasutajanimi või parool",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "token": access_token,
        "refreshToken": None,  # TODO: Implement refresh token
        "user": user
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Välja logitud"}

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(
    refresh_token: schemas.RefreshToken,
    db: Session = Depends(get_db)
):
    # TODO: Implement refresh token logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not implemented"
    )

@router.get("/check")
async def check_auth(current_user: User = Depends(get_current_user)):
    return {"message": "Autenditud"}

@router.get("/me", response_model=schemas.User)
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user
