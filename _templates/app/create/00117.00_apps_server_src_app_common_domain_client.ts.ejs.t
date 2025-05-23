---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/domain/client.ts`) %>
unless_exists: true
---
import { IsString } from 'class-validator';
import { AutoObject } from '@biorate/auto-object';

export class ClientConfig extends AutoObject<ClientConfig> {
  @IsString()
  public ENV: string;

  @IsString()
  public version: string;
}
