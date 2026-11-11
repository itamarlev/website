CREATE TABLE IF NOT EXISTS generated_trips (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'wanderkind',
  title TEXT,
  trip_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
