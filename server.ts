import Database from 'better-sqlite3';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('medsimplify.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Auth Routes
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
      const info = stmt.run(email, password, name);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: 'User already exists or invalid data' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Report Routes
  app.post('/api/reports/save', (req, res) => {
    const { userId, filename, analysis } = req.body;
    const stmt = db.prepare('INSERT INTO reports (user_id, filename, analysis) VALUES (?, ?, ?)');
    const info = stmt.run(userId, filename, JSON.stringify(analysis));
    res.json({ success: true, reportId: info.lastInsertRowid });
  });

  app.get('/api/reports/:userId', (req, res) => {
    const reports = db.prepare('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId);
    res.json(reports);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
