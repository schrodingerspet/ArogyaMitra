from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class WorkoutCreate(BaseModel):
    title: str
    description: str


class WorkoutResponse(BaseModel):
    id: int
    title: str
    description: str

    class Config:
        from_attributes = True