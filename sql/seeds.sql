-- Seeds
-- Carácter || Correspondiente en Postgres
-- á || ß 
-- é || Ú
-- í || Ý
-- ó || ¾
-- ú || ·
-- Á || ┴
-- É || ╔
-- Í || ═
-- Ó || Ë
-- Ú || ┌
-- ñ || ±
-- ¿ || ┐

INSERT INTO skill_categories (
  name
) VALUES
  ('Programaci¾n'),
  ('Dise±o');

INSERT INTO skills (
  skill_category_id,
  name
) VALUES
  -- CATEGORIA Programación
  (1, 'Cualquier tecnologÝa de Frontend'),
  (1, 'Cualquier tecnologÝa de Backend'),
  (1, 'Typescript'),
  (1, 'Javascript'),
  (1, 'PHP'),
  (1, 'Laravel'),
  -- CATEGORIA Diseño
  (2, 'Figma'),
  (2, 'UX'),
  (2, 'Juegos');

INSERT INTO publications (name, description, application_description, difficulty, status, user_lead_id, created_at, updated_at)
VALUES
  ('Publicación 1', 'Descripción de la publicación 1', 'Descripción de la aplicación 1', 3, 'not-started', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Publicación 2', 'Descripción de la publicación 2', 'Descripción de la aplicación 2', 2, 'started', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Publicación 3', 'Descripción de la publicación 3', 'Descripción de la aplicación 3', 4, 'finished', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);