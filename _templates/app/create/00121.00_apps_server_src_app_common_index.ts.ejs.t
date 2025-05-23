---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/index.ts`) %>
unless_exists: true
---
import { Types } from '@biorate/inversion';
import { Module } from '@nestjs/common';
import {
  <% if (CLIENT) { -%>
  GetLocaleUseCase,
  SetLocaleUseCase,
  <% } -%>
  GetMetricsUseCase,
  MetricsRepositoryAdapter,
  controllers as C,
} from '@biorate/nestjs-tools';
import {
  <% if (!CUT_EXAMPLES) { -%>
  UserRepositoryAdapter,
  <% } -%>
  <%- CLIENT ? 'ClientRepositoryAdapter,' : '' -%>
  DebugHttpAdapter,
  InfoRepositoryAdapter,
} from './infrastructure';
import * as useCases from './application/service';
<%- ADD_WEB_SOCKET ? "import * as gateways from './infrastructure/gateways';" : '' -%>
import * as controllers from './infrastructure/controllers';
import { DebugController } from './infrastructure/controllers/debug.controller';

@Module({
  imports: [
    <%- ADD_WEB_SOCKET ? '...Object.values(gateways),' : '' -%>
  ],
  controllers: [
    ...Object.values(controllers),
    ...Object.values(C)<%- !CLIENT ? '.filter((item) => C.ClientController !== item)' : '' -%>,
    ...(process.env.NODE_ENV !== 'production' ? [DebugController] : []),
  ],
  providers: [
    <% if (CLIENT) { -%>
    GetLocaleUseCase,
    SetLocaleUseCase,
    <% } -%>
    GetMetricsUseCase,
    ...Object.values(useCases),
    <% if (!CUT_EXAMPLES) { -%>
    {
      provide: Types.UserDrivenPort,
      useClass: UserRepositoryAdapter,
    },
    <% } -%>
    <% if (CLIENT) { -%>
    {
      provide: Types.ClientDrivenPort,
      useClass: ClientRepositoryAdapter,
    },
    <% } -%>
    {
      provide: Types.MetricsDrivenPort,
      useClass: MetricsRepositoryAdapter,
    },
    {
      provide: Types.InfoDrivenPort,
      useClass: InfoRepositoryAdapter,
    },
    {
      provide: Types.DebugDrivenPort,
      useClass: DebugHttpAdapter,
    },
  ],
})
export class CommonModule {}
