from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from .database import Base, engine
from .routers import auth, protected, workouts, nutrition, progress, health, calendar, admin, chat, analytics

app = FastAPI(title="ArogyaMitra API")

cors_origins = [o.strip() for o in os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173",
).split(",") if o.strip()]
# Always allow the production frontend origin
if "https://schrodingerspet.github.io" not in cors_origins:
    cors_origins.append("https://schrodingerspet.github.io")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database schema creation; for production use Alembic migrations instead
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(protected.router)
app.include_router(workouts.router)
app.include_router(nutrition.router)
app.include_router(progress.router)
app.include_router(health.router)
app.include_router(calendar.router)
app.include_router(admin.router)
app.include_router(chat.router)
app.include_router(analytics.router)


@app.get("/")
def home():
    return {"message": "ArogyaMitra Backend Running"}


@app.get("/health-check")
def health_check():
    return {"status": "OK"}