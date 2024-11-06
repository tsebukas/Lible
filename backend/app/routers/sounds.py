import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sound, User
from ..schemas.sounds import Sound as SoundSchema, SoundUpdate
from ..security import get_current_user

router = APIRouter(
    prefix="/api/sounds",
    tags=["sounds"]
)

# Helinate kausta seadistamine
SOUNDS_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sounds"))
if not os.path.exists(SOUNDS_DIRECTORY):
    os.makedirs(SOUNDS_DIRECTORY)
    print(f"Created sounds directory at: {SOUNDS_DIRECTORY}")  # Debug log

@router.get("", response_model=List[SoundSchema])
def get_sounds(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Sound).all()

@router.get("/{sound_id}")
def get_sound_file(
    sound_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sound = db.query(Sound).filter(Sound.id == sound_id).first()
    if not sound:
        raise HTTPException(status_code=404, detail="Helin ei leitud")
    
    file_path = os.path.join(SOUNDS_DIRECTORY, sound.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Helifail ei leitud")
    
    return FileResponse(file_path, media_type="audio/mpeg")

@router.post("", response_model=SoundSchema)
async def create_sound(
    sound_file: UploadFile = File(...),
    name: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas sama nimega helin juba eksisteerib
    existing_sound = db.query(Sound).filter(Sound.name == name).first()
    if existing_sound:
        raise HTTPException(
            status_code=400,
            detail="Sama nimega helin on juba olemas"
        )

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
    db_sound = Sound(name=name, filename=filename)
    db.add(db_sound)
    db.commit()
    db.refresh(db_sound)
    
    print(f"Sound record created: {db_sound.id}")  # Debug log
    return db_sound

@router.put("/{sound_id}", response_model=SoundSchema)
def update_sound(
    sound_id: int,
    sound_update: SoundUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Leia helin andmebaasist
    sound = db.query(Sound).filter(Sound.id == sound_id).first()
    if not sound:
        raise HTTPException(status_code=404, detail="Helin ei leitud")
    
    # Kontrolli, kas sama nimega helin juba eksisteerib (välja arvatud praegune)
    existing_sound = db.query(Sound).filter(
        Sound.name == sound_update.name,
        Sound.id != sound_id
    ).first()
    if existing_sound:
        raise HTTPException(
            status_code=400,
            detail="Sama nimega helin on juba olemas"
        )
    
    # Uuenda nime
    sound.name = sound_update.name
    
    # Salvesta muudatused
    db.commit()
    db.refresh(sound)
    
    return sound

@router.delete("/{sound_id}")
def delete_sound(
    sound_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sound = db.query(Sound).filter(Sound.id == sound_id).first()
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
