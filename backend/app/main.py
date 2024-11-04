from datetime import timedelta
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, security
from .database import engine, get_db

# Loome andmebaasi tabelid
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Lible - Koolikella süsteem",
    description="Veebipõhine koolikella süsteem",
    version="1.0.0"
)

# CORS seadistus
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Autentimine
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = security.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vale kasutajanimi või parool",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Kasutaja info
@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(security.get_current_user)
):
    return current_user

# Tunniplaanid
@app.get("/timetables", response_model=List[schemas.Timetable])
def get_timetables(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Timetable).filter(models.Timetable.user_id == current_user.id).all()

@app.post("/timetables", response_model=schemas.Timetable)
def create_timetable(
    timetable: schemas.TimetableCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_timetable = models.Timetable(**timetable.model_dump(), user_id=current_user.id)
    db.add(db_timetable)
    db.commit()
    db.refresh(db_timetable)
    return db_timetable

@app.get("/timetables/{timetable_id}", response_model=schemas.Timetable)
def get_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Timetable not found")
    return timetable

# Mallid
@app.get("/templates", response_model=List[schemas.EventTemplate])
def get_templates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.EventTemplate).all()

@app.post("/templates", response_model=schemas.EventTemplate)
def create_template(
    template: schemas.EventTemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_template = models.EventTemplate(
        name=template.name,
        description=template.description
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)

    for item in template.items:
        db_item = models.EventTemplateItem(
            **item.model_dump(),
            template_id=db_template.id
        )
        db.add(db_item)
    
    db.commit()
    return db_template

# Helinad
@app.get("/sounds", response_model=List[schemas.Sound])
def get_sounds(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Sound).all()

@app.post("/sounds", response_model=schemas.Sound)
def create_sound(
    sound: schemas.SoundCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_sound = models.Sound(**sound.model_dump())
    db.add(db_sound)
    db.commit()
    db.refresh(db_sound)
    return db_sound

# Pühad
@app.get("/holidays", response_model=List[schemas.Holiday])
def get_holidays(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Holiday).all()

@app.post("/holidays", response_model=schemas.Holiday)
def create_holiday(
    holiday: schemas.HolidayCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_holiday = models.Holiday(**holiday.model_dump())
    db.add(db_holiday)
    db.commit()
    db.refresh(db_holiday)
    return db_holiday

# Tunniplaani sündmused
@app.get("/timetables/{timetable_id}/events", response_model=List[schemas.TimetableEvent])
def get_timetable_events(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Timetable not found")
    return timetable.events

@app.post("/timetables/{timetable_id}/events", response_model=schemas.TimetableEvent)
def create_timetable_event(
    timetable_id: int,
    event: schemas.TimetableEventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Timetable not found")
    
    db_event = models.TimetableEvent(**event.model_dump(), timetable_id=timetable_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
