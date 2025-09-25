from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: Optional[str] = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    content: Optional[str] = None


class NoteOut(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        from_attributes = True