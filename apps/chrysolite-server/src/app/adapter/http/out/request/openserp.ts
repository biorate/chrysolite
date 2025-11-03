import * as m from 'moment';
import { stringify } from 'querystring';
import { AxiosPrometheus } from '@biorate/axios-prometheus';
import { GETOpenSerpSearchREQ, GETOpenSerpSearchRES, OpenSerpEngines } from '../dto';

abstract class OpenSerpApiBase extends AxiosPrometheus {
  public baseURL = 'http://0.0.0.0:7000';

  public timeout = 0;
}

export class GETOpenSerpSearch extends OpenSerpApiBase {
  public url = '/mega/search';

  public method = 'get';

  public static fetch(params: GETOpenSerpSearchREQ) {
    return this._fetch<GETOpenSerpSearchRES>({
      params: {
        engines: OpenSerpEngines.GOOGLE,
        limit: 10,
        date: `${m().subtract(5, 'day').format('YYYYMMDD')}..${m().format('YYYYMMDD')}`,
        lang: 'RU',
        ...params,
      },
    });
  }
}
