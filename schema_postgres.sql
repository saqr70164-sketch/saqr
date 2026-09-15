-- PostgreSQL schema
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  size_category TEXT,
  pain_points TEXT,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  industry TEXT,
  joined_at DATE
);

CREATE TABLE case_studies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  full_story TEXT,
  industry TEXT,
  key_metrics JSONB,
  hero_image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  case_study_id INT REFERENCES case_studies(id) ON DELETE CASCADE,
  author_name TEXT,
  author_title TEXT,
  quote TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE interactions (
  id SERIAL PRIMARY KEY,
  lead_id INT REFERENCES leads(id) ON DELETE SET NULL,
  channel TEXT,
  subject TEXT,
  note TEXT,
  occurred_at TIMESTAMP DEFAULT now()
);
