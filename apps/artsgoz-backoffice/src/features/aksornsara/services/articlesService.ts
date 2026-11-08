import { aksornsaraApi, ArticleDto } from './apiClient';

export interface BackofficeArticle {
  id: string;
  backendId?: string;
  title: string;
  year: string;
  date: string;
  author: string;
  proofreader?: string;
  illustrator?: string;
  excerpt: string;
  category: string;
  categories?: string[];
  metaDescription?: string;
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
  private isSyncing = false;
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
    this.articles = [];
  }

  private save(): void {
    try {
      if (typeof window !== 'undefined') {
        if (window.sessionStorage) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
        }
        if (window.localStorage) {
          localStorage.setItem(
            'aksornsara_backoffice_articles_shared',
            JSON.stringify(this.articles),
          );
        }
      }
    } catch (e) {
      console.error('Failed to save articles to storage', e);
    }
  }

  public async syncWithApi(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await aksornsaraApi.getArticles({ limit: 1000 });
      const items = res.data || [];
      if (Array.isArray(items)) {
        this.isApiConnected = true;

        const backendArticles: BackofficeArticle[] = items.map(
          (dto: ArticleDto) => {
            const yr = dto.published_at
              ? String(new Date(dto.published_at).getFullYear())
              : '2026';
            const catName =
              dto.category_name || (dto as any).category || 'ทั่วไป';
            const author =
              dto.author_name || dto.writer_credit || 'ชมรมสาราณียกร';
            let formattedDate = `ปี ${yr}`;
            if (dto.published_at) {
              try {
                const d = new Date(dto.published_at);
                formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`;
              } catch {
                formattedDate = `ปี ${yr}`;
              }
            }

            return {
              id: String(dto.slug || dto.id),
              backendId: String(dto.id),
              title: dto.title,
              year: yr,
              date: formattedDate,
              author,
              proofreader: dto.proofreader_credit || '',
              illustrator: dto.illustrator_credit || '',
              excerpt: dto.excerpt || '',
              category: catName,
              url: (dto as any).legacy_url || '',
              readTime: '5 นาที',
              coverImage: dto.cover_image_url || (dto as any).image_url,
              imageUrl: dto.cover_image_url || (dto as any).image_url,
              status: dto.status === 'published' ? 'เผยแพร่แล้ว' : 'ร่างบทความ',
              views: dto.view_count || 0,
              contentHtml: dto.content || `<p>${dto.excerpt || ''}</p>`,
              tags: Array.isArray(dto.tags)
                ? dto.tags.map((t: any) => (typeof t === 'string' ? t : t.name))
                : [catName, 'สาราณียกร'],
              slug: dto.slug,
              visibility:
                (dto as any).visibility === 'private' ? 'ส่วนตัว' : 'สาธารณะ',
              publishedAt: dto.published_at || formattedDate,
              updatedAt: dto.updated_at,
              isNewlyCreated: false,
            };
          },
        );

        this.articles = backendArticles;

        this.save();
        this.notify();
      }
    } catch {
      this.isApiConnected = false;
    } finally {
      this.isSyncing = false;
    }
  }

  public getIsApiConnected(): boolean {
    return this.isApiConnected;
  }

  public getAll(): BackofficeArticle[] {
    return [...this.articles];
  }

  public getById(id: string): BackofficeArticle | undefined {
    return this.articles.find(
      (a) => a.id === id || a.backendId === id || a.slug === id,
    );
  }

  public isSlugTaken(slug: string, excludeId?: string): boolean {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return false;
    return this.articles.some((a) => {
      if (excludeId && (a.id === excludeId || a.backendId === excludeId))
        return false;
      return a.slug?.trim().toLowerCase() === normalized;
    });
  }

  public async create(
    data: Partial<BackofficeArticle>,
  ): Promise<BackofficeArticle> {
    const nextNumber = this.articles.length + 1;
    const newId = `art-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date();
    const months = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ];
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
      excerpt:
        data.excerpt ||
        (data.contentHtml
          ? data.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
          : ''),
      category: data.category || data.categories?.[0] || 'ทั่วไป',
      categories:
        data.categories && data.categories.length > 0
          ? data.categories
          : [data.category || 'ทั่วไป'],
      metaDescription: data.metaDescription || '',
      url: data.url || '',
      readTime: data.readTime || '5 นาที',
      coverImage:
        data.coverImage ||
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
      imageUrl:
        data.imageUrl ||
        data.coverImage ||
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000',
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

    const response = await aksornsaraApi.createArticle({
      title: newArticle.title,
      slug: data.slug || undefined,
      content: newArticle.contentHtml || '<p></p>',
      excerpt: newArticle.excerpt,
      cover_image_url: newArticle.coverImage,
      status: newArticle.status === 'เผยแพร่แล้ว' ? 'published' : 'draft',
      author_name: newArticle.author,
      writer_credit: newArticle.author,
      proofreader_credit: newArticle.proofreader,
      illustrator_credit: newArticle.illustrator,
      category: newArticle.category,
      categories: data.categories,
      tags: newArticle.tags,
      published_at: data.publishedAt,
      meta_description: data.metaDescription,
      visibility: data.visibility === 'ส่วนตัว' ? 'private' : 'public',
    } as any);
    const item = response.data;
    newArticle.id = String(item.id);
    newArticle.backendId = String(item.id);
    newArticle.slug = item.slug;
    this.articles = [newArticle, ...this.articles];
    this.save();
    this.notify();

    return newArticle;
  }

  public async update(
    id: string,
    updates: Partial<BackofficeArticle>,
  ): Promise<BackofficeArticle> {
    const index = this.articles.findIndex(
      (a) => a.id === id || a.backendId === id || a.slug === id,
    );
    if (index === -1) throw new Error('Article not found.');

    const previous = this.articles[index];
    await aksornsaraApi.updateArticle(previous.backendId || previous.id, {
      title: updates.title,
      slug: updates.slug,
      content: updates.contentHtml,
      excerpt: updates.excerpt,
      cover_image_url: updates.coverImage || updates.imageUrl,
      author_name: updates.author,
      writer_credit: updates.author,
      proofreader_credit: updates.proofreader,
      illustrator_credit: updates.illustrator,
      category: updates.category,
      categories: updates.categories,
      tags: updates.tags,
      meta_description: updates.metaDescription,
      published_at: updates.publishedAt,
      status: updates.status
        ? updates.status === 'ร่างบทความ'
          ? 'draft'
          : 'published'
        : undefined,
    } as any);
    this.articles[index] = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    this.notify();

    return this.articles[index];
  }

  public async delete(id: string): Promise<boolean> {
    const target = this.articles.find(
      (a) => a.id === id || a.backendId === id || a.slug === id,
    );
    const targetId = target ? target.backendId || target.id : id;

    if (!target) return false;
    await aksornsaraApi.deleteArticle(targetId);
    this.articles = this.articles.filter((article) => article !== target);
    this.save();
    this.notify();
    return true;
  }

  public getMetrics() {
    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter(
      (a) => a.status === 'เผยแพร่แล้ว',
    );
    const draftArticles = this.articles.filter(
      (a) => a.status === 'ร่างบทความ',
    );
    const totalViews = this.articles.reduce(
      (sum, a) => sum + (a.views || 0),
      0,
    );

    const categoriesSet = new Set(
      this.articles.map((a) => a.category).filter(Boolean),
    );
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
          const yr =
            a.year ||
            (a.publishedAt
              ? String(new Date(a.publishedAt).getFullYear())
              : '2026');
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
