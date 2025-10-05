import { Headers } from '@_src/api/models/headers.api.model';
import { UserRegisterPayload } from '@_src/api/models/user.api.model';
import { BaseRequest } from '@_src/api/requests/base.request';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class UsersRequest extends BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    super(request, apiUrls.usersUrl, headers);
  }

  async post(data: UserRegisterPayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }
}
