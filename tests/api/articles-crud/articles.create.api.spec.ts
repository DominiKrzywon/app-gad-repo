import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { timestamp } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify articles create operations @crud @create @api @article', () => {
  test('should not create an article without a logged-in user @GAD-R09-01', async ({
    articlesRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articleData = prepareArticlePayload();

    // Arrange
    const response = await articlesRequest.post(articleData);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test.describe('create operations', () => {
    test('should create an article with logged-in user @GAD-R09-01', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 201;

      // Act
      const articleData = prepareArticlePayload();
      const responseArticle = await createArticleWithApi(
        articlesRequestLogged,
        articleData,
      );

      // Assert
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const articleJson = await responseArticle.json();
      expect.soft(articleJson.title).toEqual(articleData.title);
      expect.soft(articleJson.body).toEqual(articleData.body);
    });

    test('should create new article when modified article id not exist with logged-in user @GAD-R10-01', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const articleData = prepareArticlePayload();

      // Act
      const responseArticlePut = await articlesRequestLogged.put(
        articleData,
        timestamp(),
      );

      // Assert
      const actualResponseStatus = responseArticlePut.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const articleJson = await responseArticlePut.json();
      expect.soft(articleJson.title).toEqual(articleData.title);
      expect.soft(articleJson.body).toEqual(articleData.body);
    });
  });
});
