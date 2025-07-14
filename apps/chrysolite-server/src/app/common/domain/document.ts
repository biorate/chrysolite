import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { AutoObject } from '@biorate/auto-object';

export class Document extends AutoObject<Document> {
  @IsString()
  @IsOptional()
  public id?: string;

  @IsString()
  public text: string;

  @IsString()
  public embedding: string;

  @IsDate()
  @IsOptional()
  public lastStamp?: Date;

  @IsDate()
  @IsOptional()
  public creation?: Date;
}
