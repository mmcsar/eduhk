# MVP Notes App (FastAPI)

Minimal web MVP with user registration/login and notes CRUD using FastAPI + SQLite.

## Prerequisites
- Python 3.10+

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

App runs at http://127.0.0.1:8000

## Features
- Register, login, logout (cookies)
- Create, list, edit, delete notes
- SQLite storage with SQLAlchemy
- Jinja templates + minimal CSS
