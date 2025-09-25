from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .db import init_db
from .routes.users import router as users_router
from .routes.notes import router as notes_router

app = FastAPI(title="MVP Notes App")

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


app.include_router(users_router)
app.include_router(notes_router, prefix="/notes")