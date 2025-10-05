import { invalidUserPayloadsGenerator } from '@_src/api/data/invalidUserPayloads';
import { nonStandardInputs } from '@_src/api/data/nonStandardInputs';
import { prepareUserPayload } from '@_src/api/factories/user-register.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('User Registration Validation', () => {
  test('verify if user can be created via API', async ({ usersRequest }) => {
    // Arrange
    const expectedStatusCode = 201;
    const usersData = prepareUserPayload();

    // Arrange
    const response = await usersRequest.post(usersData);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
  test.describe('No standard inputs', () => {
    nonStandardInputs.forEach((input) => {
      test(`verify if user can be created via API with non standard input: ${input}`, async ({
        usersRequest,
      }) => {
        // Arrange
        const usersData = prepareUserPayload();
        usersData.firstname = input;

        // Arrange
        const response = await usersRequest.post(usersData);

        // Assert
        await expect.soft(response).toBeOK();
      });
    });
  });

  test.describe('Invalid user payloads', () => {
    invalidUserPayloadsGenerator().forEach((data) => {
      test(
        `verify if user can not be created via API with: ${data.case}`,
        {
          annotation: data.info?.annotation,
        },
        async ({ usersRequest }) => {
          // eslint-disable-next-line playwright/no-skipped-test
          test.skip(!!data.info?.skip);

          // Arrange
          const response = await usersRequest.post(data.payload);

          // Assert
          await expect.soft(response).not.toBeOK();
          expect(response.status()).toBe(422);
        },
      );
    });
  });
});
