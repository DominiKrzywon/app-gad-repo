import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles modification operations @crud @article @api', () => {
  let responseArticle: APIResponse;
  let articleData: ArticlePayload;

  test.beforeEach('create an article', async ({ articlesRequestLogged }) => {
    articleData = prepareArticlePayload();
    responseArticle = await createArticleWithApi(
      articlesRequestLogged,
      articleData,
    );
  });
  test.describe('fully modify article', () => {
    test('should modify and replace content for an article with logged-in user @GAD-R10-01', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;
      const modifiedArticleData = prepareArticlePayload();

      // Act
      const responseArticlePut = await articlesRequestLogged.put(
        modifiedArticleData,
        articleId,
      );

      // Assert
      const actualResponseStatus = responseArticlePut.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const modifiedArticleJson = await responseArticlePut.json();

      expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title);
      expect.soft(modifiedArticleJson.body).toEqual(modifiedArticleData.body);
      expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
      expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body);
    });

    test('should not modify an article with a non logged-in user @GAD-R10-01', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;
      const modifiedArticleData = prepareArticlePayload();

      // Act
      const responseArticlePut = await articlesRequest.put(
        modifiedArticleData,
        articleId,
      );

      // Assert
      const actualResponseStatus = responseArticlePut.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const nonModifiedArticle = await articlesRequest.getOne(articleId);

      const nonModifiedArticleJson = await nonModifiedArticle.json();
      expect
        .soft(nonModifiedArticleJson.title)
        .not.toEqual(modifiedArticleData.title);
      expect
        .soft(nonModifiedArticleJson.body)
        .not.toEqual(modifiedArticleData.body);
      expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
      expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
    });
  });
  test.describe('partially modify article', () => {
    test('should partially modify an article with logged-in user @GAD-R10-03', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;
      const modifiedArticleData = {
        title: `Patched title ${new Date().toISOString()}`,
      };

      const responseArticlePatch = await articlesRequestLogged.patch(
        modifiedArticleData,
        articleId,
      );

      // Assert
      const actualResponseStatus = responseArticlePatch.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const modifiedArticleJson = await responseArticlePatch.json();

      expect.soft(modifiedArticleJson.title).toEqual(modifiedArticleData.title);
      expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
      expect.soft(modifiedArticleJson.body).toEqual(articleData.body);
    });

    test('should not partially modify an article with a non logged-in user @GAD-R10-03', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;
      const modifiedArticleData = {
        title: `Patched title ${new Date().toISOString()}`,
      };

      // Act
      const responseArticlePatch = await articlesRequest.patch(
        modifiedArticleData,
        articleId,
      );

      // Assert
      const actualResponseStatus = responseArticlePatch.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const nonModifiedArticle = await articlesRequest.getOne(articleId);

      const nonModifiedArticleJson = await nonModifiedArticle.json();
      expect
        .soft(nonModifiedArticleJson.title)
        .not.toEqual(modifiedArticleData.title);
      expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
      expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
    });

    test('should not partially modify an article with improper field logged-in user @GAD-R10-03', async ({
      articlesRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 422;
      const nonExistingField = 'nonExistingField';
      const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,title,body,date,image]`;

      const articleJson = await responseArticle.json();
      const articleId = articleJson.id;

      const modifiedArticleData: { [key: string]: string } = {};
      modifiedArticleData[nonExistingField] = 'Hello';

      const responseArticlePatch = await articlesRequestLogged.patch(
        modifiedArticleData,
        articleId,
      );

      // Assert
      const actualResponseStatus = responseArticlePatch.status();
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const responseArticlePutJson = await responseArticlePatch.json();
      expect
        .soft(responseArticlePutJson.error.message)
        .toEqual(expectedErrorMessage);
    });
  });
});
