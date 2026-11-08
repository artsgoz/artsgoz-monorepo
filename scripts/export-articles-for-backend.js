const fs = require('fs');
const path = require('path');

const detailPath = path.join(__dirname, '../apps/aksornsara-frontend/src/features/articles/data/articles-detail.json');
const summaryPath = path.join(__dirname, '../apps/aksornsara-frontend/src/features/articles/data/articles-summary.json');
const exportDir = path.join(__dirname, '../exports/aksornsara-database-export');

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

const detail = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const categoryMap = {
  'ศิลปะ': { id: 1, slug: 'art' },
  'วรรณกรรม': { id: 2, slug: 'literature' },
  'ภาษา': { id: 3, slug: 'language' },
  'วัฒนธรรม': { id: 4, slug: 'culture' },
  'ปรัชญา': { id: 5, slug: 'philosophy' },
  'วิจารณ์': { id: 6, slug: 'criticism' },
  'ทั่วไป': { id: 7, slug: 'general' },
};

const tagMap = {
  'ศิลปะ': { id: 1, slug: 'art' },
  'วรรณกรรม': { id: 2, slug: 'literature' },
  'ภาษา': { id: 3, slug: 'language' },
  'วัฒนธรรม': { id: 4, slug: 'culture' },
  'ปรัชญา': { id: 5, slug: 'philosophy' },
  'วิจารณ์': { id: 6, slug: 'criticism' },
  'ทั่วไป': { id: 7, slug: 'general' },
  'การอ่าน': { id: 8, slug: 'reading' },
  'ดนตรี': { id: 9, slug: 'music' },
  'จิตวิทยา': { id: 10, slug: 'psychology' },
  'ภาพยนตร์': { id: 11, slug: 'film' },
  'ประวัติศาสตร์': { id: 12, slug: 'history' },
  'คำศัพท์': { id: 13, slug: 'vocabulary' },
  'สาราณียกร': { id: 14, slug: 'saraniyakorn' },
};

function parseDateToISO(dateStr, yearStr) {
  if (dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);
      let yr = parseInt(parts[2], 10);
      if (yr < 100) {
        yr = yr < 50 ? 2000 + yr : 2500 + yr - 543;
      }
      const d = new Date(Date.UTC(yr, month - 1, day, 0, 0, 0));
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }
  if (yearStr) {
    let numYear = parseInt(yearStr, 10);
    if (!isNaN(numYear)) {
      if (numYear > 2400) numYear -= 543;
      return new Date(Date.UTC(numYear, 0, 1, 0, 0, 0)).toISOString();
    }
  }
  return new Date().toISOString();
}

function sqlEscape(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const keys = Object.keys(detail);
const articlesExport = [];
const allImagesExport = [];
let nextDbId = 1;

for (const key of keys) {
  const art = detail[key];
  const dbId = parseInt(art.id.replace(/\D/g, ''), 10) || nextDbId;
  nextDbId = Math.max(nextDbId, dbId + 1);

  // Fallback contentHtml if empty
  let contentHtml = art.contentHtml;
  if (!contentHtml && art.content && Array.isArray(art.content)) {
    contentHtml = art.content.map((p) => `<p>${p}</p>`).join('\n');
  } else if (!contentHtml) {
    contentHtml = `<p>${art.excerpt || ''}</p>`;
  }

  const coverImage = art.coverImage || art.imageUrl || null;
  const bodyImages = art.bodyImages || [];
  const allImages = [];
  if (coverImage) allImages.push(coverImage);
  bodyImages.forEach((img) => {
    if (!allImages.includes(img)) allImages.push(img);
  });

  const catInfo = categoryMap[art.category] || { id: 7, slug: 'general' };
  const publishedAtISO = parseDateToISO(art.date, art.year);
  const references = art.references || [];
  const tags = art.tags || [art.category || 'ทั่วไป'];

  const exportedItem = {
    id: dbId,
    article_code: art.id,
    title: art.title,
    slug: art.slug || art.id,
    excerpt: art.excerpt || '',
    content_html: contentHtml,
    content_plain: art.content || [],
    cover_image_url: coverImage,
    body_image_urls: bodyImages,
    all_images: allImages,
    category_id: catInfo.id,
    category_name: art.category,
    category_slug: catInfo.slug,
    tags: tags,
    writer_credit: art.author || 'ชมรมสาราณียกร',
    author_name: art.author || 'ชมรมสาราณียกร',
    proofreader_credit: art.proofreader || null,
    illustrator_credit: art.illustrator || null,
    references: references,
    view_count: art.views || 0,
    status: 'published',
    read_time: art.readTime || '5 นาที',
    legacy_year: art.year || '2026',
    published_at: publishedAtISO,
    original_url: art.url || null,
    created_at: publishedAtISO,
    updated_at: new Date().toISOString(),
  };

  articlesExport.push(exportedItem);

  // Track image manifest
  if (coverImage) {
    allImagesExport.push({
      article_id: art.id,
      article_title: art.title,
      type: 'cover_image',
      url: coverImage,
    });
  }
  bodyImages.forEach((bUrl, idx) => {
    allImagesExport.push({
      article_id: art.id,
      article_title: art.title,
      type: `body_image_${idx + 1}`,
      url: bUrl,
    });
  });
}

// 1. Write aksornsara-articles.json (Full Array for DB / ORM Seed)
const jsonPath = path.join(exportDir, 'aksornsara-articles.json');
fs.writeFileSync(jsonPath, JSON.stringify(articlesExport, null, 2), 'utf8');
console.log(`Saved ${articlesExport.length} articles to ${jsonPath}`);

// 2. Write aksornsara-images.json
const imagesJsonPath = path.join(exportDir, 'aksornsara-images.json');
fs.writeFileSync(imagesJsonPath, JSON.stringify(allImagesExport, null, 2), 'utf8');
console.log(`Saved ${allImagesExport.length} images metadata to ${imagesJsonPath}`);

// 3. Write aksornsara-images.csv
const imagesCsvPath = path.join(exportDir, 'aksornsara-images.csv');
const csvHeader = 'article_id,type,url,article_title\n';
const csvRows = allImagesExport
  .map(
    (img) =>
      `"${img.article_id}","${img.type}","${img.url}","${img.article_title.replace(/"/g, '""')}"`
  )
  .join('\n');
fs.writeFileSync(imagesCsvPath, csvHeader + csvRows, 'utf8');
console.log(`Saved CSV images manifest to ${imagesCsvPath}`);

// 4. Generate aksornsara-articles-seed.sql (PostgreSQL compliant with 001_create_aksornsara_cms.sql)
let sqlContent = `-- ==============================================================================
-- AksornSara CMS Database Seed Script (PostgreSQL 16)
-- Conforms to: infra/database/migrations/001_create_aksornsara_cms.sql
-- Total Articles: ${articlesExport.length}
-- Total Images: ${allImagesExport.length}
-- Generated at: ${new Date().toISOString()}
-- ==============================================================================

BEGIN;

-- 1. Ensure Categories exist
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'ศิลปะ', 'art', 'บทความศิลปะ ทัศนศิลป์ ดนตรี และการออกแบบ'),
(2, 'วรรณกรรม', 'literature', 'บทความวิเคราะห์ วิจารณ์ และสำรวจโลกแห่งวรรณกรรม'),
(3, 'ภาษา', 'language', 'ภาษาศาสตร์ การแปล และการสื่อสารร่วมสมัย'),
(4, 'วัฒนธรรม', 'culture', 'ประเพณี วิถีชีวิต และวัฒนธรรมร่วมสมัย'),
(5, 'ปรัชญา', 'philosophy', 'บทวิเคราะห์แนวคิดเชิงปรัชญา มนุษยศาสตร์ และจิตวิทยา'),
(6, 'วิจารณ์', 'criticism', 'บทวิจารณ์ภาพยนตร์ ละครเวที ซีรีส์ และบทวิเคราะห์'),
(7, 'ทั่วไป', 'general', 'บทความทั่วไป คอลัมน์พิเศษ และบันทึกประสบการณ์นิสิต')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 2. Ensure Tags exist
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

-- 3. Insert Articles
`;

for (const a of articlesExport) {
  sqlContent += `
INSERT INTO "Articles" (
    id, title, slug, content, status, excerpt, cover_image_url,
    writer_credit, proofreader_credit, illustrator_credit,
    view_count, legacy_url, legacy_year, published_at, created_at, updated_at
) VALUES (
    ${a.id},
    ${sqlEscape(a.title)},
    ${sqlEscape(a.slug)},
    ${sqlEscape(a.content_html)},
    'published',
    ${sqlEscape(a.excerpt)},
    ${sqlEscape(a.cover_image_url)},
    ${sqlEscape(a.writer_credit)},
    ${sqlEscape(a.proofreader_credit)},
    ${sqlEscape(a.illustrator_credit)},
    ${a.view_count},
    ${sqlEscape(a.original_url)},
    ${sqlEscape(a.legacy_year)},
    ${sqlEscape(a.published_at)},
    ${sqlEscape(a.created_at)},
    ${sqlEscape(a.updated_at)}
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    cover_image_url = EXCLUDED.cover_image_url,
    writer_credit = EXCLUDED.writer_credit,
    proofreader_credit = EXCLUDED.proofreader_credit,
    illustrator_credit = EXCLUDED.illustrator_credit,
    view_count = EXCLUDED.view_count,
    legacy_url = EXCLUDED.legacy_url,
    legacy_year = EXCLUDED.legacy_year,
    published_at = EXCLUDED.published_at,
    updated_at = EXCLUDED.updated_at;

-- Link primary category
INSERT INTO article_categories (article_id, category_id, is_primary)
VALUES (${a.id}, ${a.category_id}, TRUE)
ON CONFLICT (article_id, category_id) DO NOTHING;
`;

  // Link tags
  if (a.tags && a.tags.length > 0) {
    for (const tag of a.tags) {
      const tInfo = tagMap[tag];
      if (tInfo) {
        sqlContent += `INSERT INTO article_tags (article_id, tag_id) VALUES (${a.id}, ${tInfo.id}) ON CONFLICT DO NOTHING;\n`;
      }
    }
  }
}

sqlContent += `
SELECT setval('"Articles_id_seq"', (SELECT MAX(id) FROM "Articles"));

COMMIT;
`;

const sqlPath = path.join(exportDir, 'aksornsara-articles-seed.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log(`Saved PostgreSQL seed script to ${sqlPath}`);

// 5. Write Node.js helper to download images locally or to Cloud Storage
const downloadScriptPath = path.join(exportDir, 'download-images.js');
const downloadScriptContent = `/**
 * Optional helper script to download all article images locally
 * Run: node download-images.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = require('./aksornsara-images.json');
const targetDir = path.join(__dirname, 'downloaded-images');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(\`Starting download of \${images.length} images to \${targetDir}...\`);

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(\`HTTP \${res.statusCode}\`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  let success = 0;
  let failed = 0;
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = path.extname(new URL(img.url).pathname) || '.jpg';
    const filename = \`\${img.article_id}_\${img.type}\${ext}\`;
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest)) {
      success++;
      continue;
    }

    try {
      await downloadFile(img.url, dest);
      success++;
      if (success % 25 === 0 || i === images.length - 1) {
        console.log(\`[\${i + 1}/\${images.length}] Downloaded \${filename}\`);
      }
    } catch (err) {
      failed++;
      console.error(\`Failed \${img.url}: \${err.message}\`);
    }
  }
  console.log(\`Done! Success: \${success}, Failed: \${failed}\`);
}

run();
`;
fs.writeFileSync(downloadScriptPath, downloadScriptContent, 'utf8');
console.log(`Saved image downloader script to ${downloadScriptPath}`);

// 6. Write README.md
const readmePath = path.join(exportDir, 'README.md');
const readmeContent = `# AksornSara Articles & Images Export for Backend Database

ไฟล์ชุดนี้เป็นการ Export บทความทั้งหมดของ **ชมรมอักษรสาราณียกร (AksornSara)** จำนวน **169 บทความ** พร้อมรูปภาพหน้าปกและรูปภาพที่แทรกในเนื้อหาทั้งหมด **331 รูป** สำหรับให้ทีม Backend นำไปใส่ใน Database ได้ทันที

---

## 📁 รายการไฟล์ในโฟลเดอร์นี้

| ชื่อไฟล์ | รูปแบบ | วัตถุประสงค์ / การใช้งาน |
| :--- | :---: | :--- |
| **\`aksornsara-articles.json\`** | JSON Array | ข้อมูลบทความครบทั้ง 169 รายการ (พร้อม HTML, เนื้อหา, หมวดหมู่, เครดิตผู้เขียน, รูปภาพ, รายการอ้างอิง) สำหรับใช้กับ Prisma, TypeORM, MongoDB, Firebase หรือ Script นำเข้าของ Backend |
| **\`aksornsara-articles-seed.sql\`** | SQL Script | คำสั่ง SQL Seed สำหรับ **PostgreSQL** ตรงตาม Schema \`infra/database/migrations/001_create_aksornsara_cms.sql\` สามารถรันนำเข้าฐานข้อมูลได้ทันที |
| **\`aksornsara-images.json\`** | JSON Array | รายการรูปภาพทั้งหมด (331 รูป: หน้าปก 169 รูป + ในเนื้อหา 162 รูป) พร้อมลิงก์ตรงและ Article ID กำกับ |
| **\`aksornsara-images.csv\`** | CSV | สรุปรายการรูปภาพทั้งหมดสำหรับเปิดใน Excel / Google Sheets หรือเครื่องมือ Import |
| **\`download-images.js\`** | Node.js | สคริปต์เสริมสำหรับดาวน์โหลดไฟล์รูปภาพทั้งหมดมาเก็บไว้ในเครื่อง หรือใช้อัปโหลดขึ้น Cloud Storage (S3 / GCS) |

---

## 📊 ข้อมูลสถิติของชุดข้อมูล (Data Statistics)
- **จำนวนบทความทั้งหมด:** 169 บทความ
- **บทความที่มีภาพหน้าปก:** 169 บทความ (100%)
- **รูปภาพที่แทรกในเนื้อหาบทความ:** 162 รูปภาพ
- **รวมรูปภาพทั้งหมด:** 331 รูปภาพ
- **หมวดหมู่ (7 หมวด):** ศิลปะ, วรรณกรรม, ภาษา, วัฒนธรรม, ปรัชญา, วิจารณ์, ทั่วไป
- **แท็ก (14 แท็ก):** ตามระบบ AksornSara CMS

---

## 🛠️ โครงสร้างข้อมูลในแต่ละบทความ (\`aksornsara-articles.json\`)

\`\`\`json
{
  "id": 1,
  "article_code": "art-001",
  "title": "“ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง” : เพราะความหวังผลิบานเป็นนิรันดร์ในใจมนุษย์",
  "slug": "art-001",
  "excerpt": "สรุปเนื้อหาบทความ...",
  "content_html": "<p>ย่อหน้าแรก...</p><figure><img src=\"https://...\" /><figcaption>...</figcaption></figure>",
  "content_plain": ["ย่อหน้าแรก...", "ย่อหน้าที่สอง..."],
  "cover_image_url": "https://files.cdn-files-a.com/uploads/.../800_....jpg",
  "body_image_urls": [
    "https://files.cdn-files-a.com/uploads/.../2000_....jpg"
  ],
  "all_images": [
    "https://files.cdn-files-a.com/uploads/.../800_....jpg",
    "https://files.cdn-files-a.com/uploads/.../2000_....jpg"
  ],
  "category_id": 5,
  "category_name": "ปรัชญา",
  "category_slug": "philosophy",
  "tags": ["ปรัชญา", "สาราณียกร"],
  "writer_credit": "ภัคจิรา มาตาพิทักษ์ และ ภูวิศ พิศวง",
  "proofreader_credit": "ธนพงษ์ เมืองศิลปศาสตร์",
  "illustrator_credit": "นิปุณ อังควิชัย",
  "references": [
    "ปาณิส โพธิ์ศรีวังชัย. (2564). ไม่มีใครเป็นเจ้าของความหวังเพียงผู้เดียว..."
  ],
  "view_count": 120,
  "status": "published",
  "read_time": "5 นาที",
  "legacy_year": "2021",
  "published_at": "2021-01-01T00:00:00.000Z",
  "original_url": "https://www.aksornsara.com/post/...",
  "created_at": "2021-01-01T00:00:00.000Z",
  "updated_at": "2026-11-08T09:40:00.000Z"
}
\`\`\`

---

## 🚀 วิธีการนำเข้าฐานข้อมูล (How to Import)

### วิธีที่ 1: รันคำสั่ง SQL เข้า PostgreSQL โดยตรง
\`\`\`bash
psql -U <username> -d <database_name> -f exports/aksornsara-database-export/aksornsara-articles-seed.sql
\`\`\`

### วิธีที่ 2: ใช้กับ Prisma ใน Node.js / TypeScript Backend
\`\`\`typescript
import articles from './exports/aksornsara-database-export/aksornsara-articles.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        content: a.content_html,
        coverImageUrl: a.cover_image_url,
        writerCredit: a.writer_credit,
      },
      create: {
        title: a.title,
        slug: a.slug,
        content: a.content_html,
        excerpt: a.excerpt,
        coverImageUrl: a.cover_image_url,
        writerCredit: a.writer_credit,
        proofreaderCredit: a.proofreader_credit,
        illustratorCredit: a.illustrator_credit,
        status: 'published',
        publishedAt: new Date(a.published_at),
      },
    });
  }
}
main();
\`\`\`

### วิธีที่ 3: หากต้องการดาวน์โหลดรูปภาพทั้งหมดมาเก็บในเครื่อง / อัปขึ้น S3 / GCS
\`\`\`bash
cd exports/aksornsara-database-export
node download-images.js
\`\`\`
รูปภาพจะถูกดาวน์โหลดลงโฟลเดอร์ \`downloaded-images/\` โดยมีชื่อไฟล์กำกับเป็น \`{article_id}_{type}.jpg\` อย่างเป็นระเบียบ
`;
fs.writeFileSync(readmePath, readmeContent, 'utf8');
console.log(`Saved README to ${readmePath}`);

console.log('--- ALL EXPORTS COMPLETED SUCCESSFULLY ---');
