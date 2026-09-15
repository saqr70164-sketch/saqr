-- MySQL schema (InnoDB, MySQL 5.7+ for JSON)
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  industry VARCHAR(100),
  size_category VARCHAR(50),
  pain_points TEXT,
  score INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  industry VARCHAR(100),
  joined_at DATE
) ENGINE=InnoDB;

CREATE TABLE case_studies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  full_story TEXT,
  industry VARCHAR(100),
  key_metrics JSON,
  hero_image_url VARCHAR(1000),
  published BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_study_id INT,
  author_name VARCHAR(255),
  author_title VARCHAR(255),
  quote TEXT,
  photo_url VARCHAR(1000),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_study_id) REFERENCES case_studies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT,
  channel VARCHAR(50),
  subject VARCHAR(255),
  note TEXT,
  occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
) ENGINE=InnoDB;
