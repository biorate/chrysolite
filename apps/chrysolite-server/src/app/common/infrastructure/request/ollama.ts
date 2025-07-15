import { AxiosPrometheus } from '@biorate/axios-prometheus';
import { GETOllamaGenerateREQ, GETOllamaGenerateRES } from './dto';

abstract class OllamaApiBase extends AxiosPrometheus {
  public baseURL = 'http://localhost:11434/api';
}

export class GETOllamaGenerate extends OllamaApiBase {
  public url = '/generate';

  public method = 'post';

  public static fetch(params: GETOllamaGenerateREQ) {
    return this._fetch<GETOllamaGenerateRES>({ data: params });
  }
}
