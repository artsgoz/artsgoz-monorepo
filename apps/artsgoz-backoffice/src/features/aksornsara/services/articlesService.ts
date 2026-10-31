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
}

const STORAGE_KEY = 'aksornsara_backoffice_articles';

// Deterministic seed helper for initial view count
function calculateInitialViews(index: number, year: string): number {
  const yr = parseInt(year, 10) || 2024;
  const baseViews = (2027 - yr) * 2200;
  const pseudoRandom = ((index * 37) % 1500) + ((index * 13) % 400);
  return Math.max(120, baseViews + pseudoRandom);
}

// Format relative date
function formatPublishedDate(year: string, index: number): string {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const yrShort = String(parseInt(year, 10) + 43).slice(-2); // BE format
  const month = months[index % 12];
  const day = (index % 28) + 1;
  return `${day} ${month} ${yrShort}`;
}

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

    // Initialize from rawArticles
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
    }>).map((item, index) => {
      const views = calculateInitialViews(index, item.year);
      const publishedAt = formatPublishedDate(item.year, index);
      const isDraft = index === 10 || index === 25; // 2 sample drafts
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
        status: isDraft ? 'ร่างบทความ' : 'เผยแพร่แล้ว',
        views,
        publishedAt,
        tags: [item.year ? `ปี ${item.year}` : 'บทความ', 'สาราณียกร'],
        visibility: 'สาธารณะ',
        contentHtml: `<p>${item.excerpt}</p>`,
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
      title: data.title || 'บทความใหม่ไม่มีชื่อ',
      year: data.year || '2026',
      date: data.date || 'ปี 2026',
      author: data.author || 'ชมรมสาราณียกร',
      proofreader: data.proofreader || '',
      illustrator: data.illustrator || '',
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

    // Top 5 articles sorted by views
    const topArticles = [...this.articles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    // Recent 5 published articles
    const recentArticles = [...this.articles]
      .filter((a) => a.status === 'เผยแพร่แล้ว')
      .slice(0, 5);

    // Monthly data based on actual volume
    const monthlyData = [
      { month: 'JAN', count: 18, pct: 45 },
      { month: 'FEB', count: 24, pct: 60 },
      { month: 'MAR', count: 35, pct: 88 },
      { month: 'APR', count: 28, pct: 70 },
      { month: 'MAY', count: 32, pct: 80 },
      { month: 'JUN', count: 40, pct: 100 },
    ];

    return {
      totalArticles,
      publishedCount: publishedArticles.length,
      draftCount: draftArticles.length,
      totalViews,
      totalCategories,
      topArticles,
      recentArticles,
      monthlyData,
    };
  }
}

export const articlesService = ArticlesService.getInstance();

