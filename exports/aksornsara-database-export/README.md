# AksornSara Articles & Images Export for Backend Database

ไฟล์ชุดนี้เป็นการ Export บทความทั้งหมดของ **ชมรมอักษรสาราณียกร (AksornSara)** จำนวน **169 บทความ** พร้อมรูปภาพหน้าปกและรูปภาพที่แทรกในเนื้อหาทั้งหมด **331 รูป** สำหรับให้ทีม Backend นำไปใส่ใน Database ได้ทันที

---

## 📁 รายการไฟล์ในโฟลเดอร์นี้

| ชื่อไฟล์ | รูปแบบ | วัตถุประสงค์ / การใช้งาน |
| :--- | :---: | :--- |
| **`aksornsara-articles.json`** | JSON Array | ข้อมูลบทความครบทั้ง 169 รายการ (พร้อม HTML, เนื้อหา, หมวดหมู่, เครดิตผู้เขียน, รูปภาพ, รายการอ้างอิง) สำหรับใช้กับ Prisma, TypeORM, MongoDB, Firebase หรือ Script นำเข้าของ Backend |
| **`aksornsara-articles-seed.sql`** | SQL Script | คำสั่ง SQL Seed สำหรับ **PostgreSQL** ตรงตาม Schema `infra/database/migrations/001_create_aksornsara_cms.sql` สามารถรันนำเข้าฐานข้อมูลได้ทันที |
| **`aksornsara-images.json`** | JSON Array | รายการรูปภาพทั้งหมด (331 รูป: หน้าปก 169 รูป + ในเนื้อหา 162 รูป) พร้อมลิงก์ตรงและ Article ID กำกับ |
| **`aksornsara-images.csv`** | CSV | สรุปรายการรูปภาพทั้งหมดสำหรับเปิดใน Excel / Google Sheets หรือเครื่องมือ Import |
| **`download-images.js`** | Node.js | สคริปต์เสริมสำหรับดาวน์โหลดไฟล์รูปภาพทั้งหมดมาเก็บไว้ในเครื่อง หรือใช้อัปโหลดขึ้น Cloud Storage (S3 / GCS) |

---

## 📊 ข้อมูลสถิติของชุดข้อมูล (Data Statistics)
- **จำนวนบทความทั้งหมด:** 169 บทความ
- **บทความที่มีภาพหน้าปก:** 169 บทความ (100%)
- **รูปภาพที่แทรกในเนื้อหาบทความ:** 162 รูปภาพ
- **รวมรูปภาพทั้งหมด:** 331 รูปภาพ
- **หมวดหมู่ (7 หมวด):** ศิลปะ, วรรณกรรม, ภาษา, วัฒนธรรม, ปรัชญา, วิจารณ์, ทั่วไป
- **แท็ก (14 แท็ก):** ตามระบบ AksornSara CMS

---

## 🛠️ โครงสร้างข้อมูลในแต่ละบทความ (`aksornsara-articles.json`)

```json
{
  "id": 1,
  "article_code": "art-001",
  "title": "“ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง” : เพราะความหวังผลิบานเป็นนิรันดร์ในใจมนุษย์",
  "slug": "art-001",
  "excerpt": "สรุปเนื้อหาบทความ...",
  "content_html": "<p>ย่อหน้าแรก...</p><figure><img src="https://..." /><figcaption>...</figcaption></figure>",
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
```

---

## 🚀 วิธีการนำเข้าฐานข้อมูล (How to Import)

### วิธีที่ 1: รันคำสั่ง SQL เข้า PostgreSQL โดยตรง
```bash
psql -U <username> -d <database_name> -f exports/aksornsara-database-export/aksornsara-articles-seed.sql
```

### วิธีที่ 2: ใช้กับ Prisma ใน Node.js / TypeScript Backend
```typescript
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
```

### วิธีที่ 3: หากต้องการดาวน์โหลดรูปภาพทั้งหมดมาเก็บในเครื่อง / อัปขึ้น S3 / GCS
```bash
cd exports/aksornsara-database-export
node download-images.js
```
รูปภาพจะถูกดาวน์โหลดลงโฟลเดอร์ `downloaded-images/` โดยมีชื่อไฟล์กำกับเป็น `{article_id}_{type}.jpg` อย่างเป็นระเบียบ
