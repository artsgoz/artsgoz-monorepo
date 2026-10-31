export interface ArticleSummary {
  id: string;
  title: string;
  year: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  url: string;
  readTime: string;
  imageUrl?: string;
  href?: string;
}

export interface ArticleDetail extends ArticleSummary {
  proofreader?: string;
  illustrator?: string;
  references: string[];
  content: string[];
}

export type Article = ArticleDetail;
