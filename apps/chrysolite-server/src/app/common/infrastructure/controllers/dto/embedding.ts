import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class BODYGetEmbeddingDTO extends BODYCreateEmbeddingDTO {}
