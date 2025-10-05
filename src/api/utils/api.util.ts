export const apiUrls = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl: '/api/login',
  healthUrl: 'api/health',
  usersUrl: 'api/users',
};

export function timestamp(): string {
  return `${new Date().valueOf()}`;
}
