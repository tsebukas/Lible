from datetime import timedelta
from typing import List
import os
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_
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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Helinate kausta seadistamine
SOUNDS_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sounds"))
if not os.path.exists(SOUNDS_DIRECTORY):
    os.makedirs(SOUNDS_DIRECTORY)
    print(f"Created sounds directory at: {SOUNDS_DIRECTORY}")  # Debug log

# Helinate serveerimine ID järgi
@app.get("/sounds/{sound_id}")
def get_sound_file(
    sound_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    sound = db.query(models.Sound).filter(models.Sound.id == sound_id).first()
    if not sound:
        raise HTTPException(status_code=404, detail="Helin ei leitud")
    
    file_path = os.path.join(SOUNDS_DIRECTORY, sound.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Helifail ei leitud")
    
    return FileResponse(file_path, media_type="audio/mpeg")

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

# Helinate haldus
@app.get("/sounds", response_model=List[schemas.Sound])
def get_sounds(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    return db.query(models.Sound).all()

@app.post("/sounds", response_model=schemas.Sound)
async def create_sound(
    sound_file: UploadFile = File(...),
    name: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    print(f"Receiving sound upload: name={name}, file={sound_file.filename}")  # Debug log
    
    # Kontrolli failitüüpi
    if not sound_file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=400,
            detail="Ainult helifailid on lubatud"
        )
    
    # Kontrolli faili suurust (max 2MB)
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
    contents = await sound_file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Fail on liiga suur (max 2MB)"
        )
    
    # Salvesta fail
    filename = f"{name}_{sound_file.filename}"
    file_path = os.path.join(SOUNDS_DIRECTORY, filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    print(f"Sound file saved to: {file_path}")  # Debug log
    
    # Salvesta andmebaasi
    db_sound = models.Sound(name=name, filename=filename)
    db.add(db_sound)
    db.commit()
    db.refresh(db_sound)
    
    print(f"Sound record created: {db_sound.id}")  # Debug log
    return db_sound

@app.delete("/sounds/{sound_id}")
def delete_sound(
    sound_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    sound = db.query(models.Sound).filter(models.Sound.id == sound_id).first()
    if not sound:
        raise HTTPException(status_code=404, detail="Helin ei leitud")
    
    # Kustuta fail
    file_path = os.path.join(SOUNDS_DIRECTORY, sound.filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Kustuta andmebaasist
    db.delete(sound)
    db.commit()
    
    return {"message": "Helin kustutatud"}

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
    # Kontrolli, kas sama nimega tunniplaan juba eksisteerib
    existing = db.query(models.Timetable).filter(
        models.Timetable.name == timetable.name
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Sama nimega tunniplaan on juba olemas"
        )

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
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    return timetable

@app.put("/timetables/{timetable_id}", response_model=schemas.Timetable)
def update_timetable(
    timetable_id: int,
    timetable: schemas.TimetableCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    db_timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if db_timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sama nimega tunniplaan juba eksisteerib (välja arvatud praegune)
    existing = db.query(models.Timetable).filter(
        models.Timetable.name == timetable.name,
        models.Timetable.id != timetable_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Sama nimega tunniplaan on juba olemas"
        )
    
    for key, value in timetable.model_dump().items():
        setattr(db_timetable, key, value)
    
    db.commit()
    db.refresh(db_timetable)
    return db_timetable

@app.delete("/timetables/{timetable_id}")
def delete_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    db.delete(timetable)
    db.commit()
    return {"message": "Tunniplaan kustutatud"}

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
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
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
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    db_event = models.TimetableEvent(**event.model_dump(), timetable_id=timetable_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.put("/timetables/{timetable_id}/events/{event_id}", response_model=schemas.TimetableEvent)
def update_timetable_event(
    timetable_id: int,
    event_id: int,
    event: schemas.TimetableEventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Kontrolli, kas tunniplaan kuulub kasutajale
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sündmus kuulub sellele tunniplaanile
    db_event = db.query(models.TimetableEvent).filter(
        models.TimetableEvent.id == event_id,
        models.TimetableEvent.timetable_id == timetable_id
    ).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Sündmus ei leitud")
    
    for key, value in event.model_dump().items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@app.delete("/timetables/{timetable_id}/events/{event_id}")
def delete_timetable_event(
    timetable_id: int,
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Kontrolli, kas tunniplaan kuulub kasutajale
    timetable = db.query(models.Timetable).filter(
        models.Timetable.id == timetable_id,
        models.Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sündmus kuulub sellele tunniplaanile
    event = db.query(models.TimetableEvent).filter(
        models.TimetableEvent.id == event_id,
        models.TimetableEvent.timetable_id == timetable_id
    ).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Sündmus ei leitud")
    
    db.delete(event)
    db.commit()
    return {"message": "Sündmus kustutatud"}
