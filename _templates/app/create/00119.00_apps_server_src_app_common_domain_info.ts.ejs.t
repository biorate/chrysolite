---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/domain/info.ts`) %>
unless_exists: true
---
import { IsString } from 'class-validator';
import { AutoObject } from '@biorate/auto-object';

export class Info extends AutoObject<Info> {
  @IsString()
  public name: string;

  @IsString()
  public version: string;

  @IsString()
  public ENV: string;
}
