from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Timetable, TimetableEvent
from ..schemas import (
    TimetableCreate, Timetable as TimetableSchema,
    TimetableEventCreate, TimetableEvent as TimetableEventSchema
)
from ..security import get_current_user

router = APIRouter(
    prefix="/api/timetables",
    tags=["timetables"]
)

@router.get("", response_model=List[TimetableSchema])
def get_timetables(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Timetable).filter(Timetable.user_id == current_user.id).all()

@router.post("", response_model=TimetableSchema)
def create_timetable(
    timetable: TimetableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas sama nimega tunniplaan juba eksisteerib
    existing = db.query(Timetable).filter(
        Timetable.name == timetable.name
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Sama nimega tunniplaan on juba olemas"
        )

    db_timetable = Timetable(**timetable.model_dump(), user_id=current_user.id)
    db.add(db_timetable)
    db.commit()
    db.refresh(db_timetable)
    return db_timetable

@router.get("/{timetable_id}", response_model=TimetableSchema)
def get_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    return timetable

@router.put("/{timetable_id}", response_model=TimetableSchema)
def update_timetable(
    timetable_id: int,
    timetable: TimetableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if db_timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sama nimega tunniplaan juba eksisteerib (välja arvatud praegune)
    existing = db.query(Timetable).filter(
        Timetable.name == timetable.name,
        Timetable.id != timetable_id
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

@router.delete("/{timetable_id}")
def delete_timetable(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    db.delete(timetable)
    db.commit()
    return {"message": "Tunniplaan kustutatud"}

# Tunniplaani sündmused
@router.get("/{timetable_id}/events", response_model=List[TimetableEventSchema])
def get_timetable_events(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    return timetable.events

@router.post("/{timetable_id}/events", response_model=TimetableEventSchema)
def create_timetable_event(
    timetable_id: int,
    event: TimetableEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    db_event = TimetableEvent(**event.model_dump(), timetable_id=timetable_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{timetable_id}/events/{event_id}", response_model=TimetableEventSchema)
def update_timetable_event(
    timetable_id: int,
    event_id: int,
    event: TimetableEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas tunniplaan kuulub kasutajale
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sündmus kuulub sellele tunniplaanile
    db_event = db.query(TimetableEvent).filter(
        TimetableEvent.id == event_id,
        TimetableEvent.timetable_id == timetable_id
    ).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Sündmus ei leitud")
    
    for key, value in event.model_dump().items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{timetable_id}/events/{event_id}")
def delete_timetable_event(
    timetable_id: int,
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas tunniplaan kuulub kasutajale
    timetable = db.query(Timetable).filter(
        Timetable.id == timetable_id,
        Timetable.user_id == current_user.id
    ).first()
    if timetable is None:
        raise HTTPException(status_code=404, detail="Tunniplaan ei leitud")
    
    # Kontrolli, kas sündmus kuulub sellele tunniplaanile
    event = db.query(TimetableEvent).filter(
        TimetableEvent.id == event_id,
        TimetableEvent.timetable_id == timetable_id
    ).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Sündmus ei leitud")
    
    db.delete(event)
    db.commit()
    return {"message": "Sündmus kustutatud"}
