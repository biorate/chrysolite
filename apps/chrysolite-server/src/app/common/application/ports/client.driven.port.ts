import { ClientDrivenPort as CommonClientDrivenPort } from '@biorate/nestjs-tools';
import { ClientConfig } from '../../domain';

export interface ClientDrivenPort extends CommonClientDrivenPort {
  getConfig(): Promise<ClientConfig>;
}
