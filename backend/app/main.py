from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ NEW IMPORTS (add these)
from .database import Base, engine
from .routers import auth

app = FastAPI(title="ArogyaMitra API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ CREATE TABLES (safe — runs once)
Base.metadata.create_all(bind=engine)

# ✅ INCLUDE AUTH ROUTER (adds /auth endpoints)
app.include_router(auth.router)


@app.get("/")
def home():
    return {"message": "ArogyaMitra Backend Running"}


@app.get("/health")
def health():
    return {"status": "OK"}