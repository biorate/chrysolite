---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/adapters/info.repository.adapter.ts`) %>
unless_exists: true
---
import { Injectable } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { InfoDrivenPort } from '../../application/ports';
import { Info } from '../../domain';

@Injectable()
export class InfoRepositoryAdapter implements InfoDrivenPort {
  @inject(Types.Config) protected config: IConfig;

  public async getInfo() {
    return new Info({
      name: this.config.get<string>('package.name'),
      version: this.config.get<string>('package.version'),
      ENV: this.config.get<string>('ENV', 'debug'),
    });
  }
}
