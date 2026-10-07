#!/usr/bin/env python3
"""
Bharat Darshan - Multi-Engine REST API Backend
Supports both Flask (if installed) and Built-in Python HTTP Server (Zero Dependencies)
Tech Stack: Python 3, SQLite3, REST API
Serves 100% of Bharat Darshan API endpoints.
"""

import os
import sys
import json
import re
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Ensure local backend imports work
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
from database import (
    init_db, save_user_login, get_all_users, register_visitor,
    heartbeat_visitor, get_active_visitors, save_bookmark,
    delete_bookmark, get_saved_bookmarks, add_community_heritage,
    get_community_heritage
)

# Initialize SQLite database
init_db()

# Load heritage catalog JSON if available
CATALOG = {
    "states": [],
    "categories": [],
    "heritage": [],
    "foods": [],
    "festivals": [],
    "languages": []
}

CATALOG_PATH = os.path.join(BASE_DIR, 'heritage_catalog.json')
if os.path.exists(CATALOG_PATH):
    try:
        with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
            CATALOG = json.load(f)
    except Exception as e:
        print(f"Warning: Failed to load heritage_catalog.json: {e}")

def get_filtered_heritage(state=None, category=None, period=None, sort=None, query=None):
    items = list(CATALOG.get("heritage", []))
    
    # Merge community submissions
    comm = get_community_heritage()
    for c in comm:
        if not any(i.get('id') == c.get('id') for i in items):
            items.insert(0, c)
            
    if state and state != 'all':
        items = [i for i in items if i.get('state_id') == state]
    if category and category != 'all':
        items = [i for i in items if i.get('category_id') == category]
    if period and period != 'all':
        items = [i for i in items if i.get('period') == period]
    if query and query.strip():
        q_clean = query.strip().lower()
        items = [
            i for i in items
            if q_clean in i.get('title', '').lower()
            or q_clean in i.get('hindi_title', '').lower()
            or q_clean in i.get('summary', '').lower()
            or q_clean in i.get('location_name', '').lower()
        ]
        
    if sort == 'alpha':
        items.sort(key=lambda x: x.get('title', ''))
    elif sort == 'unesco':
        items.sort(key=lambda x: 1 if x.get('unesco_flag') else 0, reverse=True)
        
    return items

# Check if Flask is available
USE_FLASK = False
try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    USE_FLASK = True
except ImportError:
    USE_FLASK = False

if USE_FLASK:
    app = Flask(__name__)
    CORS(app)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Bharat Darshan API",
            "engine": "Flask",
            "stack": "Python 3 + SQLite3",
            "timestamp": datetime.now().isoformat(),
            "monuments_loaded": len(CATALOG.get("heritage", [])),
            "states_loaded": len(CATALOG.get("states", []))
        }), 200

    @app.route('/api/states', methods=['GET'])
    def list_states():
        return jsonify({"success": True, "states": CATALOG.get("states", [])}), 200

    @app.route('/api/states/<state_id>', methods=['GET'])
    def get_state(state_id):
        for s in CATALOG.get("states", []):
            if s.get("id") == state_id:
                return jsonify({"success": True, "state": s}), 200
        return jsonify({"success": False, "message": "State not found"}), 404

    @app.route('/api/categories', methods=['GET'])
    def list_categories():
        return jsonify({"success": True, "categories": CATALOG.get("categories", [])}), 200

    @app.route('/api/heritage', methods=['GET', 'POST'])
    def handle_heritage():
        if request.method == 'GET':
            s = request.args.get('state', 'all')
            c = request.args.get('category', 'all')
            p = request.args.get('period', 'all')
            sort = request.args.get('sort', 'default')
            q = request.args.get('q', '')
            items = get_filtered_heritage(s, c, p, sort, q)
            return jsonify({"success": True, "count": len(items), "heritage": items}), 200
        else:
            data = request.get_json(silent=True) or {}
            saved = add_community_heritage(data)
            return jsonify({"success": True, "item": saved}), 201

    @app.route('/api/heritage/<item_id>', methods=['GET'])
    def get_single_heritage(item_id):
        items = get_filtered_heritage()
        for i in items:
            if i.get("id") == item_id:
                return jsonify({"success": True, "heritage": i}), 200
        return jsonify({"success": False, "message": "Monument not found"}), 404

    @app.route('/api/login', methods=['POST'])
    def handle_user_login():
        data = request.get_json(silent=True) or {}
        name = data.get('name', '').strip()
        if not name:
            return jsonify({"success": False, "message": "User name is required for login."}), 400
        
        login_time = data.get('timestamp') or datetime.now().strftime("%d %b %Y, %I:%M %p")
        saved_user = save_user_login(name=name, login_time=login_time)
        return jsonify({
            "success": True,
            "message": f"Welcome {name}! Login session recorded successfully.",
            "user": saved_user
        }), 201

    @app.route('/api/users', methods=['GET'])
    def list_users():
        users = get_all_users()
        return jsonify({
            "success": True,
            "total_logins": len(users),
            "users": users
        }), 200

    @app.route('/api/admin/verify', methods=['POST'])
    def verify_admin():
        data = request.get_json(silent=True) or {}
        passcode = data.get('passcode', '')
        if passcode == 'asi@bharat':
            return jsonify({
                "success": True,
                "message": "Authentication successful. Welcome, ASI Administrator."
            }), 200
        return jsonify({
            "success": False,
            "message": "Invalid Administrative Passcode. Access Denied."
        }), 401

    @app.route('/api/visitors/register', methods=['POST'])
    def api_register_visitor():
        data = request.get_json(silent=True) or {}
        register_visitor(
            pass_id=data.get('passId') or str(int(datetime.now().timestamp() * 1000)),
            name=data.get('name', 'Visitor'),
            role=data.get('role', 'Cultural Heritage Explorer'),
            platform=data.get('platform', 'Web Client')
        )
        return jsonify({"success": True}), 200

    @app.route('/api/visitors/heartbeat', methods=['POST'])
    def api_heartbeat_visitor():
        data = request.get_json(silent=True) or {}
        if data.get('passId'):
            heartbeat_visitor(str(data.get('passId')))
        return jsonify({"success": True}), 200

    @app.route('/api/curator/sessions', methods=['GET'])
    def api_curator_sessions():
        visitors = get_active_visitors()
        return jsonify({"success": True, "activeVisitors": visitors}), 200

    @app.route('/api/saved', methods=['GET'])
    def api_get_saved():
        records = get_saved_bookmarks()
        items_map = {i.get('id'): i for i in CATALOG.get("heritage", [])}
        saved = []
        for r in records:
            it = items_map.get(r.get('item_id'))
            if it:
                saved.append({"id": r.get('id'), "item": it, "created_at": r.get('created_at')})
        return jsonify({"success": True, "saved": saved}), 200

    @app.route('/api/save', methods=['POST'])
    def api_save_item():
        data = request.get_json(silent=True) or {}
        item_id = data.get('item_id')
        if not item_id:
            return jsonify({"success": False, "message": "item_id required"}), 400
        save_bookmark(item_id)
        return jsonify({"success": True}), 200

    @app.route('/api/save/<item_id>', methods=['DELETE'])
    def api_delete_saved(item_id):
        delete_bookmark(item_id)
        return jsonify({"success": True}), 200

    @app.route('/api/community-heritage', methods=['GET'])
    def api_community_heritage():
        items = get_community_heritage()
        return jsonify({"success": True, "items": items}), 200

    @app.route('/api/search-suggest', methods=['GET'])
    def api_search_suggest():
        q = request.args.get('q', '').strip().lower()
        if not q:
            return jsonify({"success": True, "suggestions": []}), 200
        suggestions = []
        for s in CATALOG.get("states", []):
            if q in s.get("name", "").lower() or q in s.get("hindi_name", "").lower():
                suggestions.append({"id": s.get("id"), "title": s.get("name"), "type": "state", "category": "State / UT", "state_name": s.get("region")})
        for h in CATALOG.get("heritage", []):
            if q in h.get("title", "").lower() or q in h.get("hindi_title", "").lower():
                suggestions.append({"id": h.get("id"), "title": h.get("title"), "type": "heritage", "category": h.get("category_id"), "state_name": h.get("state_id"), "unesco": bool(h.get("unesco_flag"))})
        return jsonify({"success": True, "suggestions": suggestions[:8]}), 200

else:
    from http.server import HTTPServer, BaseHTTPRequestHandler

    class BharatDarshanHandler(BaseHTTPRequestHandler):
        def _send_json(self, status_code, data):
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

        def do_OPTIONS(self):
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()

        def do_GET(self):
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            query_params = parse_qs(parsed_path.query)

            if path == '/' or path == '/api/health':
                self._send_json(200, {
                    "status": "healthy",
                    "service": "Bharat Darshan API",
                    "engine": "Built-in Python HTTP Server (Zero Dependencies)",
                    "stack": "Python 3 + SQLite3",
                    "timestamp": datetime.now().isoformat(),
                    "monuments_loaded": len(CATALOG.get("heritage", [])),
                    "states_loaded": len(CATALOG.get("states", []))
                })
            elif path == '/api/states':
                self._send_json(200, {"success": True, "states": CATALOG.get("states", [])})
            elif path.startswith('/api/states/'):
                state_id = path.replace('/api/states/', '')
                match = next((s for s in CATALOG.get("states", []) if s.get("id") == state_id), None)
                if match:
                    self._send_json(200, {"success": True, "state": match})
                else:
                    self._send_json(404, {"success": False, "message": "State not found"})
            elif path == '/api/categories':
                self._send_json(200, {"success": True, "categories": CATALOG.get("categories", [])})
            elif path == '/api/heritage':
                s = query_params.get('state', ['all'])[0]
                c = query_params.get('category', ['all'])[0]
                p = query_params.get('period', ['all'])[0]
                sort = query_params.get('sort', ['default'])[0]
                q = query_params.get('q', [''])[0]
                items = get_filtered_heritage(s, c, p, sort, q)
                self._send_json(200, {"success": True, "count": len(items), "heritage": items})
            elif path.startswith('/api/heritage/'):
                item_id = path.replace('/api/heritage/', '')
                items = get_filtered_heritage()
                match = next((i for i in items if i.get("id") == item_id), None)
                if match:
                    self._send_json(200, {"success": True, "heritage": match})
                else:
                    self._send_json(404, {"success": False, "message": "Monument not found"})
            elif path == '/api/users':
                users = get_all_users()
                self._send_json(200, {
                    "success": True,
                    "total_logins": len(users),
                    "users": users
                })
            elif path == '/api/curator/sessions':
                visitors = get_active_visitors()
                self._send_json(200, {"success": True, "activeVisitors": visitors})
            elif path == '/api/saved':
                records = get_saved_bookmarks()
                items_map = {i.get('id'): i for i in CATALOG.get("heritage", [])}
                saved = []
                for r in records:
                    it = items_map.get(r.get('item_id'))
                    if it:
                        saved.append({"id": r.get('id'), "item": it, "created_at": r.get('created_at')})
                self._send_json(200, {"success": True, "saved": saved})
            elif path == '/api/community-heritage':
                items = get_community_heritage()
                self._send_json(200, {"success": True, "items": items})
            elif path == '/api/search-suggest':
                q = query_params.get('q', [''])[0].strip().lower()
                suggestions = []
                if q:
                    for s in CATALOG.get("states", []):
                        if q in s.get("name", "").lower() or q in s.get("hindi_name", "").lower():
                            suggestions.append({"id": s.get("id"), "title": s.get("name"), "type": "state", "category": "State / UT", "state_name": s.get("region")})
                    for h in CATALOG.get("heritage", []):
                        if q in h.get("title", "").lower() or q in h.get("hindi_title", "").lower():
                            suggestions.append({"id": h.get("id"), "title": h.get("title"), "type": "heritage", "category": h.get("category_id"), "state_name": h.get("state_id"), "unesco": bool(h.get("unesco_flag"))})
                self._send_json(200, {"success": True, "suggestions": suggestions[:8]})
            else:
                self._send_json(404, {"success": False, "message": "Endpoint not found"})

        def do_POST(self):
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            
            try:
                data = json.loads(body)
            except Exception:
                data = {}

            if path == '/api/login':
                name = str(data.get('name', '')).strip()
                if not name:
                    self._send_json(400, {"success": False, "message": "User name is required for login."})
                    return
                
                login_time = data.get('timestamp') or datetime.now().strftime("%d %b %Y, %I:%M %p")
                saved_user = save_user_login(name=name, login_time=login_time)
                self._send_json(201, {
                    "success": True,
                    "message": f"Welcome {name}! Login session recorded successfully.",
                    "user": saved_user
                })
            elif path == '/api/admin/verify':
                passcode = str(data.get('passcode', ''))
                if passcode == 'asi@bharat':
                    self._send_json(200, {
                        "success": True,
                        "message": "Authentication successful. Welcome, ASI Administrator."
                    })
                else:
                    self._send_json(401, {
                        "success": False,
                        "message": "Invalid Administrative Passcode. Access Denied."
                    })
            elif path == '/api/visitors/register':
                register_visitor(
                    pass_id=data.get('passId') or str(int(datetime.now().timestamp() * 1000)),
                    name=data.get('name', 'Visitor'),
                    role=data.get('role', 'Cultural Heritage Explorer'),
                    platform=data.get('platform', 'Web Client')
                )
                self._send_json(200, {"success": True})
            elif path == '/api/visitors/heartbeat':
                if data.get('passId'):
                    heartbeat_visitor(str(data.get('passId')))
                self._send_json(200, {"success": True})
            elif path == '/api/save':
                item_id = data.get('item_id')
                if item_id:
                    save_bookmark(item_id)
                    self._send_json(200, {"success": True})
                else:
                    self._send_json(400, {"success": False, "message": "item_id required"})
            elif path == '/api/heritage':
                saved = add_community_heritage(data)
                self._send_json(201, {"success": True, "item": saved})
            else:
                self._send_json(404, {"success": False, "message": "Endpoint not found"})

        def do_DELETE(self):
            parsed_path = urlparse(self.path)
            path = parsed_path.path
            if path.startswith('/api/save/'):
                item_id = path.replace('/api/save/', '')
                delete_bookmark(item_id)
                self._send_json(200, {"success": True})
            else:
                self._send_json(404, {"success": False, "message": "Endpoint not found"})

        def log_message(self, format, *args):
            pass

if __name__ == '__main__':
    default_port = 5000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    else:
        port = int(os.environ.get('BACKEND_PORT', os.environ.get('PYTHON_PORT', default_port)))
        
    print(f"🚀 Bharat Darshan Backend Engine: {'Flask' if USE_FLASK else 'Built-in Python HTTP Server (Zero Dependencies)'}")
    print(f"📁 SQLite Database: {os.path.join(BASE_DIR, 'bharat_darshan.db')}")
    print(f"📡 API Server running on http://0.0.0.0:{port}")
    
    if USE_FLASK:
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        httpd = HTTPServer(('0.0.0.0', port), BharatDarshanHandler)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()
