import { AxiosPrometheus } from '@biorate/axios-prometheus';
import {
  GETOllamaGenerateREQ,
  GETOllamaGenerateRES,
  GETOllamaEmbeddingsREQ,
  GETOllamaEmbeddingsRES,
} from './dto';

abstract class OllamaApiBase extends AxiosPrometheus {
  public baseURL = 'http://0.0.0.0:11434/api';

  public timeout = 0;
}

export class GETOllamaGenerate extends OllamaApiBase {
  public url = '/generate';

  public method = 'post';

  public static fetch(params: GETOllamaGenerateREQ) {
    return this._fetch<GETOllamaGenerateRES>({ data: params });
  }
}

export class GETOllamaEmbeddings extends OllamaApiBase {
  public url = '/embeddings';

  public method = 'post';

  public static fetch(params: GETOllamaEmbeddingsREQ) {
    return this._fetch<GETOllamaEmbeddingsRES>({ data: params });
  }
}
