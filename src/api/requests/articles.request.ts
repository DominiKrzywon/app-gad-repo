import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { BaseRequest } from '@_src/api/requests/base.request';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest extends BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    super(request, apiUrls.articlesUrl, headers);
  }

  async getOne(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }

  async post(data: ArticlePayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(data: ArticlePayload, articleId: string): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    data: Partial<ArticlePayload>,
    articleId: string,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(articleId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }
}
