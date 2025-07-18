export type IQGetDocumentsReq = {
  embedding: string;
  threshold: number;
  limit: number;
};

export type IQGetDocumentsRes = {
  id: string;
  text: string;
  embedding: string;
  similarity: string;
  last_stamp: Date;
  creation: Date;
};
