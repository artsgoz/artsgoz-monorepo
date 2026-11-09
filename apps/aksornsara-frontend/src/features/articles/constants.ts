import type { ArticleSummary, ArticleDetail } from './types.js';
import ArticleBannerMock from '../../assets/ArticleBannerMock.jpg';
import articlesSummaryData from './data/articles-summary.json';

// Year helper utilities for Buddhist Era (BE 2569..2564) and Christian Era (CE 2026..2021)
export const toBuddhistYear = (yearStr?: string | number): string => {
  if (!yearStr) return '';
  const str = String(yearStr).trim();
  let candidate = str;
  if (str.includes('/')) {
    const parts = str.split('/');
    candidate = parts[parts.length - 1];
  }
  const match = candidate.match(/\d+/);
  if (!match) return '';
  const num = parseInt(match[0], 10);
  if (isNaN(num)) return '';
  if (num >= 2500) return String(num);
  if (num >= 2000 && num < 2100) return String(num + 543);
  if (num < 100) {
    return num > 40 ? String(2500 + num) : String(2000 + num + 543);
  }
  return String(num);
};

export const toChristianYear = (yearStr?: string | number): string => {
  if (!yearStr) return '';
  const str = String(yearStr).trim();
  let candidate = str;
  if (str.includes('/')) {
    const parts = str.split('/');
    candidate = parts[parts.length - 1];
  }
  const match = candidate.match(/\d+/);
  if (!match) return '';
  const num = parseInt(match[0], 10);
  if (isNaN(num)) return '';
  if (num >= 2500) return String(num - 543);
  if (num >= 2000 && num < 2100) return String(num);
  if (num < 100) {
    return num > 40 ? String(2500 + num - 543) : String(2000 + num);
  }
  return String(num);
};

export const formatYearTag = (year?: string | number, fallbackDate?: string): string => {
  if (year) {
    const be = toBuddhistYear(year);
    if (be) return `ปี ${be}`;
  }
  if (fallbackDate) {
    const be = toBuddhistYear(fallbackDate);
    if (be) return `ปี ${be}`;
  }
  return 'ปี 2569';
};

// Filter categories exclusively by year
export const AKSORNSARA_YEAR_CATEGORIES = [
  'all',
  'ปี 2569',
  'ปี 2568',
  'ปี 2567',
  'ปี 2566',
  'ปี 2565',
  'ปี 2564',
] as const;

export const AKSORNSARA_CATEGORIES = AKSORNSARA_YEAR_CATEGORIES;
export const SARANIYAKORN_CATEGORIES = AKSORNSARA_CATEGORIES;

export const AKSORNSARA_TAGS = [
  'ปี 2569',
  'ปี 2568',
  'ปี 2567',
  'ปี 2566',
  'ปี 2565',
  'ปี 2564',
  'สาราณียกร',
] as const;

export const AKSORNSARA_YEARS = [
  'all',
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
] as const;

/**
 * Checks if an article is legitimately published for public viewing (F-DTL-024)
 * Returns false if the article is a draft or scheduled in the future.
 */
export const isPubliclyPublished = (article: {
  status?: string;
  publishedAt?: string;
  scheduledAt?: string;
  date?: string;
}): boolean => {
  if (article.status && article.status !== 'เผยแพร่แล้ว') {
    return false;
  }
  const dateStr = article.publishedAt || article.scheduledAt;
  if (dateStr) {
    const timestamp = new Date(dateStr).getTime();
    if (!isNaN(timestamp) && timestamp > Date.now()) {
      return false;
    }
  }
  return true;
};

export const getMockArticlesFromSession = (): ArticleDetail[] => {
  if (typeof window === 'undefined') return [];
  const articles: ArticleDetail[] = [];
  const seenIds = new Set<string>();

  try {
    if (window.sessionStorage) {
      const raw = sessionStorage.getItem('aksornsara_mock_articles');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id && !seenIds.has(item.id) && isPubliclyPublished(item)) {
              articles.push(item);
              seenIds.add(item.id);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse mock articles from sessionStorage', e);
  }

  // Also read shared articles created from backoffice if in localStorage (E2E-003, TAX-008, F-DTL-024)
  try {
    if (window.localStorage) {
      // 1. Process URL sync param if passed from Backoffice "ดูหน้าบ้าน"
      if (typeof window !== 'undefined' && window.location.search) {
        try {
          const params = new URLSearchParams(window.location.search);
          const syncRaw = params.get('sync_article');
          if (syncRaw) {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(syncRaw))));
            if (decoded && decoded.id) {
              const currentShared: any[] = JSON.parse(
                localStorage.getItem('aksornsara_backoffice_articles_shared') || '[]'
              );
              const existingIdx = currentShared.findIndex((a) => a.id === decoded.id);
              if (existingIdx >= 0) {
                currentShared[existingIdx] = decoded;
              } else {
                currentShared.unshift(decoded);
              }
              localStorage.setItem('aksornsara_backoffice_articles_shared', JSON.stringify(currentShared));
            }
          }
        } catch (syncErr) {
          console.warn('Failed to parse sync_article param', syncErr);
        }
      }

      const sharedRaw = localStorage.getItem('aksornsara_backoffice_articles_shared');
      if (sharedRaw) {
        const parsed = JSON.parse(sharedRaw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id && !seenIds.has(item.id) && isPubliclyPublished(item)) {
              const yearTag = formatYearTag(item.year || item.date);
              articles.push({
                id: item.id,
                title: item.title,
                year: item.year || '2026',
                date: item.date || 'ปี 2026',
                author: item.author || 'ชมรมสาราณียกร',
                proofreader: item.proofreader,
                illustrator: item.illustrator,
                excerpt: item.excerpt || '',
                metaDescription: item.metaDescription || item.excerpt || '',
                category: item.category || yearTag,
                tags: item.tags || [yearTag, 'สาราณียกร'],
                url: item.url || '',
                readTime: item.readTime || '5 นาที',
                imageUrl: item.coverImage || item.imageUrl || ArticleBannerMock,
                contentHtml: item.contentHtml || `<p>${item.excerpt}</p>`,
                references: item.references || [],
                slug: item.slug,
                publishedAt: item.publishedAt,
              } as any);
              seenIds.add(item.id);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse shared articles from localStorage', e);
  }

  return articles;
};

export const saveMockArticleToSession = (article: ArticleDetail): void => {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const current = getMockArticlesFromSession();
    const existingIndex = current.findIndex((a) => a.id === article.id);
    let updated: ArticleDetail[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = article;
    } else {
      updated = [article, ...current];
    }
    sessionStorage.setItem('aksornsara_mock_articles', JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save mock article to sessionStorage', e);
  }
};

export const getArticlesSummaryList = (): ArticleSummary[] => {
  const mocks = getMockArticlesFromSession()
    .filter(isPubliclyPublished)
    .map((m) => {
      const yearTag = formatYearTag(m.year || m.date);
      return {
        id: m.id,
        title: m.title,
        year: m.year || '2026',
        date: m.date || 'ปี 2026',
        author: m.author || 'ชมรมสาราณียกร',
        excerpt: m.excerpt,
        category: m.category || yearTag,
        tags: m.tags || [yearTag, 'สาราณียกร'],
        url: m.url || '',
        readTime: m.readTime || '5 นาที',
        imageUrl: m.imageUrl || m.coverImage || ArticleBannerMock,
        coverImage: m.coverImage || m.imageUrl || ArticleBannerMock,
        href: `/articles/${(m as any).slug || m.id}`,
      };
    });

  const baseSummaries: ArticleSummary[] = (
    articlesSummaryData as ArticleSummary[]
  ).map((art) => {
    const yearTag = formatYearTag(art.year, art.date);
    return {
      ...art,
      category: yearTag,
      tags: [yearTag, 'สาราณียกร'],
      imageUrl: art.imageUrl || ArticleBannerMock,
      href: `/articles/${art.id}`,
    };
  });

  return [...mocks, ...baseSummaries];
};

export const ARTICLES_SUMMARY: ArticleSummary[] = getArticlesSummaryList();
export const MOCK_ARTICLES = ARTICLES_SUMMARY;

// ── Lazy Loader for Full Articles Detail JSON (6.4 MB) ──
// Decoupled to eliminate initial bundle size & load lag on listing / search pages!
let detailsCache: Record<string, ArticleDetail> | null = null;
let loadDetailsPromise: Promise<Record<string, ArticleDetail>> | null = null;

export const loadArticlesDetailMap = async (): Promise<Record<string, ArticleDetail>> => {
  if (detailsCache) return detailsCache;
  if (!loadDetailsPromise) {
    loadDetailsPromise = import('./data/articles-detail.json').then((mod) => {
      detailsCache = (mod.default || mod) as Record<string, ArticleDetail>;
      return detailsCache;
    });
  }
  return loadDetailsPromise;
};

export const getArticleDetail = (idOrSlug: string): ArticleDetail | undefined => {
  if (!idOrSlug) return undefined;
  const normalized = idOrSlug.trim().toLowerCase();

  // 1. Check session & shared articles (TAX-008: match by id or slug)
  const mocks = getMockArticlesFromSession();
  const foundMock = mocks.find(
    (m) =>
      m.id.toLowerCase() === normalized ||
      ((m as any).slug && String((m as any).slug).toLowerCase() === normalized)
  );
  if (foundMock) {
    if (!isPubliclyPublished(foundMock)) {
      return undefined; // Future scheduled article - hidden from public (F-DTL-024)
    }
    return {
      ...foundMock,
      imageUrl: foundMock.imageUrl || foundMock.coverImage || ArticleBannerMock,
      href: `/articles/${(foundMock as any).slug || foundMock.id}`,
    };
  }

  // 2. Check static details cache if already loaded in memory
  if (detailsCache) {
    let article = detailsCache[idOrSlug];
    if (!article) {
      article = Object.values(detailsCache).find(
        (a) =>
          a.id.toLowerCase() === normalized ||
          ((a as any).slug && String((a as any).slug).toLowerCase() === normalized)
      );
    }
    if (article && isPubliclyPublished(article)) {
      const yearTag = formatYearTag(article.year, article.date);
      return {
        ...article,
        category: yearTag,
        imageUrl: article.imageUrl || ArticleBannerMock,
        href: `/articles/${article.id}`,
      };
    }
  }

  // 3. Fallback to summary so UI can immediately render title/cover/author while details stream in
  const summaries = getArticlesSummaryList();
  const summary = summaries.find(
    (s) =>
      s.id.toLowerCase() === normalized ||
      ((s as any).slug && String((s as any).slug).toLowerCase() === normalized)
  );
  if (summary) {
    return {
      ...summary,
      contentHtml: `<p>${summary.excerpt}</p>`,
    } as ArticleDetail;
  }

  return undefined;
};

/**
 * Asynchronously fetch complete article detail including rich HTML, figures, and references.
 */
export const fetchArticleDetail = async (idOrSlug: string): Promise<ArticleDetail | undefined> => {
  const sync = getArticleDetail(idOrSlug);
  if (sync && sync.contentHtml && !sync.contentHtml.startsWith(`<p>${sync.excerpt}</p>`)) {
    return sync;
  }
  await loadArticlesDetailMap();
  return getArticleDetail(idOrSlug);
};

export { ArticleBannerMock };
