import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmbeddingCreateUseCase, EmbeddingGetUseCase } from '../../application/service';
import { BODYCreateEmbeddingDTO, BODYGetEmbeddingDTO } from './dto';

@ApiTags('Embedding')
@Controller('embedding')
export class EmbeddingController {
  public constructor(
    protected readonly embeddingCreate: EmbeddingCreateUseCase,
    protected readonly embeddingGet: EmbeddingGetUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find embedding' })
  protected get(@Query() query: BODYGetEmbeddingDTO) {
    return this.embeddingGet.execute(query.text, query.threshold, query.limit);
  }

  @Post()
  @ApiOperation({ summary: 'Embedding create' })
  protected post(@Body() body: BODYCreateEmbeddingDTO) {
    return this.embeddingCreate.execute(body.text);
  }
}
