import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { toInt, toFloat } from '../../../../shared';

export class BODYCreateEmbeddingDTO {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Hello world!',
    default: 'Hello world!',
    description: 'Text for embedding',
  })
  public readonly text: string;
}

export class BODYGetEmbeddingDTO extends BODYCreateEmbeddingDTO {
  @Transform(toFloat)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    example: 0.5,
    default: 0.5,
    description: 'Threshold',
  })
  public readonly threshold: number = 0.5;

  @Transform(toInt)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    example: 3,
    default: 3,
    description: 'Limit',
  })
  public readonly limit: number = 3;
}
