import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic'; // always render fresh
export const runtime = 'nodejs';        // ensure we use Node runtime

export default function LogsPage() {
  // Open the database
  const db = new Database(path.join(process.cwd(), 'beacon.db'));

  // Get last 100 log rows
  const rows = db.prepare(
    'SELECT * FROM beacon_logs ORDER BY id DESC LIMIT 100'
  ).all();

  return (
    <main style={{ maxWidth: 1000, margin: '3rem auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Agent Beacon Logs
      </h1>

      {rows.length === 0 ? (
        <p>No logs recorded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th align="left">Timestamp</th>
              <th align="left">Agent</th>
              <th align="left">Session</th>
              <th align="left">Query</th>
              <th align="left">IP</th>
              <th align="left">UA</th>
              <th align="left">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td>{r.ts}</td>
                <td>{r.agent}</td>
                <td>{r.session_id}</td>
                <td>{r.q}</td>
                <td>{r.ip}</td>
                <td style={{
                  maxWidth: 300,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {r.ua}
                </td>
                <td>{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
