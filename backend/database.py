import sqlite3
import os
import sys
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bharat_darshan.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Table to store user name and login timestamp
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            login_time TEXT NOT NULL
        )
    ''')
    
    # 2. Table for live cross-device active visitors
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS active_visitors (
            passId TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT,
            platform TEXT,
            loginTime TEXT DEFAULT CURRENT_TIMESTAMP,
            lastActive TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 3. Table for saved bookmarks
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_items (
            id TEXT PRIMARY KEY,
            item_id TEXT NOT NULL,
            user_session_id TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    # 4. Table for community contributions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS community_heritage (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            hindi_title TEXT,
            state_id TEXT NOT NULL,
            category_id TEXT NOT NULL,
            period TEXT NOT NULL,
            location_name TEXT NOT NULL,
            summary TEXT NOT NULL,
            history TEXT,
            culture TEXT,
            image_url TEXT,
            video_url TEXT,
            timings TEXT,
            best_time TEXT,
            unesco_flag INTEGER DEFAULT 0,
            is_community INTEGER DEFAULT 1,
            lat REAL,
            lng REAL,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    return DB_PATH

def save_user_login(name: str, login_time: str = None):
    if not name or not name.strip():
        name = "Guest Visitor"
        
    if not login_time:
        login_time = datetime.now().strftime("%d %b %Y, %I:%M %p")
    
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, login_time) VALUES (?, ?)",
        (name.strip(), login_time)
    )
    user_id = cursor.lastrowid
    
    # Also register in active visitors
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO active_visitors (passId, name, role, platform, loginTime, lastActive)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(passId) DO UPDATE SET
            name = excluded.name,
            loginTime = excluded.loginTime,
            lastActive = excluded.lastActive
    ''', (str(user_id), name.strip(), 'Cultural Heritage Explorer', 'Web Client', now_iso, now_iso))
    
    conn.commit()
    conn.close()
    
    return {
        "id": str(user_id),
        "name": name.strip(),
        "login_time": login_time
    }

def get_all_users():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, login_time FROM users ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": str(row["id"]),
            "name": row["name"],
            "login_time": row["login_time"]
        }
        for row in rows
    ]

def register_visitor(pass_id: str, name: str, role: str = 'Cultural Heritage Explorer', platform: str = 'Web Client'):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO active_visitors (passId, name, role, platform, loginTime, lastActive)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(passId) DO UPDATE SET
            name = excluded.name,
            role = excluded.role,
            platform = excluded.platform,
            lastActive = excluded.lastActive
    ''', (str(pass_id), str(name), str(role), str(platform), now_iso, now_iso))
    conn.commit()
    conn.close()
    return True

def heartbeat_visitor(pass_id: str):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute("UPDATE active_visitors SET lastActive = ? WHERE passId = ?", (now_iso, str(pass_id)))
    conn.commit()
    conn.close()
    return True

def get_active_visitors():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT passId, name, role, platform, loginTime, lastActive FROM active_visitors ORDER BY lastActive DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def save_bookmark(item_id: str, session_id: str = 'default'):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    record_id = f"{session_id}_{item_id}"
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        INSERT OR REPLACE INTO saved_items (id, item_id, user_session_id, created_at)
        VALUES (?, ?, ?, ?)
    ''', (record_id, str(item_id), str(session_id), now_iso))
    conn.commit()
    conn.close()
    return True

def delete_bookmark(item_id: str, session_id: str = 'default'):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_items WHERE item_id = ? AND (user_session_id = ? OR user_session_id = 'default')", (str(item_id), str(session_id)))
    conn.commit()
    conn.close()
    return True

def get_saved_bookmarks(session_id: str = 'default'):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, item_id, user_session_id, created_at FROM saved_items ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_community_heritage(data: dict):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    record_id = data.get('id') or f"community_{int(datetime.now().timestamp() * 1000)}"
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        INSERT OR REPLACE INTO community_heritage (
            id, title, hindi_title, state_id, category_id, period, location_name,
            summary, history, culture, image_url, video_url, timings, best_time,
            unesco_flag, is_community, lat, lng, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        record_id,
        data.get('title', 'Community Monument'),
        data.get('hindi_title'),
        data.get('state_id', 'delhi'),
        data.get('category_id', 'monuments'),
        data.get('period', 'Medieval'),
        data.get('location_name', 'India'),
        data.get('summary', ''),
        data.get('history', ''),
        data.get('culture', ''),
        data.get('image_url', ''),
        data.get('video_url', ''),
        data.get('timings', 'Sunrise to Sunset'),
        data.get('best_time', 'October - March'),
        1 if data.get('unesco_flag') else 0,
        1,
        float(data.get('lat') or 28.6139),
        float(data.get('lng') or 77.2090),
        now_iso
    ))
    conn.commit()
    conn.close()
    data['id'] = record_id
    data['created_at'] = now_iso
    return data

def get_community_heritage():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM community_heritage ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

if __name__ == '__main__':
    init_db()
    if len(sys.argv) >= 3 and sys.argv[1] == 'save':
        user_name = sys.argv[2]
        timestamp = sys.argv[3] if len(sys.argv) > 3 else None
        res = save_user_login(user_name, timestamp)
        print(json.dumps(res))
    elif len(sys.argv) >= 2 and sys.argv[1] == 'get_users':
        users = get_all_users()
        print(json.dumps(users))
