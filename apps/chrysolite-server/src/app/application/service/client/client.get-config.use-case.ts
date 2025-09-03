import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { ClientDrivenPort } from '@/app/application/ports';

@Injectable()
export class ClientGetConfigUseCase {
  @Inject(Types.ClientDrivenPort)
  protected readonly clientRepository: ClientDrivenPort;

  public async execute() {
    return this.clientRepository.getConfig();
  }
}
