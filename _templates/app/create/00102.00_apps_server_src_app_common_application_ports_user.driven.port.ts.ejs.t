---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/ports/user.driven.port.ts`) %>
unless_exists: true
---
import { User } from '../../domain';

export interface UserDrivenPort {
  create(user: User): Promise<User>;

  findOne(id: number): Promise<User | undefined>;

  find(offset: number, limit: number): Promise<User[] | undefined>;

  update(user: User): Promise<User>;

  delete(id: number): Promise<void>;

  replace(user: User): Promise<User>;
}
