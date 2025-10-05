import { Headers } from '@_src/api/models/headers.api.model';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected url: string,
    protected headers?: Headers,
  ) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }
}
