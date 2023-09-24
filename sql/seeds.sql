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

INSERT INTO publications (
  name, 
  description, 
  application_description, 
  difficulty, 
  user_lead_id
) VALUES
  ('Publicaci¾n 1', 'Descripci¾n de la publicación 1', 'Descripci¾n de la aplicación 1', 3, 1),
  ('Publicaci¾n 2', 'Descripci¾n de la publicación 2', 'Descripci¾n de la aplicación 2', 2, 2),
  ('Publicaci¾n 3', 'Descripci¾n de la publicación 3', 'Descripci¾n de la aplicación 3', 4, 3);
  