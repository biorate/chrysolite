---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/persistence/user.in-memory.entity.ts`) %>
unless_exists: true
---
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { AutoObject } from '@biorate/auto-object';

export class UserInMemoryEntity extends AutoObject<UserInMemoryEntity> {
  @IsNumber()
  public id: number;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public email?: string;
}
