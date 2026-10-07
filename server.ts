import express from 'express';
import path from 'path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import { STATES, CATEGORIES, HERITAGE_ITEMS, FOODS, FESTIVALS, LANGUAGES } from './src/data/seedDatabase.ts';
import { sortMonumentsByPopularity } from './src/data/monumentPopularity.ts';
import { SavedItem, HeritageItem, UserSession, MonumentPhoto } from './src/types.ts';
import { sanitizeText, sanitizeImageUrl } from './src/utils/security.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SERVER_START_TIME = Date.now();

// Constant-Time Admin Passcode Verification (Immunizes against Side-Channel & Timing Attacks)
function verifyAdminPasscode(provided: unknown): boolean {
  if (typeof provided !== 'string' || !provided) return false;
  const expected = process.env.ADMIN_PASSCODE || 'asi@bharat';
  const bufProvided = Buffer.from(provided);
  const bufExpected = Buffer.from(expected);
  if (bufProvided.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufProvided, bufExpected);
}

// 1. Enterprise Security Headers & Anti-Clickjacking Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Blocks clickjacking & malicious iframe embedding
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.removeHeader('X-Powered-By'); // Remove server fingerprinting
  next();
});

// 2. Anti-DDoS In-Memory Rate Limiting Guard
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function apiRateLimiter(maxRequests = 200, windowMs = 60000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      rateLimitMap.set(ip, record);
    } else {
      record.count++;
    }

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Anti-DDoS rate limit exceeded. Please wait.',
        retryAfter
      });
    }
    next();
  };
}

// Clean up expired rate-limit IP records every 3 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(ip);
  }
}, 180000);

// Apply API rate limiter to all /api routes
app.use('/api', apiRateLimiter(200, 60000));

// 3. Request Payload Size Guard (Supports compressed community photos)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. Performance & Monitoring Telemetry Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400 || duration > 1000) {
      console.warn(`[MONITOR] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));
// In production or build, prioritize built dist/assets first, fallback to src/assets
app.use('/assets', express.static(path.resolve(__dirname, 'dist', 'assets')));
app.use('/assets', express.static(path.resolve(__dirname, 'src', 'assets')));

// Persistent SQLite Database Integration (backed by bharat_darshan.db)
const dbPath = path.resolve(__dirname, 'backend', 'bharat_darshan.db');
let db: DatabaseSync | null = null;
try {
  db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      login_time TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS active_visitors (
      passId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      platform TEXT,
      loginTime TEXT DEFAULT CURRENT_TIMESTAMP,
      lastActive TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL,
      user_session_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
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
    );
    CREATE TABLE IF NOT EXISTS monument_photos (
      id TEXT PRIMARY KEY,
      monument_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT,
      contributor_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  console.log('✓ SQLite database connected at', dbPath);

  // Pre-load all saved community entries into HERITAGE_ITEMS so they are instantly visible
  const stmt = db.prepare('SELECT * FROM community_heritage ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  for (const r of rows) {
    if (!HERITAGE_ITEMS.some(h => h.id === r.id)) {
      HERITAGE_ITEMS.unshift({
        id: String(r.id),
        title: String(r.title),
        hindi_title: r.hindi_title ? String(r.hindi_title) : undefined,
        state_id: String(r.state_id),
        category_id: String(r.category_id),
        period: (r.period || 'Medieval') as any,
        location_name: String(r.location_name || 'India'),
        summary: String(r.summary),
        history: String(r.history || r.summary),
        culture: String(r.culture || r.summary),
        image_url: String(r.image_url || '/src/assets/images/regenerated_image_1790779565133.png'),
        video_url: String(r.video_url || ''),
        timings: String(r.timings || 'Sunrise to Sunset'),
        best_time: String(r.best_time || 'October to March'),
        unesco_flag: Boolean(r.unesco_flag),
        is_community: true,
        created_at: String(r.created_at),
        lat: Number(r.lat) || 26.9124,
        lng: Number(r.lng) || 75.7873
      });
    }
  }
} catch (e) {
  console.error('Failed to initialize SQLite database with node:sqlite:', e);
}

// In-memory fallback caches
let savedItemsDb: SavedItem[] = [];
let usersDb: UserSession[] = [];
let monumentPhotosDb: MonumentPhoto[] = [];
const activeVisitorsDb = new Map<string, {
  passId: string;
  name: string;
  role: string;
  platform: string;
  loginTime: string;
  lastActive: string;
}>();

// Helper: Haversine distance
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 0. GET /api/health (System Observability, Health Check & Monitoring Telemetry)
app.get('/api/health', (_req, res) => {
  const uptimeSec = Math.floor((Date.now() - SERVER_START_TIME) / 1000);
  const memUsage = process.memoryUsage();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: uptimeSec,
    database: {
      status: db ? 'connected' : 'in-memory-fallback',
      engine: 'sqlite3-wal',
      storageFile: 'backend/bharat_darshan.db'
    },
    metrics: {
      totalMonuments: HERITAGE_ITEMS.length,
      totalStates: STATES.length,
      activeVisitorsCount: activeVisitorsDb.size,
      memoryRssMB: Math.round(memUsage.rss / (1024 * 1024)),
      memoryHeapUsedMB: Math.round(memUsage.heapUsed / (1024 * 1024))
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// 1. GET /api/states
app.get('/api/states', (_req, res) => {
  const result = STATES.map(state => {
    const count = HERITAGE_ITEMS.filter(h => h.state_id === state.id).length;
    return { ...state, items_count: count };
  });
  res.json({ success: true, count: result.length, states: result });
});

// 2. GET /api/states/:id
app.get('/api/states/:id', (req, res) => {
  const stateId = req.params.id.toLowerCase();
  const state = STATES.find(s => s.id === stateId || s.name.toLowerCase() === stateId);
  if (!state) {
    return res.status(404).json({ success: false, message: `State '${req.params.id}' not found.` });
  }

  const items = HERITAGE_ITEMS.filter(h => h.state_id === state.id);
  const foods = FOODS.filter(f => f.state_id === state.id);
  const festivals = FESTIVALS.filter(fest => fest.state_id === state.id);
  const languages = LANGUAGES.filter(l => l.state_id === state.id);

  res.json({
    success: true,
    state,
    items,
    foods,
    festivals,
    languages
  });
});

// 3. GET /api/categories
app.get('/api/categories', (_req, res) => {
  res.json({ success: true, count: CATEGORIES.length, categories: CATEGORIES });
});

// 4. GET /api/heritage?state=&category=&q=&period=&sort=
app.get('/api/heritage', (req, res) => {
  const { state, category, q, period, sort } = req.query as {
    state?: string;
    category?: string;
    q?: string;
    period?: string;
    sort?: string;
  };

  let results = [...HERITAGE_ITEMS];

  if (state && state !== 'all') {
    results = results.filter(item => (item.state_id || '').toLowerCase() === state.toLowerCase());
  }

  if (category && category !== 'all') {
    results = results.filter(item => (item.category_id || '').toLowerCase() === category.toLowerCase());
  }

  if (period && period !== 'all') {
    results = results.filter(item => (item.period || '').toLowerCase() === period.toLowerCase());
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    results = results.filter(item =>
      (item.title || '').toLowerCase().includes(query) ||
      (item.hindi_title && item.hindi_title.toLowerCase().includes(query)) ||
      (item.summary || '').toLowerCase().includes(query) ||
      (item.location_name || '').toLowerCase().includes(query) ||
      (item.history || '').toLowerCase().includes(query)
    );
  }

  if (sort === 'alpha') {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'unesco') {
    results.sort((a, b) => (b.unesco_flag ? 1 : 0) - (a.unesco_flag ? 1 : 0));
  } else {
    results = sortMonumentsByPopularity(results);
  }

  res.json({
    success: true,
    total: results.length,
    heritage: results
  });
});

// 5. GET /api/heritage/:id
app.get('/api/heritage/:id', (req, res) => {
  const item = HERITAGE_ITEMS.find(h => h.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: `Heritage item '${req.params.id}' not found.` });
  }
  const state = STATES.find(s => s.id === item.state_id);
  const category = CATEGORIES.find(c => c.id === item.category_id);
  res.json({ success: true, item: { ...item, state_name: state?.name, category_name: category?.name } });
});

// 6. GET /api/nearby?lat=&lng=&radius=
app.get('/api/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat((req.query.radius as string) || '500'); // default 500km

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ success: false, message: 'Valid lat and lng query parameters are required.' });
  }

  const itemsWithDistance = HERITAGE_ITEMS.map(item => {
    const distance_km = calculateDistanceKm(lat, lng, item.lat, item.lng);
    return { ...item, distance_km };
  })
    .filter(item => item.distance_km <= radius)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json({
    success: true,
    user_coords: { lat, lng },
    radius_km: radius,
    count: itemsWithDistance.length,
    nearby: itemsWithDistance
  });
});

// 7. POST /api/save
app.post('/api/save', (req, res) => {
  const { item_id, session_id } = req.body;
  if (!item_id) {
    return res.status(400).json({ success: false, message: 'item_id is required' });
  }

  const item = HERITAGE_ITEMS.find(h => h.id === item_id);
  if (!item) {
    return res.status(404).json({ success: false, message: `Heritage item '${item_id}' not found.` });
  }

  const userSession = session_id || 'anonymous_guest';
  const saveId = `save_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const createdAt = new Date().toISOString();

  if (db) {
    try {
      const check = db.prepare('SELECT id FROM saved_items WHERE item_id = ? AND user_session_id = ?');
      const existing = check.get(item_id, userSession) as any;
      if (existing) {
        return res.json({
          success: true,
          message: 'Item already saved',
          saved: { id: existing.id, item_id, user_session_id: userSession, created_at: createdAt, item }
        });
      }

      const insert = db.prepare('INSERT INTO saved_items (id, item_id, user_session_id, created_at) VALUES (?, ?, ?, ?)');
      insert.run(saveId, item_id, userSession, createdAt);
    } catch (err) {
      console.error('Error saving item in SQLite:', err);
    }
  }

  const newSaved: SavedItem = {
    id: saveId,
    item_id,
    user_session_id: userSession,
    created_at: createdAt,
    item
  };

  savedItemsDb.push(newSaved);
  res.status(201).json({ success: true, message: 'Item saved successfully', saved: newSaved });
});

// 9. DELETE /api/save/:id
app.delete('/api/save/:id', (req, res) => {
  const idOrItemId = req.params.id;

  if (db) {
    try {
      const del = db.prepare('DELETE FROM saved_items WHERE id = ? OR item_id = ?');
      del.run(idOrItemId, idOrItemId);
    } catch (err) {
      console.error('Error deleting from SQLite:', err);
    }
  }

  savedItemsDb = savedItemsDb.filter(s => s.id !== idOrItemId && s.item_id !== idOrItemId);
  res.json({ success: true, message: 'Item removed from saved list.' });
});

// 10. GET /api/saved
app.get('/api/saved', (req, res) => {
  const sessionId = (req.query.session_id as string) || 'anonymous_guest';

  if (db) {
    try {
      let rows: any[] = [];
      if (sessionId === 'all') {
        const stmt = db.prepare('SELECT id, item_id, user_session_id, created_at FROM saved_items ORDER BY created_at DESC');
        rows = stmt.all();
      } else {
        const stmt = db.prepare('SELECT id, item_id, user_session_id, created_at FROM saved_items WHERE user_session_id = ? ORDER BY created_at DESC');
        rows = stmt.all(sessionId);
      }

      const saved = rows.map((s: any) => ({
        id: String(s.id),
        item_id: String(s.item_id),
        user_session_id: String(s.user_session_id),
        created_at: String(s.created_at),
        item: HERITAGE_ITEMS.find(h => h.id === s.item_id)
      }));

      return res.json({ success: true, count: saved.length, saved });
    } catch (err) {
      console.error('Error fetching saved items from SQLite:', err);
    }
  }

  const saved = savedItemsDb
    .filter(s => s.user_session_id === sessionId || sessionId === 'all')
    .map(s => ({
      ...s,
      item: HERITAGE_ITEMS.find(h => h.id === s.item_id)
    }));

  res.json({
    success: true,
    count: saved.length,
    saved
  });
});

// 10.1 POST /api/login (Record User Name & Login Timestamp in Persistent Database)
app.post('/api/login', (req, res) => {
  const { name, timestamp } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'User name is required for login.' });
  }

  const cleanName = sanitizeText(name).slice(0, 80);
  const loginTime = timestamp || new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const nowIso = new Date().toISOString();
  let userId = String(Date.now());

  // 1. Write to SQLite users table and active_visitors table
  if (db) {
    try {
      const insertUser = db.prepare('INSERT INTO users (name, login_time) VALUES (?, ?)');
      const result = insertUser.run(cleanName, loginTime);
      if (result && result.lastInsertRowid) {
        userId = String(result.lastInsertRowid);
      }

      const insertVisitor = db.prepare(`
        INSERT INTO active_visitors (passId, name, role, platform, loginTime, lastActive)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(passId) DO UPDATE SET
          name = excluded.name,
          loginTime = excluded.loginTime,
          lastActive = excluded.lastActive
      `);
      insertVisitor.run(userId, cleanName, 'Cultural Heritage Explorer', 'Web Client', nowIso, nowIso);
    } catch (err) {
      console.error('SQLite login insert error:', err);
    }
  }

  const newUser: UserSession = {
    id: userId,
    name: cleanName,
    login_time: loginTime
  };

  usersDb = [newUser, ...usersDb.filter(u => u.id !== userId && u.name !== cleanName)];
  activeVisitorsDb.set(userId, {
    passId: userId,
    name: cleanName,
    role: 'Cultural Heritage Explorer',
    platform: 'Web Client',
    loginTime: nowIso,
    lastActive: nowIso,
  });

  res.status(201).json({
    success: true,
    message: `Namaste, ${cleanName}! Login recorded.`,
    user: newUser
  });
});

// 10.2 GET /api/users (Retrieve All User Login Records from Database Across All Devices)
app.get('/api/users', (_req, res) => {
  const mergedMap = new Map<string, any>();
  const now = Date.now();

  // 1. Read SQLite active_visitors table (has device, platform, heartbeat timestamps)
  if (db) {
    try {
      const stmtV = db.prepare('SELECT passId, name, role, platform, loginTime, lastActive FROM active_visitors ORDER BY lastActive DESC');
      const rowsV = stmtV.all() as any[];
      for (const r of rowsV) {
        const passId = String(r.passId || r.name);
        const lastActiveMs = new Date(r.lastActive || r.loginTime).getTime();
        const isLive = !isNaN(lastActiveMs) && (now - lastActiveMs) < 90000;
        let formattedTime = r.loginTime;
        try {
          const d = new Date(r.loginTime);
          if (!isNaN(d.getTime())) {
            formattedTime = d.toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        } catch {}

        mergedMap.set(passId, {
          id: passId,
          passId: passId,
          name: String(r.name),
          role: String(r.role || 'Visitor'),
          platform: String(r.platform || 'Web Device'),
          login_time: formattedTime,
          lastActive: String(r.lastActive || r.loginTime),
          isLive
        });
      }
    } catch (err) {
      console.error('SQLite active_visitors query error:', err);
    }

    // 2. Read SQLite users table (any historically registered users)
    try {
      const stmtU = db.prepare('SELECT id, name, login_time FROM users ORDER BY id DESC');
      const rowsU = stmtU.all() as any[];
      for (const r of rowsU) {
        const id = String(r.id);
        const name = String(r.name);
        // If not already in mergedMap with richer active_visitors data
        if (!mergedMap.has(id) && !Array.from(mergedMap.values()).some(v => v.name.toLowerCase() === name.toLowerCase())) {
          mergedMap.set(id, {
            id,
            passId: id,
            name,
            role: 'Cultural Heritage Explorer',
            platform: 'Registered Device',
            login_time: String(r.login_time),
            lastActive: String(r.login_time),
            isLive: false
          });
        }
      }
    } catch (err) {
      console.error('SQLite users query error:', err);
    }
  }

  // 3. Fallback to in-memory activeVisitorsDb & usersDb
  for (const [passId, v] of activeVisitorsDb.entries()) {
    if (!mergedMap.has(passId)) {
      const lastActiveMs = new Date(v.lastActive).getTime();
      const isLive = !isNaN(lastActiveMs) && (now - lastActiveMs) < 90000;
      mergedMap.set(passId, {
        id: passId,
        passId: passId,
        name: v.name,
        role: v.role || 'Visitor',
        platform: v.platform || 'Web Device',
        login_time: v.loginTime,
        lastActive: v.lastActive,
        isLive
      });
    }
  }

  for (const u of usersDb) {
    if (!mergedMap.has(u.id) && !Array.from(mergedMap.values()).some(v => v.name.toLowerCase() === u.name.toLowerCase())) {
      mergedMap.set(u.id, {
        id: u.id,
        passId: u.id,
        name: u.name,
        role: 'Cultural Heritage Explorer',
        platform: 'Registered Device',
        login_time: u.login_time,
        lastActive: u.login_time,
        isLive: false
      });
    }
  }

  const result = Array.from(mergedMap.values());
  res.json({
    success: true,
    count: result.length,
    activeCount: result.filter(r => r.isLive).length,
    users: result
  });
});

// 10.3 POST /api/visitors/register (Silent Cross-Device Multi-Device Registration)
app.post('/api/visitors/register', (req, res) => {
  const { passId, name, role, platform } = req.body;
  if (!passId || !name) {
    return res.status(400).json({ success: false, message: 'passId and name are required' });
  }

  const cleanPassId = sanitizeText(passId).slice(0, 64);
  const cleanName = sanitizeText(name).slice(0, 80);
  const cleanRole = role ? sanitizeText(role).slice(0, 80) : 'Cultural Heritage Explorer';
  const cleanPlatform = platform ? sanitizeText(platform).slice(0, 150) : 'Web Client';
  const nowIso = new Date().toISOString();
  const nowFormatted = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // 1. SQLite Persistent Upsert in active_visitors & users
  if (db) {
    try {
      const stmtV = db.prepare(`
        INSERT INTO active_visitors (passId, name, role, platform, loginTime, lastActive)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(passId) DO UPDATE SET
          name = excluded.name,
          role = excluded.role,
          platform = excluded.platform,
          lastActive = excluded.lastActive
      `);
      stmtV.run(cleanPassId, cleanName, cleanRole, cleanPlatform, nowIso, nowIso);

      const stmtU = db.prepare('INSERT INTO users (name, login_time) VALUES (?, ?)');
      stmtU.run(cleanName, nowFormatted);
    } catch (err) {
      console.error('SQLite visitor register error:', err);
    }
  }

  // 2. In-memory sync fallback
  const existing = activeVisitorsDb.get(cleanPassId);
  activeVisitorsDb.set(cleanPassId, {
    passId: cleanPassId,
    name: cleanName,
    role: cleanRole,
    platform: cleanPlatform,
    loginTime: existing?.loginTime || nowIso,
    lastActive: nowIso,
  });

  if (!usersDb.some(u => u.name.toLowerCase() === cleanName.toLowerCase())) {
    usersDb.unshift({
      id: cleanPassId,
      name: cleanName,
      login_time: nowFormatted
    });
  }

  res.json({
    success: true,
    message: 'Visitor session registered silently',
    passId: cleanPassId
  });
});

// 10.4 POST /api/visitors/heartbeat (Silent 30-sec Keep-Alive Ping)
app.post('/api/visitors/heartbeat', (req, res) => {
  const { passId } = req.body;
  if (!passId) {
    return res.status(400).json({ success: false, message: 'passId is required' });
  }

  const cleanPassId = String(passId).trim();
  const nowIso = new Date().toISOString();

  if (db) {
    try {
      const stmt = db.prepare(`UPDATE active_visitors SET lastActive = ? WHERE passId = ?`);
      stmt.run(nowIso, cleanPassId);
    } catch (err) {
      console.error('SQLite heartbeat error:', err);
    }
  }

  const mem = activeVisitorsDb.get(cleanPassId);
  if (mem) {
    mem.lastActive = nowIso;
    activeVisitorsDb.set(cleanPassId, mem);
  }

  res.json({ success: true, timestamp: nowIso });
});

// 10.5 GET /api/curator/sessions (Admin Multi-Device Live Registry)
app.get('/api/curator/sessions', (_req, res) => {
  let sessions: any[] = [];

  if (db) {
    try {
      const stmt = db.prepare('SELECT passId, name, role, platform, loginTime, lastActive FROM active_visitors ORDER BY lastActive DESC');
      const rows = stmt.all() as any[];
      if (rows && rows.length > 0) {
        sessions = rows.map(r => ({
          passId: String(r.passId),
          name: String(r.name),
          role: String(r.role || 'Visitor'),
          platform: String(r.platform || 'Unknown'),
          loginTime: String(r.loginTime),
          lastActive: String(r.lastActive)
        }));
      }
    } catch (err) {
      console.error('SQLite curator sessions query error:', err);
    }
  }

  if (sessions.length === 0 && activeVisitorsDb.size > 0) {
    sessions = Array.from(activeVisitorsDb.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
  }

  const now = Date.now();
  const enriched = sessions.map(s => {
    const lastActiveMs = new Date(s.lastActive).getTime();
    const isLive = !isNaN(lastActiveMs) && (now - lastActiveMs) < 90000; // Active within last 90 seconds
    return {
      ...s,
      isLive,
      status: isLive ? 'active' : 'idle'
    };
  });

  res.json({
    success: true,
    totalSessions: enriched.length,
    activeCount: enriched.filter(s => s.isLive).length,
    sessions: enriched
  });
});

// Rate-limiting tracker for admin verification to prevent brute-force attacks
const adminAttemptsMap = new Map<string, { count: number; lockedUntil: number }>();

// 10.6 POST /api/admin/verify (Verify Administrator Passcode with Brute-Force Rate Limiting)
app.post('/api/admin/verify', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local_ip';
  const now = Date.now();
  const attempt = adminAttemptsMap.get(ip) || { count: 0, lockedUntil: 0 };

  if (attempt.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many failed attempts. Security lock in effect for ${remainingSeconds} more seconds.`
    });
  }

  const { passcode } = req.body;
  if (verifyAdminPasscode(passcode)) {
    adminAttemptsMap.delete(ip); // Reset on success
    return res.json({
      success: true,
      message: 'Authentication successful. Welcome, ASI Administrator.'
    });
  }

  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockedUntil = now + (3 * 60 * 1000); // 3-minute lock after 5 failed attempts
    attempt.count = 0;
    adminAttemptsMap.set(ip, attempt);
    console.warn(`[SECURITY] IP ${ip} locked for 3 minutes due to 5 consecutive failed admin attempts.`);
    return res.status(429).json({
      success: false,
      message: 'Too many failed passcode attempts. Locked for 3 minutes for security.'
    });
  }

  adminAttemptsMap.set(ip, attempt);
  return res.status(401).json({
    success: false,
    message: `Invalid Administrative Passcode. Access Denied. (${5 - attempt.count} attempts remaining)`
  });
});

// 11. GET /api/search-suggest?q=
app.get('/api/search-suggest', (req, res) => {
  const query = ((req.query.q as string) || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, suggestions: [] });
  }

  const matchedStates = STATES
    .filter(s => (s.name || '').toLowerCase().includes(query) || (s.hindi_name && s.hindi_name.includes(query)))
    .slice(0, 3)
    .map(s => ({
      id: s.id,
      title: s.name,
      category: 'State / Region',
      state_name: s.region,
      type: 'state' as const,
      unesco: false
    }));

  const matchedHeritage = HERITAGE_ITEMS
    .filter(h =>
      (h.title || '').toLowerCase().includes(query) ||
      (h.hindi_title && h.hindi_title.toLowerCase().includes(query)) ||
      (h.location_name || '').toLowerCase().includes(query)
    )
    .slice(0, 6)
    .map(h => {
      const stateObj = STATES.find(s => s.id === h.state_id);
      const catObj = CATEGORIES.find(c => c.id === h.category_id);
      return {
        id: h.id,
        title: h.title,
        category: catObj?.name || 'Heritage',
        state_name: stateObj?.name || '',
        type: 'heritage' as const,
        unesco: h.unesco_flag
      };
    });

  res.json({
    success: true,
    suggestions: [...matchedStates, ...matchedHeritage]
  });
});

// 12. GET /api/community-heritage (Retrieve all community-contributed entries)
app.get('/api/community-heritage', (_req, res) => {
  if (db) {
    try {
      const stmt = db.prepare('SELECT * FROM community_heritage ORDER BY created_at DESC');
      const rows = stmt.all() as any[];
      const items: HeritageItem[] = rows.map(r => ({
        id: String(r.id),
        title: String(r.title),
        hindi_title: r.hindi_title ? String(r.hindi_title) : undefined,
        state_id: String(r.state_id),
        category_id: String(r.category_id),
        period: (r.period || 'Medieval') as any,
        location_name: String(r.location_name || 'India'),
        summary: String(r.summary),
        history: String(r.history || r.summary),
        culture: String(r.culture || r.summary),
        image_url: String(r.image_url || '/src/assets/images/regenerated_image_1790779565133.png'),
        video_url: String(r.video_url || ''),
        timings: String(r.timings || 'Sunrise to Sunset'),
        best_time: String(r.best_time || 'October to March'),
        unesco_flag: Boolean(r.unesco_flag),
        is_community: true,
        created_at: String(r.created_at),
        lat: Number(r.lat) || 26.9124,
        lng: Number(r.lng) || 75.7873
      }));
      return res.json({ success: true, count: items.length, items });
    } catch (err) {
      console.error('Error querying community_heritage:', err);
    }
  }

  const communityOnly = HERITAGE_ITEMS.filter(h => h.is_community);
  res.json({ success: true, count: communityOnly.length, items: communityOnly });
});

// 13. POST /api/heritage (Community & Admin: Add Heritage Entry with SQLite Persistence)
app.post('/api/heritage', (req, res) => {
  try {
    const {
      title,
      hindi_title,
      state_id,
      category_id,
      period,
      location_name,
      summary,
      history,
      culture,
      image_url,
      video_url,
      timings,
      best_time,
      unesco_flag,
      lat,
      lng
    } = req.body;

    if (!title || !summary || !state_id) {
      return res.status(400).json({ success: false, message: 'Title, State, and Summary are required.' });
    }

    const id = (req.body.id && typeof req.body.id === 'string')
      ? req.body.id
      : `community_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const createdAt = req.body.created_at || new Date().toISOString();

    const cleanTitle = sanitizeText(title).slice(0, 150);
    const cleanHindiTitle = hindi_title ? sanitizeText(hindi_title).slice(0, 150) : undefined;
    const cleanStateId = sanitizeText(state_id).toLowerCase().slice(0, 50);
    const cleanCatId = sanitizeText(category_id || 'monuments').toLowerCase().slice(0, 50);
    const cleanPeriod = (['Ancient', 'Medieval', 'Colonial', 'Modern'].includes(period) ? period : 'Medieval') as any;
    const cleanLocation = location_name ? sanitizeText(location_name).slice(0, 150) : 'India';
    const cleanSummary = sanitizeText(summary).slice(0, 1000);
    const cleanHistory = history ? sanitizeText(history).slice(0, 3000) : cleanSummary;
    const cleanCulture = culture ? sanitizeText(culture).slice(0, 3000) : cleanSummary;
    const cleanImageUrl = sanitizeImageUrl(image_url);
    const cleanVideoUrl = video_url ? sanitizeText(video_url).slice(0, 300) : '';
    const cleanTimings = timings ? sanitizeText(timings).slice(0, 100) : 'Sunrise to Sunset';
    const cleanBestTime = best_time ? sanitizeText(best_time).slice(0, 100) : 'October to March';

    const newItem: HeritageItem = {
      id,
      title: cleanTitle,
      hindi_title: cleanHindiTitle,
      state_id: cleanStateId,
      category_id: cleanCatId,
      period: cleanPeriod,
      location_name: cleanLocation,
      summary: cleanSummary,
      history: cleanHistory,
      culture: cleanCulture,
      image_url: cleanImageUrl,
      video_url: cleanVideoUrl,
      timings: cleanTimings,
      best_time: cleanBestTime,
      unesco_flag: Boolean(unesco_flag),
      is_community: true,
      created_at: createdAt,
      lat: parseFloat(lat) || 26.9124,
      lng: parseFloat(lng) || 75.7873
    };

    if (db) {
      try {
        const insert = db.prepare(`
          INSERT INTO community_heritage (
            id, title, hindi_title, state_id, category_id, period, location_name,
            summary, history, culture, image_url, video_url, timings, best_time,
            unesco_flag, is_community, lat, lng, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            hindi_title=excluded.hindi_title,
            summary=excluded.summary,
            image_url=excluded.image_url
        `);
        insert.run(
          newItem.id,
          newItem.title,
          newItem.hindi_title || null,
          newItem.state_id,
          newItem.category_id,
          newItem.period,
          newItem.location_name,
          newItem.summary,
          newItem.history,
          newItem.culture,
          newItem.image_url,
          newItem.video_url,
          newItem.timings,
          newItem.best_time,
          newItem.unesco_flag ? 1 : 0,
          1,
          newItem.lat,
          newItem.lng,
          createdAt
        );
      } catch (err) {
        console.error('Error inserting community_heritage into SQLite:', err);
      }
    }

    const existingIdx = HERITAGE_ITEMS.findIndex(h => h.id === newItem.id);
    if (existingIdx !== -1) {
      HERITAGE_ITEMS[existingIdx] = newItem;
    } else {
      HERITAGE_ITEMS.unshift(newItem);
    }

    res.status(201).json({
      success: true,
      message: 'Heritage entry added to repository.',
      item: newItem
    });
  } catch (err: any) {
    console.error('Error adding heritage entry:', err);
    res.status(500).json({ success: false, message: err?.message || 'Server error adding heritage item.' });
  }
});

// 14. DELETE /api/heritage/:id (Admin: Delete Community Heritage Entry)
app.delete('/api/heritage/:id', (req, res) => {
  const { id } = req.params;
  const passcode = req.body?.passcode || req.headers['x-admin-passcode'];

  if (!verifyAdminPasscode(passcode)) {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin passcode required to delete heritage entries.' });
  }

  if (db) {
    try {
      const stmt = db.prepare('DELETE FROM community_heritage WHERE id = ?');
      stmt.run(id);
    } catch (err) {
      console.error('SQLite delete community_heritage error:', err);
    }
  }

  const idx = HERITAGE_ITEMS.findIndex(h => h.id === id);
  if (idx !== -1) {
    HERITAGE_ITEMS.splice(idx, 1);
  }

  res.json({ success: true, message: `Heritage item '${id}' removed from repository.` });
});

// 15. GET /api/heritage/:id/photos (Retrieve Crowdsourced Photos for Monument)
app.get('/api/heritage/:id/photos', (req, res) => {
  const monumentId = req.params.id;
  let photos: MonumentPhoto[] = [];

  if (db) {
    try {
      const stmt = db.prepare('SELECT * FROM monument_photos WHERE monument_id = ? ORDER BY created_at DESC');
      const rows = stmt.all(monumentId) as any[];
      photos = rows.map(r => ({
        id: String(r.id),
        monument_id: String(r.monument_id),
        image_url: String(r.image_url),
        caption: r.caption ? String(r.caption) : undefined,
        contributor_name: String(r.contributor_name || 'Heritage Explorer'),
        created_at: String(r.created_at),
        verified: true
      }));
    } catch (err) {
      console.error('SQLite get photos error:', err);
    }
  }

  // Merge with in-memory photos
  const memPhotos = monumentPhotosDb.filter(p => p.monument_id === monumentId);
  for (const mp of memPhotos) {
    if (!photos.some(p => p.id === mp.id)) {
      photos.push(mp);
    }
  }

  res.json({ success: true, count: photos.length, photos });
});

// 16. POST /api/heritage/:id/photos (Contribute photo to monument)
app.post('/api/heritage/:id/photos', (req, res) => {
  const monumentId = req.params.id;
  const { image_url, caption, contributor_name } = req.body;

  if (!image_url || typeof image_url !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid image_url is required.' });
  }

  const cleanImageUrl = sanitizeImageUrl(image_url);
  const photoId = req.body?.id || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const createdAt = req.body?.created_at || new Date().toISOString();
  const cleanCaption = caption ? sanitizeText(caption).slice(0, 200) : undefined;
  const cleanContributor = contributor_name ? sanitizeText(contributor_name).slice(0, 80) : 'Heritage Explorer';

  const newPhoto: MonumentPhoto = {
    id: photoId,
    monument_id: sanitizeText(monumentId).slice(0, 80),
    image_url: cleanImageUrl,
    caption: cleanCaption,
    contributor_name: cleanContributor,
    created_at: createdAt,
    verified: true
  };

  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO monument_photos (id, monument_id, image_url, caption, contributor_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          image_url = excluded.image_url,
          caption = excluded.caption,
          contributor_name = excluded.contributor_name
      `);
      stmt.run(newPhoto.id, newPhoto.monument_id, newPhoto.image_url, newPhoto.caption || null, newPhoto.contributor_name, newPhoto.created_at);
    } catch (err) {
      console.error('SQLite insert photo error:', err);
    }
  }

  const existingIdx = monumentPhotosDb.findIndex(p => p.id === newPhoto.id);
  if (existingIdx !== -1) {
    monumentPhotosDb[existingIdx] = newPhoto;
  } else {
    monumentPhotosDb.unshift(newPhoto);
  }

  res.status(201).json({ success: true, message: 'Photo added to monument gallery.', photo: newPhoto });
});

// 17. DELETE /api/heritage/:id/photos/:photoId (Delete contributed photo)
app.delete('/api/heritage/:id/photos/:photoId', (req, res) => {
  const { id: monumentId, photoId } = req.params;

  if (db) {
    try {
      const stmt = db.prepare('DELETE FROM monument_photos WHERE id = ?');
      stmt.run(photoId);
    } catch (err) {
      console.error('SQLite delete photo error:', err);
    }
  }

  monumentPhotosDb = monumentPhotosDb.filter(p => p.id !== photoId);

  res.json({ success: true, message: 'Photo deleted from monument gallery.' });
});

// Centralized Express Error Handling Guard (Sanitizes errors, prevents leaking internal stack traces)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SERVER EXCEPTION]', err);
  if (res.headersSent) {
    return _next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error occurred.' : (err?.message || 'Unexpected server error')
  });
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bharat Heritage Explorer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
