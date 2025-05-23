---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/user/user.update.use-case.ts`) %>
unless_exists: true
---
import { Inject, Injectable } from '@nestjs/common';
import { Types } from '@biorate/inversion';
import { User } from '../../../domain/';
import { UserDrivenPort } from '../../ports';

@Injectable()
export class UserUpdateUseCase {
  @Inject(Types.UserDrivenPort)
  protected readonly userProvider: UserDrivenPort;

  public async execute(user: User) {
    return this.userProvider.update(user);
  }
}
