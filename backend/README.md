# Bharat Darshan - Python Flask + SQLite Backend

This directory contains the Python + Flask REST API backend integrated with SQLite database (`bharat_darshan.db`) as specified in the **Bharat Darshan Technical Approach Architecture**.

## Features
- **Language**: Python 3
- **Dual Engine**: Supports **Flask + Flask-CORS** (when installed) OR **Built-in Python HTTP Server (Zero Dependencies)** if pip/Flask is not installed.
- **Database**: SQLite3 (`bharat_darshan.db`)
- **Complete Endpoints**:
  - `GET /api/health` — Service health & loaded catalog stats
  - `GET /api/states` & `GET /api/states/<id>` — All 36 States & UTs
  - `GET /api/categories` — Heritage categories
  - `GET /api/heritage` & `GET /api/heritage/<id>` — 129+ national monuments with filters (`state`, `category`, `period`, `sort`, `q`)
  - `POST /api/heritage` — Community heritage contributions
  - `POST /api/login` — Record user login with exact timestamp
  - `GET /api/users` — Historical login sessions
  - `POST /api/admin/verify` — Administrative authentication
  - `GET /api/saved`, `POST /api/save`, `DELETE /api/save/<id>` — Visited bookmarks
  - `GET /api/curator/sessions` — Active visitor telemetry

## Quick Start (in VS Code / Terminal)

### Option A: Zero Dependencies (Built-in Python 3)
No need to install anything! Run directly:
```bash
python3 backend/app.py 5000
```

### Option B: Flask + Flask-CORS (if pip is available)
```bash
cd backend
pip install -r requirements.txt
python3 app.py 5000
```

The API will be available at `http://localhost:5000`.

## SQLite Database
The SQLite database file `bharat_darshan.db` is automatically created on first run with the tables:
- `users`: User login audit logs
- `active_visitors`: Real-time cross-device visitor passes
- `saved_items`: Visited and bookmarked monuments
- `community_heritage`: Crowd-sourced cultural entries

You can query the database directly using:
```bash
python3 backend/database.py get_users
```
