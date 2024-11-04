from sqlalchemy import Boolean, Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)  # Ainult lokaalse autentimise puhul
    is_local_auth = Column(Boolean, default=True)
    language = Column(String, default="et")

    timetables = relationship("Timetable", back_populates="user")

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    valid_from = Column(Date)
    valid_until = Column(Date, nullable=True)
    weekdays = Column(Integer)  # bitmask
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="timetables")
    events = relationship("TimetableEvent", back_populates="timetable")

class EventTemplate(Base):
    __tablename__ = "event_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

    template_items = relationship("EventTemplateItem", back_populates="template")

class EventTemplateItem(Base):
    __tablename__ = "event_template_items"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("event_templates.id"))
    offset_minutes = Column(Integer)
    event_name = Column(String)
    sound_id = Column(Integer, ForeignKey("sounds.id"))

    template = relationship("EventTemplate", back_populates="template_items")
    sound = relationship("Sound")

class TimetableEvent(Base):
    __tablename__ = "timetable_events"

    id = Column(Integer, primary_key=True, index=True)
    timetable_id = Column(Integer, ForeignKey("timetables.id"))
    event_name = Column(String)
    event_time = Column(Time)
    sound_id = Column(Integer, ForeignKey("sounds.id"))
    template_instance_id = Column(Integer, nullable=True)  # NULL kui pole mallist
    is_template_base = Column(Boolean, default=False)  # True kui on malli põhisündmus

    timetable = relationship("Timetable", back_populates="events")
    sound = relationship("Sound")

class Sound(Base):
    __tablename__ = "sounds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    filename = Column(String)

class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    valid_from = Column(Date)
    valid_until = Column(Date)
