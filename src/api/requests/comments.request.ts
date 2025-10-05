import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { BaseRequest } from '@_src/api/requests/base.request';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class CommentsRequest extends BaseRequest {
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    super(request, apiUrls.commentsUrl, headers);
  }

  async getOne(commentId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${commentId}`, {
      headers: this.headers,
    });
  }

  async post(data: CommentPayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(data: CommentPayload, commentId: string): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${commentId}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    data: Partial<CommentPayload>,
    commentId: string,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${commentId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(commentId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${commentId}`, {
      headers: this.headers,
    });
  }
}
