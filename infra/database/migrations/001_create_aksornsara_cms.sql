-- ==============================================================================
-- Migration: 001_create_aksornsara_cms.sql
-- Description: Schema definition for AksornSara CMS (PostgreSQL 16)
-- Conforms to: AksornSara Database Design Specification v1.0
-- ==============================================================================

-- 1. Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'spam', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CMS Roles & User Roles (Many-to-Many RBAC)
CREATE TABLE IF NOT EXISTS cms_roles (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS cms_user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Seed default CMS Roles
INSERT INTO cms_roles (role_name, description) VALUES
('super_admin', 'ผู้ดูแลระบบสูงสุด จัดการสิทธิ์และการลบข้อมูลทุกส่วน'),
('editor', 'บรรณาธิการ ตรวจสอบ แก้ไข และเผยแพร่บทความ'),
('writer', 'นักเขียน สร้างและแก้ไขบทความ/ฉบับร่างของตนเอง')
ON CONFLICT (role_name) DO NOTHING;

-- 3. Categories & Tags
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Articles (Core Table Extension)
CREATE TABLE IF NOT EXISTS "Articles" (
    id BIGSERIAL PRIMARY KEY,
    "writerId" BIGINT,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    status article_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    excerpt TEXT,
    cover_image_url TEXT,
    published_by BIGINT,
    writer_credit VARCHAR(255),
    proofreader_credit VARCHAR(255),
    illustrator_credit VARCHAR(255),
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    view_count BIGINT NOT NULL DEFAULT 0,
    legacy_url TEXT,
    legacy_year VARCHAR(10)
);

-- Ensure columns exist if table already existed in Artsgoz
ALTER TABLE "Articles"
    ADD COLUMN IF NOT EXISTS excerpt TEXT,
    ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
    ADD COLUMN IF NOT EXISTS published_by BIGINT,
    ADD COLUMN IF NOT EXISTS writer_credit VARCHAR(255),
    ADD COLUMN IF NOT EXISTS proofreader_credit VARCHAR(255),
    ADD COLUMN IF NOT EXISTS illustrator_credit VARCHAR(255),
    ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200),
    ADD COLUMN IF NOT EXISTS meta_description VARCHAR(300),
    ADD COLUMN IF NOT EXISTS view_count BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS legacy_url TEXT,
    ADD COLUMN IF NOT EXISTS legacy_year VARCHAR(10);

-- 5. Article Categories & Tags Junctions
CREATE TABLE IF NOT EXISTS article_categories (
    article_id BIGINT NOT NULL REFERENCES "Articles"(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (article_id, category_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_article_categories_primary
    ON article_categories(article_id)
    WHERE is_primary = TRUE;

CREATE TABLE IF NOT EXISTS article_tags (
    article_id BIGINT NOT NULL REFERENCES "Articles"(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 6. Analytics, Views, Comments, & Activity Logs
CREATE TABLE IF NOT EXISTS article_views (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES "Articles"(id) ON DELETE CASCADE,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES "Articles"(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status comment_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Performance & Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_articles_status_pubdate
    ON "Articles"(status, published_at DESC)
    WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_author
    ON "Articles"("writerId");

CREATE INDEX IF NOT EXISTS idx_article_views_date
    ON article_views(viewed_at, article_id);

CREATE INDEX IF NOT EXISTS idx_comments_article_status
    ON comments(article_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at
    ON activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cms_user_roles_role
    ON cms_user_roles(role_id, user_id);

