import { Injectable } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { ClientRepositoryAdapter as CommonClientRepositoryAdapter } from '@biorate/nestjs-tools';
import { ClientDrivenPort } from '../../application/ports';
import { ClientConfig } from '../../domain';

@Injectable()
export class ClientRepositoryAdapter
  extends CommonClientRepositoryAdapter
  implements ClientDrivenPort
{
  @inject(Types.Config) protected config: IConfig;

  public async getConfig() {
    return new ClientConfig({
      ENV: this.config.get<string>('ENV', 'debug'),
      version: this.config.get<string>('package.version'),
    });
  }
}
