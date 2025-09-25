from datetime import timedelta
from typing import Optional

from fastapi import Depends, HTTPException, Request, Response, status
from itsdangerous import BadSignature, URLSafeSerializer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .db import get_db
from .models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
session_signer = URLSafeSerializer("change-this-secret")
SESSION_COOKIE_NAME = "session"
SESSION_TTL = timedelta(days=7)


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def set_session(response: Response, user_id: int) -> None:
    token = session_signer.dumps({"user_id": user_id})
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        samesite="lax",
    )


def clear_session(response: Response) -> None:
    response.delete_cookie(key=SESSION_COOKIE_NAME)


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token: Optional[str] = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    try:
        data = session_signer.loads(token)
        user_id = data.get("user_id")
    except BadSignature:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user