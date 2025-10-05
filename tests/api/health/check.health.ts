import { HealthRequest } from '@_src/api/requests/health.request';
import { expect, test as health } from '@_src/merge.fixture';

health('verify if application is in correct state', async ({ request }) => {
  // Arrange
  const expectedStatus = 'OK';
  const healthRequest = new HealthRequest(request);

  // Act
  const response = await healthRequest.get();
  const responseJson = await response.json();

  // Assert
  expect(responseJson.status).toBe(expectedStatus);
});
