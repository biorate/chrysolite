---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/debug/debug.hello-world.use-case.ts`) %>
unless_exists: true
---
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
