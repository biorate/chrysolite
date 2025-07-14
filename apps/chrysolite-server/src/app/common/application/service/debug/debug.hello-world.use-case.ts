import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { DebugDrivenPort } from '../../ports';

@Injectable()
export class DebugHelloWorldUseCase {
  @Inject(Types.DebugDrivenPort)
  protected readonly debugHttp: DebugDrivenPort;

  public async execute() {
    const { name, ENV, version } = await this.debugHttp.getClientConfig();
    return `${ENV}/${name}:${version} -> "Hello world!"`;
  }
}
