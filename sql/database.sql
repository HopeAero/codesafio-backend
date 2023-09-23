-- Domains and Types
CREATE DOMAIN dom_name VARCHAR(64);
CREATE DOMAIN dom_description VARCHAR(256);
CREATE DOMAIN dom_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE TYPE dom_role AS ENUM ('admin', 'user');

CREATE TABLE test (
  test_id INTEGER GENERATED ALWAYS AS IDENTITY,
  description dom_name UNIQUE NOT NULL,
  balance FLOAT DEFAULT 0 NOT NULL,
  created_at dom_created_at,
  updated_at dom_created_at,
  PRIMARY KEY (test_id)
);

CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY,
  username dom_name UNIQUE NOT NULL,
  password dom_name NOT NULL,
  role dom_role NOT NULL DEFAULT 'user',
  PRIMARY KEY (user_id)
);
