import { Info } from '../../domain';

export interface InfoDrivenPort {
  getInfo(): Promise<Info>;
}
