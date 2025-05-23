---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/user/user.delete.use-case.ts`) %>
unless_exists: true
---
import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { UserDrivenPort } from '../../ports';

@Injectable()
export class UserDeleteUseCase {
  @Inject(Types.UserDrivenPort)
  protected readonly userProvider: UserDrivenPort;

  public async execute(id: number) {
    return this.userProvider.delete(id);
  }
}
