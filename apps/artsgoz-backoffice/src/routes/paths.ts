export const PATHS = {
  ROOT: '/',
  DASHBOARD: {
    ROOT: '/dashboard',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    AUDIT_LOG: '/admin/audit-log',
    REVIEWS: '/admin/reviews',
  },
  YELLOW_CARD_BACKOFFICE: '/yellow-card/backoffice',
  SARANIYAKORN: '/saraniyakorn',
  SARANIYAKORN_TRAFFIC: '/saraniyakorn/traffic',
  SARANIYAKORN_CATEGORIES: '/saraniyakorn/categories',
  SARANIYAKORN_ARTICLES: '/saraniyakorn/articles',
  SARANIYAKORN_PUBLISHED_ARTICLES: '/saraniyakorn/published-articles',
  SARANIYAKORN_CREATE: '/saraniyakorn/create',
  SARANIYAKORN_SETTINGS: '/saraniyakorn/settings',
  SARANIYAKORN_COMMENTS: '/saraniyakorn/comments',
  SARANIYAKORN_ACTIVITIES: '/saraniyakorn/activities',
} as const;

