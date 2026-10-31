import type { ArticleSummary, ArticleDetail } from './types.js';
import ArticleBannerMock from '../../assets/ArticleBannerMock.jpg';
import articlesSummaryData from './data/articles-summary.json';
import articlesDetailData from './data/articles-detail.json';

export const AKSORNSARA_YEARS = [
  'all',
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
] as const;

export const AKSORNSARA_CATEGORIES = [...AKSORNSARA_YEARS];
export const SARANIYAKORN_CATEGORIES = AKSORNSARA_CATEGORIES;

export const ARTICLES_SUMMARY: ArticleSummary[] = (
  articlesSummaryData as ArticleSummary[]
).map((art) => ({
  ...art,
  imageUrl: art.imageUrl || ArticleBannerMock,
  href: `/articles/${art.id}`,
}));

export const MOCK_ARTICLES = ARTICLES_SUMMARY;

export const getArticleDetail = (id: string): ArticleDetail | undefined => {
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
