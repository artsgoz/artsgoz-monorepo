-- ==============================================================================
-- Migration: 002_seed_initial_data.sql
-- Description: Seed initial categories, tags, and sample articles
-- ==============================================================================

-- 1. Default Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'ศิลปะ', 'art', 'บทความศิลปะ ทัศนศิลป์ ดนตรี และการออกแบบ'),
(2, 'วรรณกรรม', 'literature', 'บทความวิเคราะห์ วิจารณ์ และสำรวจโลกแห่งวรรณกรรม'),
(3, 'ภาษา', 'language', 'ภาษาศาสตร์ การแปล และการสื่อสารร่วมสมัย'),
(4, 'วัฒนธรรม', 'culture', 'ประเพณี วิถีชีวิต และวัฒนธรรมร่วมสมัย'),
(5, 'ปรัชญา', 'philosophy', 'บทวิเคราะห์แนวคิดเชิงปรัชญา มนุษยศาสตร์ และจิตวิทยา'),
(6, 'วิจารณ์', 'criticism', 'บทวิจารณ์ภาพยนตร์ ละครเวที ซีรีส์ และบทวิเคราะห์'),
(7, 'ทั่วไป', 'general', 'บทความทั่วไป คอลัมน์พิเศษ และบันทึกประสบการณ์นิสิต')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Set sequence
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 2. Default Tags
INSERT INTO tags (id, name, slug) VALUES
(1, 'ศิลปะ', 'art'),
(2, 'วรรณกรรม', 'literature'),
(3, 'ภาษา', 'language'),
(4, 'วัฒนธรรม', 'culture'),
(5, 'ปรัชญา', 'philosophy'),
(6, 'วิจารณ์', 'criticism'),
(7, 'ทั่วไป', 'general'),
(8, 'การอ่าน', 'reading'),
(9, 'ดนตรี', 'music'),
(10, 'จิตวิทยา', 'psychology'),
(11, 'ภาพยนตร์', 'film'),
(12, 'ประวัติศาสตร์', 'history'),
(13, 'คำศัพท์', 'vocabulary'),
(14, 'สาราณียกร', 'saraniyakorn')
ON CONFLICT (slug) DO NOTHING;

SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));

