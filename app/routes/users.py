from fastapi import APIRouter, Depends, Form, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..auth import clear_session, get_current_user, hash_password, set_session, verify_password
from ..db import get_db
from ..models import User
from ..schemas import LoginIn, UserCreate

router = APIRouter(tags=["users"])


@router.get("/register")
def get_register(request: Request):
    return request.app.state.templates.TemplateResponse(
        "auth/register.html", {"request": request, "error": None}
    )


@router.post("/register")
def post_register(
    request: Request,
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return request.app.state.templates.TemplateResponse(
            "auth/register.html",
            {"request": request, "error": "Email already registered"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    user = User(email=email, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)

    set_session(response, user.id)
    return RedirectResponse(url="/notes", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/login")
async def get_login(request: Request):
    return request.app.state.templates.TemplateResponse(
        "auth/login.html", {"request": request, "error": None}
    )


@router.post("/login")
def post_login(
    request: Request,
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return request.app.state.templates.TemplateResponse(
            "auth/login.html",
            {"request": request, "error": "Invalid credentials"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    set_session(response, user.id)
    return RedirectResponse(url="/notes", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/logout")
def post_logout(response: Response):
    clear_session(response)
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)