import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DebugHelloWorldUseCase } from '@/app/application/service';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  public constructor(protected readonly helloWorld: DebugHelloWorldUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Print debug' })
  private get() {
    return this.helloWorld.execute();
  }
}
