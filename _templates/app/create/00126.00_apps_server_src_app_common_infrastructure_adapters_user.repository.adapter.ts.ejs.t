---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/adapters/user.repository.adapter.ts`) %>
unless_exists: true
---
import { merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain';
import { UserNotExistsError, UserAlreadyExistsError } from '../../application/errors';
import { UserDrivenPort } from '../../application/ports';
import { UserInMemoryEntity } from '../persistence/user.in-memory.entity';

@Injectable()
export class UserRepositoryAdapter implements UserDrivenPort {
  private models: UserInMemoryEntity[] = [
    { id: 1, name: 'Bob', email: 'bob@example.com' },
    { id: 2, name: 'Alice', email: 'alice@example.com' },
  ];

  protected toUser(item: UserInMemoryEntity) {
    if (!item) return;
    return new User(item);
  }

  protected toModel(user: User) {
    if (!user) return;
    return new UserInMemoryEntity(user);
  }

  protected async get(id: number) {
    return this.models.find((user) => user.id === id);
  }

  public async create(data: User) {
    if (await this.findOne(data.id)) throw new UserAlreadyExistsError(data.id);
    this.models.push(data);
    return this.get(data.id);
  }

  public async findOne(id: number) {
    return this.toUser(await this.get(id));
  }

  public async find(offset: number, limit: number) {
    return [...this.models].slice(offset, offset + limit).map(this.toUser);
  }

  public async update(user: User) {
    const model = await this.get(user.id);
    if (!model) throw new UserNotExistsError(user.id);
    merge(model, user);
    return this.toUser(model);
  }

  public async delete(id: number) {
    const model = await this.get(id);
    if (!model) throw new UserNotExistsError(id);
    this.models.splice(this.models.indexOf(model), 1);
  }

  public async replace(user: User) {
    const model = await this.get(user.id);
    if (!model) throw new UserNotExistsError(user.id);
    this.models.splice(this.models.indexOf(model), 1);
    this.models.push(this.toModel(user));
    return this.findOne(user.id);
  }
}
