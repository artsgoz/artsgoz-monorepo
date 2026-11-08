import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@base-components';
import {
  publicArticlesApi,
  type PublicArticleDetail,
  type PublicArticleItem,
} from '../services/apiClient.js';
import type { ArticleDetail, ArticleSummary } from '../types.js';

export function toArticle(
  item: PublicArticleItem | PublicArticleDetail,
): ArticleDetail {
  const date = item.published_at ? new Date(item.published_at) : null;
  const image = item.cover_image_url;
  const imageUrl =
    image && !/^https?:\/\//.test(image)
      ? new URL(image, API_BASE_URL).href
      : image;
  return {
    id: String(item.id),
    title: item.title,
    year:
      date && !Number.isNaN(date.getTime()) ? String(date.getFullYear()) : '',
    date:
      date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : '',
    author: item.author_name || item.writer_credit || '',
    excerpt: item.excerpt || '',
    category: item.category_name || '',
    tags: item.tags?.map((tag) => (typeof tag === 'string' ? tag : tag.name)),
    url: `/articles/${item.slug || item.id}`,
    href: `/articles/${item.slug || item.id}`,
    readTime: '',
    imageUrl,
    contentHtml: 'content' in item ? item.content : undefined,
    proofreader:
      'proofreader_credit' in item ? item.proofreader_credit : undefined,
    illustrator:
      'illustrator_credit' in item ? item.illustrator_credit : undefined,
  };
}

export function usePublicArticles() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void publicArticlesApi
      .getArticles({ limit: 1000 })
      .then((response) => {
        if (active) setArticles(response.data.map(toArticle));
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : 'Unable to load articles.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { articles, loading, error };
}
