import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { controllers, GetLocaleUseCase, SetLocaleUseCase } from '@biorate/nestjs-tools';
import { ClientGetConfigUseCase } from '../../application/service';

@ApiTags('Client')
@Controller('client')
export class ClientController extends controllers.ClientController {
  public constructor(
    protected readonly getConfigUseCase: ClientGetConfigUseCase,
    protected readonly getLoc: GetLocaleUseCase,
    protected readonly setLoc: SetLocaleUseCase,
  ) {
    super();
  }

  @Get('config')
  @ApiOperation({ summary: 'Get client config' })
  protected get() {
    return this.getConfigUseCase.execute();
  }
}
