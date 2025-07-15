import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerationGetUseCase } from '../../application/service';
import { BODYGetGenerationDTO } from './dto';

@ApiTags('Generation')
@Controller('generation')
export class GenerationController {
  public constructor(protected readonly generationGet: GenerationGetUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get generation' })
  protected get(@Query() query: BODYGetGenerationDTO) {
    return this.generationGet.execute(query.text, query.threshold, query.limit);
  }
}
