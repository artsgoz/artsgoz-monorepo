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

export const getMockArticlesFromSession = (): ArticleDetail[] => {
  if (typeof window === 'undefined' || !window.sessionStorage) return [];
  try {
    const raw = sessionStorage.getItem('aksornsara_mock_articles');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse mock articles from sessionStorage', e);
  }
  return [];
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
  const mocks = getMockArticlesFromSession().map((m) => ({
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
    href: `/articles/${m.id}`,
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

export const getArticleDetail = (id: string): ArticleDetail | undefined => {
  // 1. Check session mock articles first
  const mocks = getMockArticlesFromSession();
  const foundMock = mocks.find((m) => m.id === id);
  if (foundMock) {
    return {
      ...foundMock,
      imageUrl: foundMock.imageUrl || foundMock.coverImage || ArticleBannerMock,
      href: `/articles/${foundMock.id}`,
    };
  }

  // 2. Check static JSON archive data
  const details = articlesDetailData as Record<string, ArticleDetail>;
  const article = details[id];
  if (!article) return undefined;
  return {
    ...article,
    imageUrl: article.imageUrl || ArticleBannerMock,
    href: `/articles/${article.id}`,
  };
};

export { ArticleBannerMock };
