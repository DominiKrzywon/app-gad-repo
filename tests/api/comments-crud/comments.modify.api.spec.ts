import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments modify operations @crud @comment @api @modify', () => {
  let articleId: number;
  let responseComment: APIResponse;
  let commentData: CommentPayload;

  test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
    const responseArticle = await createArticleWithApi(articlesRequestLogged);

    const article = await responseArticle.json();
    articleId = article.id;
  });

  test.beforeEach('create a comment', async ({ commentsRequestLogged }) => {
    commentData = prepareCommentPayload(articleId);
    responseComment = await createCommentWithApi(
      commentsRequestLogged,
      commentData,
    );
  });
  test.describe('Verify comments full modify operations @crud @comment @api @modify', () => {
    test('should modify a comment with logged-in user @GAD-R10-02', async ({
      commentsRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const comment = await responseComment.json();
      const modifiedCommentData = prepareCommentPayload(articleId);

      // Act
      const responseCommentModified = await commentsRequestLogged.put(
        modifiedCommentData,
        comment.id,
      );

      // Assert
      const actualResponseStatus = responseCommentModified.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert modified comment
      const modifiedCommentGet = await commentsRequestLogged.getOne(comment.id);

      const modifiedCommentGetJson = await modifiedCommentGet.json();

      expect
        .soft(modifiedCommentGetJson.body)
        .toEqual(modifiedCommentData.body);
      expect.soft(modifiedCommentGetJson.body).not.toEqual(commentData.body);
    });

    test('should not modify a comment with a non logged-in user @GAD-R10-02', async ({
      commentsRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const comment = await responseComment.json();
      const modifiedCommentData = prepareCommentPayload(articleId);

      // Act
      const responseCommentNotModified = await commentsRequest.put(
        modifiedCommentData,
        comment.id,
      );

      // Assert
      const actualResponseStatus = responseCommentNotModified.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert non modified comment
      const nonModifiedCommentGet = await commentsRequest.getOne(comment.id);

      const nonModifiedCommentGetJson = await nonModifiedCommentGet.json();

      expect
        .soft(nonModifiedCommentGetJson.body)
        .not.toEqual(modifiedCommentData.body);
      expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
    });
  });

  test.describe('Verify comments partial modify operations @crud @comment @api @modify', () => {
    test('should partially modify a comment with logged-in user @GAD-R10-04', async ({
      commentsRequest,
      commentsRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 200;
      const comment = await responseComment.json();
      const modifiedCommentData = {
        body: `Patched body ${new Date().toISOString()}`,
      };

      // Act
      const responseCommentModified = await commentsRequestLogged.patch(
        modifiedCommentData,
        comment.id,
      );

      // Assert
      const actualResponseStatus = responseCommentModified.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert modified comment
      const modifiedCommentGet = await commentsRequest.getOne(comment.id);

      const modifiedCommentGetJson = await modifiedCommentGet.json();

      expect
        .soft(modifiedCommentGetJson.body)
        .toEqual(modifiedCommentData.body);
      expect.soft(modifiedCommentGetJson.body).not.toEqual(commentData.body);
      expect.soft(modifiedCommentGetJson.date).toEqual(commentData.date);
    });

    test('should not partially modify a comment with a non logged-in user @GAD-R10-04', async ({
      commentsRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const comment = await responseComment.json();
      const modifiedCommentData = {
        body: `Patched body ${new Date().toISOString()}`,
      };

      // Act
      const responseCommentNotModified = await commentsRequest.patch(
        modifiedCommentData,
        comment.id,
      );

      // Assert
      const actualResponseStatus = responseCommentNotModified.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      // Assert non modified comment
      const nonModifiedCommentGet = await commentsRequest.getOne(comment.id);

      const nonModifiedCommentGetJson = await nonModifiedCommentGet.json();

      expect
        .soft(nonModifiedCommentGetJson.body)
        .not.toEqual(modifiedCommentData.body);
      expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
    });

    test('should not partially modify a comment with a non existing field for logged-in user @GAD-R10-04', async ({
      commentsRequest,
      commentsRequestLogged,
    }) => {
      // Arrange
      const expectedStatusCode = 422;
      const nonExistingField = 'nonExistingField';
      const expectedErrorMessage = `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`;

      const comment = await responseComment.json();
      const modifiedCommentData: { [key: string]: string } = {};
      modifiedCommentData[nonExistingField] = `${new Date().toISOString()}`;

      // Act
      const responseCommentNotModified = await commentsRequestLogged.patch(
        modifiedCommentData,
        comment.id,
      );

      // Assert
      const actualResponseStatus = responseCommentNotModified.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const responseCommentNotModifiedJson =
        await responseCommentNotModified.json();

      expect
        .soft(responseCommentNotModifiedJson.error.message)
        .toEqual(expectedErrorMessage);

      // Assert non modified comment
      const nonModifiedCommentGet = await commentsRequest.getOne(comment.id);

      const nonModifiedCommentGetJson = await nonModifiedCommentGet.json();
      expect.soft(nonModifiedCommentGetJson.body).toEqual(commentData.body);
    });
  });
});
