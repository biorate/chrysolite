import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InfoGetUseCase } from '@/app/application/service';

@ApiTags('Info')
@Controller('/')
export class InfoController {
  public constructor(protected readonly infoGet: InfoGetUseCase) {}

  @Get('info')
  @ApiOperation({ summary: 'Get info' })
  protected get() {
    return this.infoGet.execute();
  }
}
