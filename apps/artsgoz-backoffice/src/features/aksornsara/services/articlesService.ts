import rawArticles from '../data/articles.json';
import { aksornsaraApi, ArticleDto } from './apiClient';

export interface BackofficeArticle {
  id: string;
  title: string;
  year: string;
  date: string;
  author: string;
  proofreader?: string;
  illustrator?: string;
  excerpt: string;
  category: string;
  url?: string;
  readTime: string;
  coverImage?: string;
  imageUrl?: string;
  status: 'เผยแพร่แล้ว' | 'ร่างบทความ' | 'รออนุมัติ';
  views: number;
  contentHtml?: string;
  tags?: string[];
  slug?: string;
  visibility?: 'สาธารณะ' | 'ส่วนตัว';
  publishedAt?: string;
  updatedAt?: string;
  isNewlyCreated?: boolean;
}

const STORAGE_KEY = 'aksornsara_backoffice_session_articles_v5';

export class ArticlesService {
  private static instance: ArticlesService;
  private articles: BackofficeArticle[] = [];
  private isApiConnected = false;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.load();
    if (typeof window !== 'undefined') {
      this.syncWithApi().catch(() => {});
      window.addEventListener('focus', () => {
        this.syncWithApi().catch(() => {});
      });
      setInterval(() => {
        this.syncWithApi().catch(() => {});
      }, 8000);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('ArticlesService listener error:', err);
      }
    }
  }

  public static getInstance(): ArticlesService {
    if (!ArticlesService.instance) {
      ArticlesService.instance = new ArticlesService();
    }
    return ArticlesService.instance;
  }

  private load(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aksornsara_backoffice_articles');
        localStorage.removeItem('aksornsara_backoffice_articles_v3');
        sessionStorage.removeItem('aksornsara_backoffice_session_articles');
        sessionStorage.removeItem('aksornsara_backoffice_session_articles_v3');
        sessionStorage.removeItem('aksornsara_backoffice_session_articles_v4');
      }

      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as BackofficeArticle[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.articles = parsed;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load articles from sessionStorage, using defaults', e);
    }

    // Initialize from rawArticles with strict initial view count = 0
    this.articles = (rawArticles as Array<{
      id: string;
      title: string;
      year: string;
      date: string;
      author: string;
      excerpt: string;
      category: string;
      tags?: string[];
      url?: string;
      readTime: string;
      coverImage?: string;
      imageUrl?: string;
      views?: number;
    }>).map((item) => {
      return {
        id: item.id,
        title: item.title,
        year: item.year,
        date: item.date || `ปี ${item.year}`,
        author: item.author || 'ชมรมสาราณียกร',
        excerpt: item.excerpt,
        category: item.category || 'ทั่วไป',
        url: item.url,
        readTime: item.readTime || '5 นาที',
        coverImage: item.coverImage || item.imageUrl,
        imageUrl: item.imageUrl || item.coverImage,
        status: 'เผยแพร่แล้ว',
        views: typeof item.views === 'number' ? item.views : 0,
        publishedAt: item.date || `ปี ${item.year}`,
        tags: item.tags || [item.category || 'ทั่วไป', 'สาราณียกร'],
        visibility: 'สาธารณะ',
        contentHtml: `<p>${item.excerpt}</p>`,
        isNewlyCreated: false,
      };
    });

    this.save();
  }

  private save(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
      }
    } catch (e) {
      console.error('Failed to save articles to sessionStorage', e);
    }
  }

  public async syncWithApi(): Promise<void> {
    try {
      const res = await aksornsaraApi.getArticles({ limit: 200 });
      if (res.success && res.data && res.data.length > 0) {
        this.isApiConnected = true;
        // Map DTOs to BackofficeArticle
        const apiArticles: BackofficeArticle[] = res.data.map((dto: ArticleDto) => ({
          id: String(dto.id),
          title: dto.title,
          year: dto.published_at ? String(new Date(dto.published_at).getFullYear()) : '2026',
          date: dto.published_at || 'ปี 2026',
          author: dto.author_name || dto.writer_credit || 'ชมรมสาราณียกร',
          proofreader: dto.proofreader_credit,
          illustrator: dto.illustrator_credit,
          excerpt: dto.excerpt,
          category: dto.category_name || 'ทั่วไป',
          url: '',
          readTime: '5 นาที',
          coverImage: dto.cover_image_url,
          imageUrl: dto.cover_image_url,
          status: dto.status === 'published' ? 'เผยแพร่แล้ว' : 'ร่างบทความ',
          views: dto.view_count || 0,
          contentHtml: dto.content,
          tags: Array.isArray(dto.tags)
            ? dto.tags.map((t: any) => (typeof t === 'string' ? t : t.name))
            : [dto.category_name || 'ทั่วไป', 'สาราณียกร'],
          slug: dto.slug,
          visibility: 'สาธารณะ',
          publishedAt: dto.published_at || undefined,
          updatedAt: dto.updated_at,
          isNewlyCreated: false,
        }));

        this.articles = apiArticles;
        this.save();
      }
    } catch {
      // Backend not yet reachable, keep using local session
      this.isApiConnected = false;
    }
  }

  public getIsApiConnected(): boolean {
    return this.isApiConnected;
  }

  public getAll(): BackofficeArticle[] {
    return [...this.articles];
  }

  public getById(id: string): BackofficeArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public create(data: Partial<BackofficeArticle>): BackofficeArticle {
    const nextNumber = this.articles.length + 1;
    const newId = `art-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const yrShort = String(now.getFullYear() + 543).slice(-2);
    const publishedAt = `${now.getDate()} ${months[now.getMonth()]} ${yrShort}`;

    const newArticle: BackofficeArticle = {
      id: newId,
      title: data.title?.trim() || 'บทความใหม่ไม่มีชื่อ',
      year: data.year || '2026',
      date: data.date || 'ปี 2026',
      author: data.author?.trim() || 'ชมรมสาราณียกร',
      proofreader: data.proofreader?.trim() || '',
      illustrator: data.illustrator?.trim() || '',
      excerpt: data.excerpt || (data.contentHtml ? data.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''),
      category: data.category || 'ปี 2026',
      url: data.url || '',
      readTime: data.readTime || '5 นาที',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
      imageUrl: data.imageUrl || data.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
      status: data.status || 'เผยแพร่แล้ว',
      views: data.views ?? 0,
      contentHtml: data.contentHtml || '',
      tags: data.tags || [data.category || 'ทั่วไป', 'สาราณียกร'],
      slug: data.slug || newId,
      visibility: data.visibility || 'สาธารณะ',
      publishedAt,
      updatedAt: now.toISOString(),
      isNewlyCreated: true,
    };

    // Prepend locally
    this.articles = [newArticle, ...this.articles];
    this.save();

    // Background push to API if connected
    aksornsaraApi.createArticle({
      title: newArticle.title,
      slug: newArticle.slug,
      content: newArticle.contentHtml,
      excerpt: newArticle.excerpt,
      cover_image_url: newArticle.coverImage,
      status: newArticle.status === 'เผยแพร่แล้ว' ? 'published' : 'draft',
      writer_credit: newArticle.author,
      proofreader_credit: newArticle.proofreader,
      illustrator_credit: newArticle.illustrator,
    }).catch(() => {
      // Local fallback handled
    });

    return newArticle;
  }

  public update(id: string, updates: Partial<BackofficeArticle>): BackofficeArticle | undefined {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();

    // Background update to API
    aksornsaraApi.updateArticle(id, {
      title: updates.title,
      content: updates.contentHtml,
      excerpt: updates.excerpt,
      cover_image_url: updates.coverImage,
      writer_credit: updates.author,
      proofreader_credit: updates.proofreader,
      illustrator_credit: updates.illustrator,
    }).catch(() => {
      // Local fallback handled
    });

    return this.articles[index];
  }

  public delete(id: string): boolean {
    const prevLen = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== id);
    if (this.articles.length !== prevLen) {
      this.save();
      aksornsaraApi.deleteArticle(id).catch(() => {});
      return true;
    }
    return false;
  }

  public getMetrics() {
    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter((a) => a.status === 'เผยแพร่แล้ว');
    const draftArticles = this.articles.filter((a) => a.status === 'ร่างบทความ');
    const totalViews = this.articles.reduce((sum, a) => sum + (a.views || 0), 0);

    const categoriesSet = new Set(this.articles.map((a) => a.category).filter(Boolean));
    const totalCategories = categoriesSet.size;

    const topArticles = [...this.articles]
      .filter((a) => (a.views || 0) > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    const recentArticles = [...this.articles].slice(0, 5);

    const yearCounts: Record<string, number> = {};
    for (const a of this.articles) {
      const yr = a.year || '2026';
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    }
    const sortedYears = Object.keys(yearCounts).sort();
    const maxCount = Math.max(...Object.values(yearCounts), 1);
    const yearlyData = sortedYears.map((yr) => ({
      year: `ปี ${yr}`,
      count: yearCounts[yr] || 0,
      pct: Math.round(((yearCounts[yr] || 0) / maxCount) * 100),
    }));

    // Real Category breakdown
    const categoryCounts: Record<string, { count: number; views: number }> = {};
    for (const a of this.articles) {
      const cat = a.category || 'ทั่วไป';
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, views: 0 };
      }
      categoryCounts[cat].count += 1;
      categoryCounts[cat].views += a.views || 0;
    }

    const categoryData = Object.entries(categoryCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        views: data.views,
        pct: Math.round((data.count / (totalArticles || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalArticles,
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
      totalViews,
      totalCategories,
      topArticles,
      recentArticles,
      yearlyData,
      categoryData,
    };
  }

  public getCategoryStats() {
    return this.getMetrics().categoryData;
  }

  public getMonthlyViewsData(targetYear: number | string = 2026) {
    const thaiMonths = [
      { short: 'ม.ค.', full: 'มกราคม', monthNum: 1 },
      { short: 'ก.พ.', full: 'กุมภาพันธ์', monthNum: 2 },
      { short: 'มี.ค.', full: 'มีนาคม', monthNum: 3 },
      { short: 'เม.ย.', full: 'เมษายน', monthNum: 4 },
      { short: 'พ.ค.', full: 'พฤษภาคม', monthNum: 5 },
      { short: 'มิ.ย.', full: 'มิถุนายน', monthNum: 6 },
      { short: 'ก.ค.', full: 'กรกฎาคม', monthNum: 7 },
      { short: 'ส.ค.', full: 'สิงหาคม', monthNum: 8 },
      { short: 'ก.ย.', full: 'กันยายน', monthNum: 9 },
      { short: 'ต.ค.', full: 'ตุลาคม', monthNum: 10 },
      { short: 'พ.ย.', full: 'พฤศจิกายน', monthNum: 11 },
      { short: 'ธ.ค.', full: 'ธันวาคม', monthNum: 12 },
    ];

    return thaiMonths.map((m) => {
      const matched = this.articles.filter((a) => {
        // Year filter
        if (targetYear !== 'all') {
          const yr = a.year || (a.publishedAt ? String(new Date(a.publishedAt).getFullYear()) : '2026');
          if (String(yr) !== String(targetYear)) return false;
        }

        // Match month
        const d = a.publishedAt || a.date || '';
        if (d.includes(m.short) || d.includes(m.full)) return true;

        // ISO pattern (e.g. -01- or 2026-01)
        const prefix = `-${String(m.monthNum).padStart(2, '0')}-`;
        const prefix2 = `-${String(m.monthNum).padStart(2, '0')}`;
        if (d.includes(prefix) || d.includes(prefix2)) return true;

        // If generic date e.g. "ปี 2026", distribute into issues/months
        const idNum = parseInt(a.id.replace(/\D/g, '') || '0', 10);
        return (idNum % 12) + 1 === m.monthNum;
      });

      const views = matched.reduce((sum, a) => sum + (a.views || 0), 0);
      const articleCount = matched.length;

      return {
        month: m.short,
        monthFull: `${m.full} ${targetYear === 'all' ? '(รวมทุกปี)' : `ปี ${targetYear}`}`,
        views,
        articleCount,
      };
    });
  }
}

export const articlesService = ArticlesService.getInstance();
