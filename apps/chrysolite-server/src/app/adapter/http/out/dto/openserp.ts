export enum OpenSerpEngines {
  GOOGLE = 'google',
  DUCKDUCKGO = 'duckduckgo',
  YANDEX = 'yandex',
  BAIDU = 'baidu',
  BING = 'bing',
}

export type OpenSerpEngine =
  | OpenSerpEngines.GOOGLE
  | OpenSerpEngines.DUCKDUCKGO
  | OpenSerpEngines.YANDEX
  | OpenSerpEngines.BAIDU
  | OpenSerpEngines.BING;

export type GETOpenSerpSearchREQ = {
  text: string;
  engines?: string;
  limit?: number;
  date?: string;
  lang?: string;
};

export type GETOpenSerpSearchRES = {
  rank: number;
  url: string;
  title: string;
  description: string;
  ad: boolean;
  engine: OpenSerpEngine;
}[];
