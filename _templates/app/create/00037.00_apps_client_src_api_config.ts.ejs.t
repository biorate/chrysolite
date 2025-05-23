---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/api/config.ts`) %>
unless_exists: true
---
import { BaseApi } from './base-api';

export class Config extends BaseApi {
  public url = '/client/config';

  public method = 'get';

  public static fetch() {
    return this._fetch<Record<string, unknown>>();
  }
}
