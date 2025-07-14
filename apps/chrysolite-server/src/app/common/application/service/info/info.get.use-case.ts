import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { InfoDrivenPort } from '../../ports';

@Injectable()
export class InfoGetUseCase {
  @Inject(Types.InfoDrivenPort)
  protected readonly infoRepository: InfoDrivenPort;

  public execute() {
    return this.infoRepository.getInfo();
  }
}
