import { Types } from '@biorate/inversion';
import { Module } from '@nestjs/common';
import {
  GetLocaleUseCase,
  SetLocaleUseCase,
  GetMetricsUseCase,
  MetricsRepositoryAdapter,
  controllers as C,
} from '@biorate/nestjs-tools';
import {
  ClientRepositoryAdapter,
  DebugHttpAdapter,
  InfoRepositoryAdapter,
  EmbeddingTensorflowAdapter,
  DocumentRepositoryAdapter,
} from './infrastructure';
import * as useCases from './application/service';
import * as gateways from './infrastructure/gateways';
import * as controllers from './infrastructure/controllers';
import { DebugController } from './infrastructure/controllers/debug.controller';

@Module({
  imports: [...Object.values(gateways)],
  controllers: [
    ...Object.values(controllers),
    ...Object.values(C),
    ...(process.env.NODE_ENV !== 'production' ? [DebugController] : []),
  ],
  providers: [
    GetLocaleUseCase,
    SetLocaleUseCase,
    GetMetricsUseCase,
    ...Object.values(useCases),
    {
      provide: Types.ClientDrivenPort,
      useClass: ClientRepositoryAdapter,
    },
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
    {
      provide: Types.EmbeddingDrivenPort,
      useClass: EmbeddingTensorflowAdapter,
    },
    {
      provide: Types.DocumentDrivenPort,
      useClass: DocumentRepositoryAdapter,
    },
  ],
})
export class CommonModule {}
