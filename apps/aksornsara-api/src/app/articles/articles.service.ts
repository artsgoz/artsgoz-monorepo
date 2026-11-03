import { Injectable, NotFoundException } from '@nestjs/common';
import rawArticles from '../data/articles.json';

export interface ArticleRecord {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  status: 'draft' | 'published' | 'archived';
  category_id?: number;
  category_name?: string;
  author_name: string;
  writer_credit?: string;
  proofreader_credit?: string;
  illustrator_credit?: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags?: { id: number; name: string; slug: string }[];
}

export interface ActivityLog {
  id: number;
  user_name: string;
  action: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'UNPUBLISH' | 'DELETE';
  entity_type: 'ARTICLE' | 'CATEGORY' | 'COMMENT';
  entity_id: number | string;
  entity_title: string;
  created_at: string;
}

export interface CommentRecord {
  id: number;
  article_id: number | string;
  article_slug: string;
  article_title: string;
  author_name: string;
  author_email?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  created_at: string;
}

@Injectable()
export class ArticlesService {
  private articles: ArticleRecord[] = [];
  private activityLogs: ActivityLog[] = [];
  private comments: CommentRecord[] = [];
  private categories = [
    { id: 1, name: 'ศิลปะ', slug: 'art', article_count: 29 },
    { id: 2, name: 'วรรณกรรม', slug: 'literature', article_count: 37 },
    { id: 3, name: 'ภาษา', slug: 'language', article_count: 20 },
    { id: 4, name: 'วัฒนธรรม', slug: 'culture', article_count: 18 },
    { id: 5, name: 'ปรัชญา', slug: 'philosophy', article_count: 24 },
    { id: 6, name: 'วิจารณ์', slug: 'criticism', article_count: 32 },
    { id: 7, name: 'ทั่วไป', slug: 'general', article_count: 9 },
  ];
  private tags = [
    { id: 1, name: 'ศิลปะ', slug: 'art', article_count: 29 },
    { id: 2, name: 'วรรณกรรม', slug: 'literature', article_count: 37 },
    { id: 3, name: 'ภาษา', slug: 'language', article_count: 20 },
    { id: 4, name: 'วัฒนธรรม', slug: 'culture', article_count: 18 },
    { id: 5, name: 'ปรัชญา', slug: 'philosophy', article_count: 24 },
    { id: 6, name: 'วิจารณ์', slug: 'criticism', article_count: 32 },
    { id: 7, name: 'ทั่วไป', slug: 'general', article_count: 9 },
    { id: 8, name: 'การอ่าน', slug: 'reading', article_count: 25 },
    { id: 9, name: 'ดนตรี', slug: 'music', article_count: 16 },
    { id: 10, name: 'จิตวิทยา', slug: 'psychology', article_count: 19 },
    { id: 11, name: 'ภาพยนตร์', slug: 'film', article_count: 21 },
    { id: 12, name: 'ประวัติศาสตร์', slug: 'history', article_count: 15 },
    { id: 13, name: 'คำศัพท์', slug: 'vocabulary', article_count: 12 },
    { id: 14, name: 'สาราณียกร', slug: 'saraniyakorn', article_count: 169 },
  ];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed from 169 historical articles
    let counter = 100;
    this.articles = (rawArticles as Array<any>).map((item, idx) => {
      counter++;
      const idNum = idx + 1;
      const cleanSlug = item.title
        ? item.title
            .toLowerCase()
            .replace(/[“”—’']/g, '')
            .replace(/[\s\t\n]+/g, '-')
            .replace(/[^\w\u0E00-\u0E7F-]+/g, '')
            .slice(0, 100)
        : `article-${idNum}`;

      return {
        id: item.id || idNum,
        title: item.title || `บทความที่ ${idNum}`,
        slug: cleanSlug,
        content: item.excerpt ? `<p>${item.excerpt}</p>` : '<p>เนื้อหาบทความฉบับเต็ม</p>',
        excerpt: item.excerpt || 'บทความจากชมรมสาราณียกร คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
        cover_image_url: item.coverImage || item.imageUrl || 'https://cdn.aksornsara.com/uploads/default.webp',
        status: 'published',
        category_id: (() => {
          const m = this.categories.find(c => c.name === item.category);
          return m ? m.id : ((idx % this.categories.length) + 1);
        })(),
        category_name: item.category || this.categories[idx % this.categories.length].name,
        author_name: item.author || 'ชมรมสาราณียกร',
        writer_credit: item.author || 'ชมรมสาราณียกร',
        proofreader_credit: 'กองบรรณาธิการสาราณียกร',
        illustrator_credit: 'ฝ่ายศิลปกรรมสาราณียกร',
        view_count: 0,
        published_at: item.date || '2025-02-14T10:00:00Z',
        created_at: '2025-01-10T08:30:00Z',
        updated_at: '2025-02-14T10:00:00Z',
        tags: (item.tags || [item.category || 'ทั่วไป', 'สาราณียกร']).map((tName: string, tIdx: number) => ({
          id: tIdx + 1,
          name: tName,
          slug: tName.toLowerCase().replace(/\s+/g, '-'),
        })),
      };
    });

    // Seed sample comments
    this.comments = [
      {
        id: 1,
        article_id: 1,
        article_slug: this.articles[0]?.slug || 'art-001',
        article_title: this.articles[0]?.title || 'ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง',
        author_name: 'นิสิตจุฬาฯ',
        author_email: 'student@student.chula.ac.th',
        content: 'บทความเขียนได้ลึกซึ้งมากครับ ให้กำลังใจในช่วงเวลาที่หมดไฟได้ดีมาก',
        status: 'approved',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 2,
        article_id: 2,
        article_slug: this.articles[1]?.slug || 'art-002',
        article_title: this.articles[1]?.title || 'บัตรแมงมุม : วิบากกรรมผัดวันประกันพรุ่งของกทม.',
        author_name: 'นักอ่านทั่วไป',
        author_email: 'reader@example.com',
        content: 'รออ่านภาคต่อไปอยู่นะครับ อยากให้วิเคราะห์การเดินทางสาธารณะเพิ่มเติม',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Seed sample activity logs
    this.activityLogs = [
      {
        id: 1,
        user_name: 'สมชาย สารบรรณ',
        action: 'PUBLISH',
        entity_type: 'ARTICLE',
        entity_id: 1,
        entity_title: this.articles[0]?.title || 'ที่ใดมีชีวิต ที่นั่นย่อมมีหวัง',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 2,
        user_name: 'กานดา พินิจสาร',
        action: 'UPDATE',
        entity_type: 'ARTICLE',
        entity_id: 2,
        entity_title: this.articles[1]?.title || 'บัตรแมงมุม',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ];
  }

  // ─── ADMIN ARTICLES ──────────────────────────────────────────

  getAdminArticles(params: {
    page?: number;
    limit?: number;
    status?: string;
    category_id?: number | string;
    search?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(500, Number(params.limit) || 20));
    const search = (params.search || '').trim().toLowerCase();
    const status = params.status;
    const catId = params.category_id ? Number(params.category_id) : undefined;
    const sortBy = params.sort_by || 'created_at';
    const order = params.order === 'asc' ? 'asc' : 'desc';

    let filtered = this.articles.filter((a) => {
      if (status && a.status !== status) return false;
      if (catId && a.category_id !== catId) return false;
      if (search) {
        const matchesTitle = a.title.toLowerCase().includes(search);
        const matchesAuthor = a.author_name.toLowerCase().includes(search);
        const matchesExcerpt = (a.excerpt || '').toLowerCase().includes(search);
        if (!matchesTitle && !matchesAuthor && !matchesExcerpt) return false;
      }
      return true;
    });

    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'view_count') {
        comparison = (a.view_count || 0) - (b.view_count || 0);
      } else if (sortBy === 'published_at') {
        comparison = String(a.published_at || '').localeCompare(String(b.published_at || ''));
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title, 'th');
      } else {
        comparison = String(a.created_at).localeCompare(String(b.created_at));
      }
      return order === 'asc' ? comparison : -comparison;
    });

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total_records: totalRecords,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  }

  getArticleById(id: number | string) {
    const article = this.articles.find((a) => String(a.id) === String(id));
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return {
      success: true,
      data: article,
    };
  }

  createArticle(body: any) {
    const newId = this.articles.length > 0 ? Math.max(...this.articles.map((a) => Number(a.id) || 0)) + 1 : 1;
    const now = new Date().toISOString();
    const slug = body.slug || `article-${newId}-${Date.now()}`;
    const status = body.status === 'published' ? 'published' : 'draft';

    const newArticle: ArticleRecord = {
      id: newId,
      title: body.title || 'ไม่มีชื่อบทความ',
      slug,
      content: body.content || '',
      excerpt: body.excerpt || '',
      cover_image_url: body.cover_image_url || 'https://cdn.aksornsara.com/uploads/default.webp',
      status,
      category_id: body.category_ids?.[0] || 1,
      category_name: this.categories.find((c) => c.id === body.category_ids?.[0])?.name || 'ทั่วไป',
      author_name: body.writer_credit || 'กองบรรณาธิการสาราณียกร',
      writer_credit: body.writer_credit,
      proofreader_credit: body.proofreader_credit,
      illustrator_credit: body.illustrator_credit,
      view_count: 0,
      published_at: status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    };

    this.articles.unshift(newArticle);

    this.logActivity({
      user_name: 'ผู้ดูแลระบบ',
      action: status === 'published' ? 'PUBLISH' : 'CREATE',
      entity_type: 'ARTICLE',
      entity_id: newId,
      entity_title: newArticle.title,
    });

    return {
      success: true,
      data: {
        id: newId,
        title: newArticle.title,
        slug: newArticle.slug,
        status: newArticle.status,
        created_at: newArticle.created_at,
      },
      message: status === 'published' ? 'Article published successfully' : 'Article draft created successfully',
    };
  }

  updateArticle(id: number | string, body: any) {
    const article = this.articles.find((a) => String(a.id) === String(id));
    if (!article) throw new NotFoundException(`Article with ID ${id} not found`);

    if (body.title !== undefined) article.title = body.title;
    if (body.slug !== undefined) article.slug = body.slug;
    if (body.content !== undefined) article.content = body.content;
    if (body.excerpt !== undefined) article.excerpt = body.excerpt;
    if (body.cover_image_url !== undefined) article.cover_image_url = body.cover_image_url;
    if (body.writer_credit !== undefined) {
      article.writer_credit = body.writer_credit;
      article.author_name = body.writer_credit;
    }
    if (body.proofreader_credit !== undefined) article.proofreader_credit = body.proofreader_credit;
    if (body.illustrator_credit !== undefined) article.illustrator_credit = body.illustrator_credit;
    if (body.category_ids?.[0]) {
      article.category_id = body.category_ids[0];
      article.category_name = this.categories.find((c) => c.id === body.category_ids[0])?.name || article.category_name;
    }
    article.updated_at = new Date().toISOString();

    this.logActivity({
      user_name: 'ผู้ดูแลระบบ',
      action: 'UPDATE',
      entity_type: 'ARTICLE',
      entity_id: article.id,
      entity_title: article.title,
    });

    return {
      success: true,
      data: {
        id: article.id,
        updated_at: article.updated_at,
      },
      message: 'Article updated successfully',
    };
  }

  updateArticleStatus(id: number | string, status: 'published' | 'draft' | 'archived') {
    const article = this.articles.find((a) => String(a.id) === String(id));
    if (!article) throw new NotFoundException(`Article with ID ${id} not found`);

    article.status = status;
    if (status === 'published' && !article.published_at) {
      article.published_at = new Date().toISOString();
    }
    article.updated_at = new Date().toISOString();

    this.logActivity({
      user_name: 'ผู้ดูแลระบบ',
      action: status === 'published' ? 'PUBLISH' : status === 'archived' ? 'UNPUBLISH' : 'UPDATE',
      entity_type: 'ARTICLE',
      entity_id: article.id,
      entity_title: article.title,
    });

    return {
      success: true,
      data: {
        id: article.id,
        status: article.status,
        published_at: article.published_at,
      },
      message: `Article status updated to ${status}`,
    };
  }

  deleteArticle(id: number | string) {
    const index = this.articles.findIndex((a) => String(a.id) === String(id));
    if (index === -1) throw new NotFoundException(`Article with ID ${id} not found`);

    const deleted = this.articles.splice(index, 1)[0];
    this.logActivity({
      user_name: 'ผู้ดูแลระบบ',
      action: 'DELETE',
      entity_type: 'ARTICLE',
      entity_id: deleted.id,
      entity_title: deleted.title,
    });

    return {
      success: true,
      message: 'Article deleted successfully',
    };
  }

  getArticleLogs(id: number | string) {
    const logs = this.activityLogs.filter((l) => String(l.entity_id) === String(id));
    return {
      success: true,
      data: logs,
    };
  }

  // ─── PUBLIC ARTICLES ──────────────────────────────────────────

  getPublicArticles(params: {
    page?: number;
    limit?: number;
    category_slug?: string;
    tag_slug?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(params.limit) || 12));
    const search = (params.search || '').trim().toLowerCase();
    const catSlug = params.category_slug;

    let filtered = this.articles.filter((a) => a.status === 'published');

    if (catSlug) {
      const cat = this.categories.find((c) => c.slug === catSlug);
      if (cat) {
        filtered = filtered.filter((a) => a.category_id === cat.id);
      }
    }

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.author_name.toLowerCase().includes(search) ||
          (a.excerpt || '').toLowerCase().includes(search),
      );
    }

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total_records: totalRecords,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  }

  getPublicArticleBySlug(slug: string) {
    const article = this.articles.find(
      (a) =>
        a.slug === slug ||
        String(a.id) === slug ||
        String(a.id).toLowerCase() === slug.toLowerCase() ||
        (slug.startsWith('art-') && String(a.id) === String(parseInt(slug.replace('art-', ''), 10))) ||
        (String(a.id).startsWith('art-') && slug === String(parseInt(String(a.id).replace('art-', ''), 10)))
    );
    if (!article || article.status !== 'published') {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    // Auto-increment view_count
    article.view_count = (article.view_count || 0) + 1;

    return {
      success: true,
      data: article,
    };
  }

  incrementViewCount(slugOrId: string) {
    const article = this.articles.find(
      (a) =>
        a.slug === slugOrId ||
        String(a.id) === slugOrId ||
        String(a.id).toLowerCase() === slugOrId.toLowerCase() ||
        (slugOrId.startsWith('art-') && String(a.id) === String(parseInt(slugOrId.replace('art-', ''), 10))) ||
        (String(a.id).startsWith('art-') && slugOrId === String(parseInt(String(a.id).replace('art-', ''), 10)))
    );
    if (!article) {
      throw new NotFoundException(`Article with id/slug ${slugOrId} not found`);
    }

    article.view_count = (article.view_count || 0) + 1;

    return {
      success: true,
      data: {
        id: article.id,
        title: article.title,
        view_count: article.view_count,
      },
    };
  }

  // ─── DASHBOARD & INSIGHTS ────────────────────────────────────

  getDashboardStats() {
    const totalViews = this.articles.reduce((sum, a) => sum + (a.view_count || 0), 0);
    const published = this.articles.filter((a) => a.status === 'published').length;
    const drafts = this.articles.filter((a) => a.status === 'draft').length;
    const pendingComments = this.comments.filter((c) => c.status === 'pending').length;

    return {
      success: true,
      data: {
        total_views: totalViews,
        published_articles: published,
        draft_articles: drafts,
        pending_comments: pendingComments,
        total_categories: this.categories.length,
      },
    };
  }

  getMonthlyTrends(year = 2026) {
    return {
      success: true,
      data: [
        { month: `${year}-01`, label: `ม.ค. ${year}`, views: 14200 },
        { month: `${year}-02`, label: `ก.พ. ${year}`, views: 16850 },
        { month: `${year}-03`, label: `มี.ค. ${year}`, views: 21400 },
        { month: `${year}-04`, label: `เม.ย. ${year}`, views: 19500 },
        { month: `${year}-05`, label: `พ.ค. ${year}`, views: 22100 },
        { month: `${year}-06`, label: `มิ.ย. ${year}`, views: 25400 },
      ],
    };
  }

  getTopArticles(limit = 5) {
    const sorted = [...this.articles]
      .filter((a) => a.status === 'published')
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, Math.min(20, limit));

    return {
      success: true,
      data: sorted.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        view_count: a.view_count,
        published_at: a.published_at,
      })),
    };
  }

  getTopCategories() {
    return {
      success: true,
      data: this.categories.slice(0, 4).map((c) => ({
        category_id: c.id,
        name: c.name,
        article_count: c.article_count,
        total_views: c.article_count * 1200,
      })),
    };
  }

  getRecentActivities() {
    return {
      success: true,
      data: this.activityLogs.slice(0, 10),
    };
  }

  // ─── CATEGORIES & TAGS ────────────────────────────────────────

  getCategories() {
    return {
      success: true,
      data: this.categories,
    };
  }

  createCategory(body: { name: string; slug: string; description?: string }) {
    const id = this.categories.length + 1;
    const newCat = {
      id,
      name: body.name,
      slug: body.slug,
      article_count: 0,
      description: body.description,
    };
    this.categories.push(newCat);
    return {
      success: true,
      data: newCat,
      message: 'Category created successfully',
    };
  }

  updateCategory(id: number | string, body: any) {
    const cat = this.categories.find((c) => String(c.id) === String(id));
    if (!cat) throw new NotFoundException('Category not found');
    if (body.name) cat.name = body.name;
    if (body.slug) cat.slug = body.slug;
    return { success: true, message: 'Category updated successfully' };
  }

  deleteCategory(id: number | string) {
    const idx = this.categories.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) this.categories.splice(idx, 1);
    return { success: true, message: 'Category deleted successfully' };
  }

  getTags(search?: string) {
    let list = this.tags;
    if (search) {
      list = list.filter((t) => t.name.includes(search) || t.slug.includes(search));
    }
    return {
      success: true,
      data: list,
    };
  }

  createTag(body: { name: string; slug: string }) {
    const id = this.tags.length + 1;
    const newTag = { id, name: body.name, slug: body.slug, article_count: 0 };
    this.tags.push(newTag);
    return { success: true, data: newTag, message: 'Tag created successfully' };
  }

  // ─── COMMENTS ────────────────────────────────────────────────

  getComments(status?: string, page = 1, limit = 20) {
    let list = this.comments;
    if (status) {
      list = list.filter((c) => c.status === status);
    }
    return {
      success: true,
      data: list,
      pagination: {
        page,
        limit,
        total_records: list.length,
        total_pages: Math.ceil(list.length / limit) || 1,
      },
    };
  }

  updateCommentStatus(id: number | string, status: 'approved' | 'rejected' | 'spam') {
    const comment = this.comments.find((c) => String(c.id) === String(id));
    if (!comment) throw new NotFoundException('Comment not found');
    comment.status = status;
    return {
      success: true,
      message: `Comment status updated to ${status}`,
    };
  }

  deleteComment(id: number | string) {
    const idx = this.comments.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) this.comments.splice(idx, 1);
    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }

  getArticleComments(slug: string) {
    const approved = this.comments.filter((c) => c.article_slug === slug && c.status === 'approved');
    return {
      success: true,
      data: approved.map((c) => ({
        id: c.id,
        author_name: c.author_name,
        content: c.content,
        created_at: c.created_at,
      })),
    };
  }

  addArticleComment(slug: string, body: { author_name: string; author_email?: string; content: string }) {
    const article = this.articles.find((a) => a.slug === slug || String(a.id) === slug);
    const newId = this.comments.length + 1;
    const newComment: CommentRecord = {
      id: newId,
      article_id: article ? article.id : 0,
      article_slug: slug,
      article_title: article ? article.title : 'บทความ',
      author_name: body.author_name,
      author_email: body.author_email,
      content: body.content,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.comments.push(newComment);
    return {
      success: true,
      data: { id: newId, status: 'pending' },
      message: 'ความคิดเห็นของคุณถูกส่งเรียบร้อยแล้ว และจะแสดงผลเมื่อผ่านการตรวจสอบจากทีมงาน',
    };
  }

  // Helper
  private logActivity(entry: Omit<ActivityLog, 'id' | 'created_at'>) {
    this.activityLogs.unshift({
      id: this.activityLogs.length + 1,
      ...entry,
      created_at: new Date().toISOString(),
    });
  }
}

