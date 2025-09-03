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
