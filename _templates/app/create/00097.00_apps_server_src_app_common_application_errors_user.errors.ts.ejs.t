---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/errors/user.errors.ts`) %>
unless_exists: true
---
import { BaseError } from '@biorate/errors';

export class UserAlreadyExistsError extends BaseError {
  public constructor(id: number) {
    super('User already exists [%s]', [id], { status: 409 });
  }
}

export class UserNotExistsError extends BaseError {
  public constructor(id: number) {
    super('User not exists [%s]', [id], { status: 404 });
  }
}
