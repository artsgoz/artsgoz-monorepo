import type { ArticleSummary, ArticleDetail } from './types.js';
import ArticleBannerMock from '../../assets/ArticleBannerMock.jpg';
import articlesSummaryData from './data/articles-summary.json';
import articlesDetailData from './data/articles-detail.json';

export const AKSORNSARA_CATEGORIES = [
  'all',
  'ศิลปะ',
  'วรรณกรรม',
  'ภาษา',
  'วัฒนธรรม',
  'ปรัชญา',
  'วิจารณ์',
  'ทั่วไป',
] as const;

export const SARANIYAKORN_CATEGORIES = AKSORNSARA_CATEGORIES;

export const AKSORNSARA_TAGS = [
  'วรรณกรรม',
  'ศิลปะ',
  'ภาษา',
  'วัฒนธรรม',
  'ปรัชญา',
  'วิจารณ์',
  'ทั่วไป',
  'การอ่าน',
  'ดนตรี',
  'จิตวิทยา',
  'ภาพยนตร์',
  'ประวัติศาสตร์',
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
      const sharedRaw = localStorage.getItem('aksornsara_backoffice_articles_shared');
      if (sharedRaw) {
        const parsed = JSON.parse(sharedRaw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id && !seenIds.has(item.id) && isPubliclyPublished(item)) {
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
                category: item.category || 'ทั่วไป',
                tags: item.tags || [item.category || 'ทั่วไป', 'สาราณียกร'],
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
    .map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year || '2026',
      date: m.date || 'ปี 2026',
      author: m.author || 'ชมรมสาราณียกร',
      excerpt: m.excerpt,
      category: m.category || 'ทั่วไป',
      tags: m.tags || ['ทั่วไป', 'สาราณียกร'],
      url: m.url || '',
      readTime: m.readTime || '5 นาที',
      imageUrl: m.imageUrl || m.coverImage || ArticleBannerMock,
      coverImage: m.coverImage || m.imageUrl || ArticleBannerMock,
      href: `/articles/${(m as any).slug || m.id}`,
    }));

  const baseSummaries: ArticleSummary[] = (
    articlesSummaryData as ArticleSummary[]
  ).map((art) => ({
    ...art,
    imageUrl: art.imageUrl || ArticleBannerMock,
    href: `/articles/${art.id}`,
  }));

  return [...mocks, ...baseSummaries];
};

export const ARTICLES_SUMMARY: ArticleSummary[] = getArticlesSummaryList();
export const MOCK_ARTICLES = ARTICLES_SUMMARY;

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

  // 2. Check static JSON archive data (match by id or slug)
  const details = articlesDetailData as Record<string, ArticleDetail>;
  let article = details[idOrSlug];
  if (!article) {
    article = Object.values(details).find(
      (a) =>
        a.id.toLowerCase() === normalized ||
        ((a as any).slug && String((a as any).slug).toLowerCase() === normalized)
    );
  }

  if (!article || !isPubliclyPublished(article)) return undefined;
  return {
    ...article,
    imageUrl: article.imageUrl || ArticleBannerMock,
    href: `/articles/${article.id}`,
  };
};

export { ArticleBannerMock };
