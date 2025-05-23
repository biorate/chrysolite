---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/request/info.ts`) %>
unless_exists: true
---
import { AxiosPrometheus } from '@biorate/axios-prometheus';
import { GETInfoREQ, GETInfoRES } from './dto';

export class GETInfo extends AxiosPrometheus {
  public baseURL = 'http://localhost:3000';

  public url = '/<%- CLIENT ? "info" : "" -%>';

  public method = 'get';

  public static fetch(params: GETInfoREQ) {
    return this._fetch<GETInfoRES>({ params });
  }
}
