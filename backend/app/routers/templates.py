from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..database import get_db
from ..models import User, EventTemplate, EventTemplateItem
from ..schemas import (
    EventTemplate as EventTemplateSchema,
    EventTemplateCreate
)
from ..security import get_current_user

router = APIRouter(
    prefix="/api/templates",
    tags=["templates"]
)

@router.get("", response_model=List[EventTemplateSchema])
def get_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(EventTemplate).options(
        joinedload(EventTemplate.items)
    ).all()

@router.get("/{template_id}", response_model=EventTemplateSchema)
def get_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template = db.query(EventTemplate).options(
        joinedload(EventTemplate.items)
    ).filter(
        EventTemplate.id == template_id
    ).first()
    
    if template is None:
        raise HTTPException(status_code=404, detail="Mall ei leitud")
    
    return template

@router.post("", response_model=EventTemplateSchema)
def create_template(
    template: EventTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas sama nimega mall juba eksisteerib
    existing_template = db.query(EventTemplate).filter(
        EventTemplate.name == template.name
    ).first()
    if existing_template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sama nimega mall on juba olemas"
        )

    try:
        db_template = EventTemplate(
            name=template.name,
            description=template.description
        )
        db.add(db_template)
        db.commit()
        db.refresh(db_template)

        for item in template.items:
            db_item = EventTemplateItem(
                **item.model_dump(),
                template_id=db_template.id
            )
            db.add(db_item)
        
        db.commit()
        
        # Laeme malli uuesti koos sündmustega
        return db.query(EventTemplate).options(
            joinedload(EventTemplate.items)
        ).filter(
            EventTemplate.id == db_template.id
        ).first()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sama nimega mall on juba olemas"
        )

@router.put("/{template_id}", response_model=EventTemplateSchema)
def update_template(
    template_id: int,
    template: EventTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas mall eksisteerib
    db_template = db.query(EventTemplate).filter(
        EventTemplate.id == template_id
    ).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="Mall ei leitud")
    
    # Kontrolli, kas sama nimega mall juba eksisteerib (välja arvatud praegune)
    existing_template = db.query(EventTemplate).filter(
        EventTemplate.name == template.name,
        EventTemplate.id != template_id
    ).first()
    if existing_template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sama nimega mall on juba olemas"
        )

    try:
        # Uuenda malli põhiandmed
        db_template.name = template.name
        db_template.description = template.description
        
        # Kustuta olemasolevad sündmused
        db.query(EventTemplateItem).filter(
            EventTemplateItem.template_id == template_id
        ).delete()
        
        # Lisa uued sündmused
        for item in template.items:
            db_item = EventTemplateItem(
                **item.model_dump(),
                template_id=template_id
            )
            db.add(db_item)
        
        db.commit()
        
        # Laeme malli uuesti koos sündmustega
        return db.query(EventTemplate).options(
            joinedload(EventTemplate.items)
        ).filter(
            EventTemplate.id == template_id
        ).first()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sama nimega mall on juba olemas"
        )

@router.delete("/{template_id}")
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kontrolli, kas mall eksisteerib
    template = db.query(EventTemplate).filter(
        EventTemplate.id == template_id
    ).first()
    if template is None:
        raise HTTPException(status_code=404, detail="Mall ei leitud")
    
    # Kustuta mall (seotud sündmused kustutatakse automaatselt tänu cascade seadistusele)
    db.delete(template)
    db.commit()
    
    return {"message": "Mall kustutatud"}
