import { AxiosPrometheus } from '@biorate/axios-prometheus';
import { GETInfoREQ, GETInfoRES } from './dto';

export class GETInfo extends AxiosPrometheus {
  public baseURL = 'http://localhost:3000';

  public url = '/info';

  public method = 'get';

  public static fetch(params: GETInfoREQ) {
    return this._fetch<GETInfoRES>({ params });
  }
}
