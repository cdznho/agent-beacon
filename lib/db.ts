import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'beacon.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS beacon_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  ip TEXT,
  ua TEXT,
  referrer TEXT,
  agent TEXT,
  session_id TEXT,
  q TEXT,
  source TEXT,
  extra_json TEXT
);
`);

export function logBeacon(row: {
  ip?: string | null;
  ua?: string | null;
  referrer?: string | null;
  agent?: string | null;
  session_id?: string | null;
  q?: string | null;
  source?: string | null;
  extra_json?: any;
}) {
  const stmt = db.prepare(`
    INSERT INTO beacon_logs (ts, ip, ua, referrer, agent, session_id, q, source, extra_json)
    VALUES (@ts, @ip, @ua, @referrer, @agent, @session_id, @q, @source, @extra_json)
  `);
  stmt.run({
    ts: new Date().toISOString(),
    ip: row.ip || null,
    ua: row.ua || null,
    referrer: row.referrer || null,
    agent: row.agent || null,
    session_id: row.session_id || null,
    q: row.q || null,
    source: row.source || null,
    extra_json: row.extra_json ? JSON.stringify(row.extra_json) : null,
  });
}
