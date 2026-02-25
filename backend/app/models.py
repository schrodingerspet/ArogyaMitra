from sqlalchemy import Column, Integer, String
from .database import Base
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import relationship


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)

    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)