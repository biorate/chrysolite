export type GETOllamaGenerateREQ = {
  model: string;
  prompt: string;
  stream: boolean;
  think: boolean;
  options?: {
    temperature?: number;
    num_ctx?: number;
    stop?: string[];
  };
};

export type GETOllamaGenerateRES = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
};
