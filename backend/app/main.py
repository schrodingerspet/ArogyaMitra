from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ NEW IMPORTS (add these)
from .database import Base, engine
from .routers import protected
from .routers import auth
from .routers import workouts
from .routers import nutrition, progress, health, calendar, admin

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

# ✅ INCLUDE AUTH ROUTER (adds /auth endpoints)
app.include_router(auth.router)
app.include_router(protected.router)
app.include_router(workouts.router)
app.include_router(nutrition.router)
app.include_router(progress.router)
app.include_router(health.router)
app.include_router(calendar.router)
app.include_router(admin.router)


@app.get("/")
def home():
    return {"message": "ArogyaMitra Backend Running"}


@app.get("/health")
def health():
    return {"status": "OK"}