---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/info.controller.ts`) %>
unless_exists: true
---
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InfoGetUseCase } from '../../application/service';

@ApiTags('Info')
@Controller('/')
export class InfoController {
  public constructor(protected readonly infoGet: InfoGetUseCase) {}

  @Get(<%- CLIENT ? "'info'" : "''" -%>)
  @ApiOperation({ summary: 'Get info' })
  protected get() {
    return this.infoGet.execute();
  }
}
