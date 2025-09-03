import { CrudCreateDrivenPort, CrudFindManyDrivenPort } from '@biorate/nestjs-tools';
import { Document } from '../../domain';

export type DocumentDrivenPort = CrudCreateDrivenPort<Document> &
  CrudFindManyDrivenPort<
    Document,
    { embedding: string; threshold: number; limit: number },
    Document[]
  >;
