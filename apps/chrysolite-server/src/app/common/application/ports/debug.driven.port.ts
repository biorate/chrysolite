import { Info } from '../../domain';

export interface DebugDrivenPort {
  getClientConfig(): Promise<Info>;
}
