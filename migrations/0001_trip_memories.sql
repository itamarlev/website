CREATE TABLE IF NOT EXISTS trip_day_notes (
  trip_slug TEXT NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 31),
  note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 4000),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (trip_slug, day_number)
);

CREATE TABLE IF NOT EXISTS trip_photos (
  id TEXT PRIMARY KEY,
  trip_slug TEXT NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 31),
  object_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 15728640),
  caption TEXT NOT NULL DEFAULT '' CHECK (length(caption) <= 240),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trip_photos_day
  ON trip_photos (trip_slug, day_number, created_at DESC);
