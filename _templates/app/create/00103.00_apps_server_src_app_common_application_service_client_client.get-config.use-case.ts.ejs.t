---
to: <%= h.server(CLIENT && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/client/client.get-config.use-case.ts`) %>
unless_exists: true
---
import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientDrivenPort } from '../../ports';

@Injectable()
export class ClientGetConfigUseCase {
  @Inject(Types.ClientDrivenPort)
  protected readonly clientRepository: ClientDrivenPort;

  public async execute() {
    return this.clientRepository.getConfig();
  }
}
