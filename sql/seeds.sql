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
  (1, 'React'),
  (1, 'Express'),
  (1, 'Typescript'),
  (1, 'Javascript'),
  (1, 'PHP'),
  (1, 'DevOps'),
  -- CATEGORIA Diseño
  (2, 'Figma'),
  (2, 'UX'),
  (2, 'GameDev');

INSERT INTO users (
  name,
  email,
  password,
  role,
  occupation,
  personal_description,
  created_at
) VALUES
  ('Alejandro Rosas', 'ajrosas.19@est.edu.ucab.ve', '$2b$10$ySZyQo.uthZXfUWiRpfAZOngdCn.M5w536d1fAXRjbah2VFQyy4R6', 'admin', 'student', 'Desarrollador Fullstack con ganas de desarrollar proyectos que ayuden a la comunidad', '2022-08-27 21:30:00'),
  ('Emmanuel Salcedo', 'edsalcedo.20@est.edu.ucab.ve', '$2b$10$ySZyQo.uthZXfUWiRpfAZOngdCn.M5w536d1fAXRjbah2VFQyy4R6', 'admin', 'student', 'Desarrollador Backend con ganas de chambear', '2022-08-27 21:30:00'),
  ('Cristina Morales', '', '$2b$10$PisJTCqUe2HP2w8ilhsKuutmLsLoEg/C2TQRCkl/GQ.bg67B8/Bba', 'admin', 'student', '', '2022-08-27 21:30:00'),
  ('Luis Vazques', 'luisvasquez8877@gmail.com', '$2b$10$PisJTCqUe2HP2w8ilhsKuutmLsLoEg/C2TQRCkl/GQ.bg67B8/Bba', 'admin', 'student', '', '2022-08-27 21:30:00'),
  ('Hector Ferrer', 'hector@gmail.com', '$2b$10$4o1w2mnZJiPTPvcolgFUPuIdBZsenbneo309gHLLozKVn.A0zAIs.', 'admin', 'student', '', '2022-08-27 21:30:00'),
  ('José Vielma', 'josevglod@gmail.com', '$2b$10$qE.nAD8y/bYpEuE6p3/DDefh41wh78671jrk6FbqZtBxjZr3euyrO', 'user', 'student', '', '2022-08-27 21:30:00');

INSERT INTO publications (
  name, 
  description, 
  application_description, 
  difficulty,
  user_lead_id,
  status,
  created_at
) VALUES
  ('OFFSIDE', 'Fusi¾n entre lo mejor de los Fantasies y el coleccionar Cromos y pegarlos en Albumes', 'Ganas de Aprender y Determinaci¾n para no dormir durante al menos 72hrs seguidas', 4, 5, 'finished', '2022-08-27 14:00:00'),
  ('Yarape: Calculadora de Huella Ecol¾gica', 'Ayuda a las personas a conocer su impacto ecol¾gico y concientizarse para hacer un mundo mejor', 'Ganas de trabajar en un equipo multi-disciplinario en busca de dar y llevar una soluci¾n al p·blico', 2, 1, 'started', '2023-04-17 10:30:00'),
  ('Concesionarios T&Y', 'Aplicaci¾n de Gesti¾n de Concesionarios para la Empresa T&Y', 'Conocimiento en Base de Datos y Dise±o de Experiencias de Usuario para hacer un panel administrativo intuitivo y c¾modo para el usuario', 3, 2, 'not-started', '2023-04-22 15:30:00');

INSERT INTO application_requirements (
  publication_id,
  skill_category_id,
  skill_id,
  level,
  quantity
) VALUES
  -- Offside
  (1, 1, 1, 2, 6),
  (1, 1, 2, 3, 4),
  (1, 2, 7, 2, 5),
  -- Yarape
  (2, 1, 1, 2, 2),
  (2, 1, 2, 3, 1),
  (2, 2, 7, 2, 2),
  -- T&Y
  (3, 1, 3, 2, 2),
  (3, 1, 6, 3, 3),
  (3, 2, 7, 3, 1);

INSERT INTO user_skills (
  user_id,
  skill_category_id,
  skill_id,
  level
) VALUES
  -- Alejandro Rosas
  (1, 1, 1, 3),
  (1, 1, 2, 3),
  (1, 1, 3, 2),
  (1, 1, 4, 2),
  -- Emmanuel Salcedo
  (2, 1, 2, 4),
  (2, 1, 5, 3),
  (2, 1, 6, 4),
  -- Hector Ferrer
  (5, 1, 1, 4),
  (5, 1, 2, 4),
  (5, 1, 3, 4),
  (5, 1, 4, 4),
  (5, 1, 5, 4),
  (5, 1, 6, 4),
  (5, 2, 7, 4),
  (5, 2, 8, 4),
  (5, 2, 9, 4);

INSERT INTO applications (
  publication_id,
  user_id,
  is_accepted,
  description,
  created_at
) VALUES
  -- Offside
  (1, 1, TRUE, 'Me llama la atención la idea considero que podría trabajar en una aplicación movil para la idea', '2022-08-30 19:00:00');

INSERT INTO collaborators (
  publication_id,
  user_id,
  created_at
) VALUES
  -- Offside
  (1, 1, '2022-08-30 19:00:00');
