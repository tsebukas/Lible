from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import (
    sounds, auth, timetables,
    templates, holidays
)

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

# Registreeri marsruuterid
app.include_router(sounds.router)
app.include_router(auth.router)
app.include_router(timetables.router)
app.include_router(templates.router)
app.include_router(holidays.router)
