import { Module } from '@nestjs/common';
import { MetricsRepositoryAdapter } from '@biorate/nestjs-tools';
import { Types } from '@biorate/inversion';
import {
  ClientRepositoryAdapter,
  DocumentRepositoryAdapter,
  InfoRepositoryAdapter,
} from '@/app/adapter/persistant';
import {
  DebugHttpAdapter,
  OllamaEmbeddingHttpAdapter,
  OpenSerpHttpAdapter,
} from '@/app/adapter/http/out';
import { LanggraphRagAdapter } from '@/app/adapter/rag';

@Module({
  providers: [
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
      useClass: OllamaEmbeddingHttpAdapter,
    },
    {
      provide: Types.DocumentDrivenPort,
      useClass: DocumentRepositoryAdapter,
    },
    {
      provide: Types.LanggraphRagAdapter,
      useClass: LanggraphRagAdapter,
    },
    {
      provide: Types.OpenSerpDrivenPort,
      useClass: OpenSerpHttpAdapter,
    },
  ],
  get exports() {
    return this.providers;
  },
})
export class AdapterModule {}
