from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, protected, workouts, nutrition, progress, health, calendar, admin, chat, analytics

app = FastAPI(title="ArogyaMitra API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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