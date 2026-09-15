-- SQLite schema (JSON stored as TEXT)
PRAGMA foreign_keys = ON;

CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  size_category TEXT,
  pain_points TEXT,
  score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  industry TEXT,
  joined_at DATE
);

CREATE TABLE case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  full_story TEXT,
  industry TEXT,
  key_metrics TEXT, -- JSON as TEXT
  hero_image_url TEXT,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_study_id INTEGER,
  author_name TEXT,
  author_title TEXT,
  quote TEXT,
  photo_url TEXT,
  created_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY(case_study_id) REFERENCES case_studies(id) ON DELETE CASCADE
);

CREATE TABLE interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER,
  channel TEXT,
  subject TEXT,
  note TEXT,
  occurred_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY(lead_id) REFERENCES leads(id) ON DELETE SET NULL
);
