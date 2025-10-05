import { Headers } from '@_src/api/models/headers.api.model';
import { LoginData } from '@_src/api/models/login.api.model';
import { LoginRequest } from '@_src/api/requests/login.request';
import { testUser1 } from '@_src/ui/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginData: LoginData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const loginRequest = new LoginRequest(request);
  const responseLogin = await loginRequest.post(loginData);
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}
