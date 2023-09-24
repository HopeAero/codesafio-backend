-- Domains and Types
CREATE TYPE dom_role AS ENUM ('admin', 'user');
CREATE TYPE dom_occupation AS ENUM ('teacher', 'student', 'graduated');
CREATE TYPE dom_status AS ENUM ('finished', 'started', 'not-started');
CREATE DOMAIN dom_name VARCHAR(64);
CREATE DOMAIN dom_description VARCHAR(500);
CREATE DOMAIN dom_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE skill_categories (
  skill_category_id INTEGER GENERATED ALWAYS AS IDENTITY,
  name dom_name UNIQUE NOT NULL,
  created_at dom_created_at,
  PRIMARY KEY (skill_category_id)
);

CREATE TABLE skills (
  skill_category_id INTEGER NOT NULL,
  skill_id INTEGER GENERATED ALWAYS AS IDENTITY,
  name dom_name UNIQUE NOT NULL,
  created_at dom_created_at,
  PRIMARY KEY (skill_category_id, skill_id),
  CONSTRAINT skill_category_id_fk FOREIGN KEY (skill_category_id) 
    REFERENCES skill_categories (skill_category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY,
  name dom_name NOT NULL,
  email dom_name UNIQUE NOT NULL,
  password dom_name NOT NULL,
  role dom_role NOT NULL DEFAULT 'user',
  occupation dom_occupation NOT NULL DEFAULT 'student',
  personal_description dom_description DEFAULT NULL,
  created_at dom_created_at,
  PRIMARY KEY (user_id)
);

CREATE TABLE publications (
  publication_id INTEGER GENERATED ALWAYS AS IDENTITY,
  name dom_name NOT NULL,
  description dom_description DEFAULT NULL,
  application_description dom_description DEFAULT NULL,
  difficulty INTEGER NOT NULL,
  status dom_status NOT NULL DEFAULT 'not-started',
  user_lead_id INTEGER NOT NULL,
  created_at dom_created_at,
  updated_at dom_created_at,
  PRIMARY KEY (publication_id),
  CONSTRAINT user_lead_id_fk FOREIGN KEY (user_lead_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT difficulty_chk CHECK (difficulty >= 1 AND difficulty <= 4)
);

CREATE TABLE applications (
  publication_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_accepted BOOLEAN DEFAULT NULL,
  description dom_description DEFAULT NULL,
  created_at dom_created_at,
  updated_at dom_created_at,
  PRIMARY KEY (publication_id, user_id),
  CONSTRAINT publication_id_fk FOREIGN KEY (publication_id) 
    REFERENCES publications (publication_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE collaborators (
  publication_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  description dom_description DEFAULT NULL,
  rating INTEGER NOT NULL,
  created_at dom_created_at,
  PRIMARY KEY (publication_id, user_id),
  CONSTRAINT publication_id_fk FOREIGN KEY (publication_id) 
    REFERENCES publications (publication_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE user_skills (
  user_id INTEGER NOT NULL,
  skill_category_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_category_id, skill_id),
  CONSTRAINT user_id_fk FOREIGN KEY (user_id) 
    REFERENCES users (user_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT skills_fk FOREIGN KEY (skill_category_id, skill_id) 
    REFERENCES skills (skill_category_id, skill_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT level_chk CHECK((level >= 1) AND (level <= 4))
);

CREATE TABLE application_requirements (
  publication_id INTEGER NOT NULL,
  skill_category_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  level INTEGER DEFAULT NULL,
  quantity INTEGER NOT NULL,
  created_at dom_created_at,
  PRIMARY KEY (publication_id, skill_category_id, skill_id),
  CONSTRAINT publication_id_fk FOREIGN KEY (publication_id) 
    REFERENCES publications (publication_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT skills_fk FOREIGN KEY (skill_category_id, skill_id) 
    REFERENCES skills (skill_category_id, skill_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT level_chk CHECK((level >= 1) AND (level <= 4))
);

CREATE TABLE user_skills(
  user_id INTEGER NOT NULL,
  skill_category_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_category_id, skill_id),
  CONSTRAINT user_id_fk FOREIGN KEY (user_id) 
    REFERENCES users (user_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT skills_fk FOREIGN KEY (skill_category_id, skill_id) 
    REFERENCES skills (skill_category_id, skill_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT level_chk CHECK((level >= 1) AND (level <= 4))
);

-- ||||||||||||||||||||||||||||||||||||||
--              TRIGGERS
-- |||||||||||||||||||||||||||||||||||||

CREATE FUNCTION update_updated_at ()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at_publications
BEFORE UPDATE ON publications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_updated_at_applications
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
