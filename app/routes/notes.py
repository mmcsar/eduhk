from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..db import get_db
from ..models import Note, User

router = APIRouter(tags=["notes"])


@router.get("")
def list_notes(request: Request, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notes = db.query(Note).filter(Note.user_id == user.id).order_by(Note.created_at.desc()).all()
    return request.app.state.templates.TemplateResponse(
        "notes/list.html", {"request": request, "notes": notes, "user": user}
    )


@router.get("/create")
def get_create(request: Request, user: User = Depends(get_current_user)):
    return request.app.state.templates.TemplateResponse(
        "notes/create.html", {"request": request, "user": user}
    )


@router.post("")
def create_note(
    request: Request,
    title: str = Form(...),
    content: str = Form(""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = Note(user_id=user.id, title=title, content=content or "")
    db.add(note)
    db.commit()
    return RedirectResponse(url="/notes", status_code=303)


@router.get("/{note_id}/edit")
def get_edit(
    request: Request,
    note_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if not note:
        return RedirectResponse(url="/notes", status_code=303)
    return request.app.state.templates.TemplateResponse(
        "notes/edit.html", {"request": request, "note": note, "user": user}
    )


@router.post("/{note_id}/edit")
def post_edit(
    note_id: int,
    title: str = Form(...),
    content: str = Form(""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if note:
        note.title = title
        note.content = content or ""
        db.add(note)
        db.commit()
    return RedirectResponse(url="/notes", status_code=303)


@router.post("/{note_id}/delete")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if note:
        db.delete(note)
        db.commit()
    return RedirectResponse(url="/notes", status_code=303)