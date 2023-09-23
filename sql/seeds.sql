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
  