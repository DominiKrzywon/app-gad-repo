import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { expect } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  articlesRequest: ArticlesRequest,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  const articleDataFinal = articleData || prepareArticlePayload();
  const responseArticle = await articlesRequest.post(articleDataFinal);

  // assert article exist
  const articleJson = await responseArticle.json();

  const expectedStatusCode = 200;
  await expect(async () => {
    const responseArticleCreated = await articlesRequest.getOne(articleJson.id);

    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return responseArticle;
}
