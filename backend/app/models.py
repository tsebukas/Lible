from sqlalchemy import Column, Integer, String, Date, Time, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_local_auth = Column(Boolean, default=True)
    language = Column(String, default="et")

    timetables = relationship("Timetable", back_populates="user", cascade="all, delete-orphan")

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    valid_from = Column(Date)
    valid_until = Column(Date, nullable=True)
    weekdays = Column(Integer)  # Bitmask: 1=E, 2=T, 4=K, 8=N, 16=R, 32=L, 64=P
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="timetables")
    events = relationship("TimetableEvent", back_populates="timetable", cascade="all, delete-orphan")

class TimetableEvent(Base):
    __tablename__ = "timetable_events"

    id = Column(Integer, primary_key=True, index=True)
    timetable_id = Column(Integer, ForeignKey("timetables.id", ondelete="CASCADE"))
    event_name = Column(String)
    event_time = Column(Time)
    sound_id = Column(Integer, ForeignKey("sounds.id"))
    template_instance_id = Column(Integer, nullable=True)
    is_template_base = Column(Boolean, default=False)

    timetable = relationship("Timetable", back_populates="events")
    sound = relationship("Sound")

class EventTemplate(Base):
    __tablename__ = "event_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # Lisatud unique=True ja index=True
    description = Column(String, nullable=True)

    items = relationship("EventTemplateItem", back_populates="template", cascade="all, delete-orphan")

class EventTemplateItem(Base):
    __tablename__ = "event_template_items"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("event_templates.id", ondelete="CASCADE"))
    offset_minutes = Column(Integer)
    event_name = Column(String)
    sound_id = Column(Integer, ForeignKey("sounds.id"))

    template = relationship("EventTemplate", back_populates="items")
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
