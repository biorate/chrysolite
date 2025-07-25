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
