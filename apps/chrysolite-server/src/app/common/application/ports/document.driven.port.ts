import { CrudCreateDrivenPort } from '@biorate/nestjs-tools';
import { Document } from '../../domain';

export type DocumentDrivenPort = CrudCreateDrivenPort<Document>;
