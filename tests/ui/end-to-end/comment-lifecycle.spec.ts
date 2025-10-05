import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { AddCommentModel } from '@_src/ui/models/comment.model';
import { ArticlePage } from '@_src/ui/pages/article.page';

test.describe('Create, verify and delete comment', () => {
  let articlePageNew: ArticlePage;

  test.beforeEach(async ({ articlesRequestLogged, articlePage }) => {
    const responseArticle = await createArticleWithApi(articlesRequestLogged);
    const article = await responseArticle.json();
    articlePageNew = await articlePage.gotoId(article.id);
  });

  test('API operate on comments @GAD-R05-01 @GAD-R05-02 @logged', async ({}) => {
    const newCommentData = prepareRandomComment();

    await test.step('create new comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
      const expectedAddCommentHeader = 'Add New Comment';

      // Act
      const addCommentView = await articlePageNew.clickAddCommentButton();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader);

      articlePageNew = await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePageNew.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    let commentPage = await test.step('verify comment', async () => {
      // Act
      const articleComment = articlePageNew.getArticleComment(
        newCommentData.body,
      );
      await expect(articleComment.body).toHaveText(newCommentData.body);

      const commentPage = await articlePageNew.clickCommentLink(articleComment);

      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);

      return commentPage;
    });

    let editCommentData: AddCommentModel;
    await test.step('update comment', async () => {
      // Arrange
      const expectedCommentUpdatePopup = 'Comment was updated';

      editCommentData = prepareRandomComment();

      // Act
      const editCommentView = await commentPage.clickEditButton();
      commentPage = await editCommentView.updateComment(editCommentData);

      // Assert
      await expect
        .soft(commentPage.alertPopup)
        .toHaveText(expectedCommentUpdatePopup);
      await expect(commentPage.commentBody).toHaveText(editCommentData.body);
    });

    await test.step('verify updated comment in article page', async () => {
      // Act
      const articlePage = await commentPage.clickReturnLink();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );

      // Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });
  });

  test('user can add more than one comment to article @GAD-R05-03 @logged', async () => {
    await test.step('create first comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
      const newCommentData = prepareRandomComment();

      // Act
      const addCommentView = await articlePageNew.clickAddCommentButton();
      articlePageNew = await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePageNew.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('create and verify second comment', async () => {
      const secondCommentBody = await test.step('create comment', async () => {
        const secondCommentData = prepareRandomComment();
        const addCommentView = await articlePageNew.clickAddCommentButton();
        articlePageNew = await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      await test.step('verify comment', async () => {
        const articleComment =
          articlePageNew.getArticleComment(secondCommentBody);
        await expect(articleComment.body).toHaveText(secondCommentBody);
        const commentPage =
          await articlePageNew.clickCommentLink(articleComment);
        await expect(commentPage.commentBody).toHaveText(secondCommentBody);
      });
    });
  });
});
