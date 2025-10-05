import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify comment', () => {
  test('should return created comment @GAD-R07-06 @logged', async ({
    createRandomArticle,
    page,
  }) => {
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created';

    const newCommentData = prepareRandomComment();
    let articlePage = createRandomArticle.articlePage;
    const addCommentView = await articlePage.clickAddCommentButton();

    const waitParams = {
      page,
      url: '/api/comments',
      method: 'GET',
      text: newCommentData.body,
    };
    const responsePromise = waitForResponse(waitParams);

    // Act
    articlePage = await addCommentView.createComment(newCommentData);
    const response = await responsePromise;

    // Assert
    await expect
      .soft(articlePage.alertPopup)
      .toHaveText(expectedCommentCreatedPopup);

    expect(response.ok()).toBeTruthy();
  });

  test('should not allow edit comment with empty message @GAD-R07-06 @logged', async ({
    articlesRequestLogged,
    commentsRequestLogged,
    commentPage,
  }) => {
    // Arrange
    const expectedRejectionPopup = 'Comment was not updated';

    const responseArticle = await createArticleWithApi(articlesRequestLogged);
    const responseArticleJson = await responseArticle.json();

    const responseComment = await prepareAndCreateCommentWithApi(
      commentsRequestLogged,
      responseArticleJson.id,
    );
    const responseCommentJson = await responseComment.json();

    // Act
    await commentPage.gotoId(responseCommentJson.id);
    const editCommentView = await commentPage.clickEditButton();
    await editCommentView.bodyInput.clear();
    await editCommentView.updateButton.click();

    // Assert
    await expect(commentPage.alertPopup).toHaveText(expectedRejectionPopup);

    // Assert comment
    await editCommentView.cancelButton.click();
    await expect(commentPage.commentBody).toHaveText(responseCommentJson.body);
  });
});
