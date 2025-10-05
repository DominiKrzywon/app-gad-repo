import { expect, test } from '@_src/merge.fixture';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { RegisterUserModel } from '@_src/ui/models/user.model';
import { invalidUserGeneratorUi } from '@_src/ui/test-data/invalidUser.data';

test.describe('Verify register', () => {
  let registerUserData: RegisterUserModel;

  test.beforeEach(async () => {
    registerUserData = prepareRandomUser();
  });

  test('register with correct data and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedAlertPopupText = 'User created';
    const expectedLoginTitle = 'Login';
    const expectedWelcomeTitle = 'Welcome';

    // Act
    const loginPage = await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadUrl();
    const titleLogin = await loginPage.getTitle();
    expect.soft(titleLogin).toContain(expectedLoginTitle);

    // Assert test login
    const welcomePage = await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.getTitle();
    expect(titleWelcome).toContain(expectedWelcomeTitle);
  });

  test('not register with incorrect data - non valid email @GAD-R03-04', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = '@#$';

    // Act
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('not register with incorrect data - email not provided @GAD-R03-04', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedErrorText = 'This field is required';

    // Act
    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName);
    await registerPage.userLastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test.describe('Invalid user data for registration', () => {
    invalidUserGeneratorUi().forEach((data) => {
      test(
        `not register - ${data.case} @GAD-R03-04`,
        {
          annotation: data.info?.annotation,
        },
        async ({ registerPage }) => {
          // eslint-disable-next-line playwright/no-skipped-test
          test.skip(!!data.info?.skip);

          // Arrange
          const expectedErrorText = 'This field is required';

          // Act
          await registerPage.userFirstNameInput.fill(
            data.payload.userFirstName,
          );
          await registerPage.userLastNameInput.fill(data.payload.userLastName);
          await registerPage.userPasswordInput.fill(data.payload.userPassword);
          await registerPage.userEmailInput.fill(data.payload.userEmail);
          await registerPage.registerButton.click();

          // Assert
          await expect(registerPage.generalErrorText(data.field)).toHaveText(
            expectedErrorText,
          );
        },
      );
    });
  });
});
