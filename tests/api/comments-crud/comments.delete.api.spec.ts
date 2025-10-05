import { expectGetOneResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments delete operations @crud @comment @api @delete', () => {
  let articleId: number;
  let responseComment: APIResponse;

  test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
    const responseArticle = await createArticleWithApi(articlesRequestLogged);

    const article = await responseArticle.json();
    articleId = article.id;
  });

  test.beforeEach('create a comment', async ({ commentsRequestLogged }) => {
    responseComment = await prepareAndCreateCommentWithApi(
      commentsRequestLogged,
      articleId,
    );
  });

  test('should delete a comment with logged-in user @GAD-R09-04', async ({
    commentsRequestLogged,
  }) => {
    // Arrange
    const expectedStatusCode = 200;
    const comment = await responseComment.json();

    // Act
    const responseCommentDeleted = await commentsRequestLogged.delete(
      comment.id,
    );

    // Assert
    const actualResponseStatus = responseCommentDeleted.status();
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    // Assert deleted comment
    const expectedStatusDeletedComment = 404;

    await expectGetOneResponseStatus(
      commentsRequestLogged,
      comment.id,
      expectedStatusDeletedComment,
    );
  });

  test('should not delete a comment with a non logged-in user @GAD-R09-04', async ({
    commentsRequest,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const comment = await responseComment.json();

    // Act
    const responseCommentNotDeleted = await commentsRequest.delete(comment.id);

    // Assert
    const actualResponseStatus = responseCommentNotDeleted.status();
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);

    // Assert non deleted comment
    const expectedStatusNotDeletedComment = 200;

    await expectGetOneResponseStatus(
      commentsRequest,
      comment.id,
      expectedStatusNotDeletedComment,
    );
  });
});
