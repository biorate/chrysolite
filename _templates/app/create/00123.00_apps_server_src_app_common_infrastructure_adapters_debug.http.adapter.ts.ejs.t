---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/adapters/debug.http.adapter.ts`) %>
unless_exists: true
---
import { Injectable } from '@nestjs/common';
import { DebugDrivenPort } from '../../application/ports';
import { Info } from '../../domain';
import { GETInfo } from '../request';

@Injectable()
export class DebugHttpAdapter implements DebugDrivenPort {
  public async getClientConfig() {
    const { data } = await GETInfo.fetch({});
    return new Info(data);
  }
}
