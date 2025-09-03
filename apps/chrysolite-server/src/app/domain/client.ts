import { IsString } from 'class-validator';
import { AutoObject } from '@biorate/auto-object';

export class ClientConfig extends AutoObject<ClientConfig> {
  @IsString()
  public ENV: string;

  @IsString()
  public version: string;
}
