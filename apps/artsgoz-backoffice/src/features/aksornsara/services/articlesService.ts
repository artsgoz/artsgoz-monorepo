import rawArticles from '../data/articles.json';

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

const STORAGE_KEY = 'aksornsara_backoffice_articles_v3';

export class ArticlesService {
  private static instance: ArticlesService;
  private articles: BackofficeArticle[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance(): ArticlesService {
    if (!ArticlesService.instance) {
      ArticlesService.instance = new ArticlesService();
    }
    return ArticlesService.instance;
  }

  private load(): void {
    try {
      // Clear legacy storage key if exists to ensure clean real numbers
      localStorage.removeItem('aksornsara_backoffice_articles');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BackofficeArticle[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.articles = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load articles from localStorage, using defaults', e);
    }

    // Initialize from rawArticles (All 169 historical archive articles are published, views start at 0)
    this.articles = (rawArticles as Array<{
      id: string;
      title: string;
      year: string;
      date: string;
      author: string;
      excerpt: string;
      category: string;
      url?: string;
      readTime: string;
      coverImage?: string;
      imageUrl?: string;
    }>).map((item) => {
      return {
        id: item.id,
        title: item.title,
        year: item.year,
        date: item.date || `ปี ${item.year}`,
        author: item.author || 'ชมรมสาราณียกร',
        excerpt: item.excerpt,
        category: item.year ? `ปี ${item.year}` : item.category,
        url: item.url,
        readTime: item.readTime || '5 นาที',
        coverImage: item.coverImage || item.imageUrl,
        imageUrl: item.imageUrl || item.coverImage,
        status: 'เผยแพร่แล้ว',
        views: 0,
        publishedAt: item.date || `ปี ${item.year}`,
        tags: [item.year ? `ปี ${item.year}` : 'บทความ', 'สาราณียกร'],
        visibility: 'สาธารณะ',
        contentHtml: `<p>${item.excerpt}</p>`,
        isNewlyCreated: false,
      };
    });

    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
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
      tags: data.tags || ['ปี 2026', 'สาราณียกร'],
      slug: data.slug || newId,
      visibility: data.visibility || 'สาธารณะ',
      publishedAt,
      updatedAt: now.toISOString(),
      isNewlyCreated: true,
    };

    // Prepend so new article appears at the top of recent articles
    this.articles = [newArticle, ...this.articles];
    this.save();
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
    return this.articles[index];
  }

  public delete(id: string): boolean {
    const prevLen = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== id);
    if (this.articles.length !== prevLen) {
      this.save();
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

    // Top articles sorted by real views (only if views > 0)
    const topArticles = [...this.articles]
      .filter((a) => (a.views || 0) > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    // Recent articles: only newly created/updated articles in the backoffice
    const recentArticles = [...this.articles]
      .filter((a) => a.isNewlyCreated)
      .slice(0, 5);

    // Real yearly distribution across all 169 articles
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

    return {
      totalArticles,
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
      totalViews,
      totalCategories,
      topArticles,
      recentArticles,
      yearlyData,
    };
  }
}

export const articlesService = ArticlesService.getInstance();

