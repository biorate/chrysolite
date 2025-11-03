import { randomUUID } from 'crypto';
import { Types } from '@biorate/inversion';
import { path } from '@biorate/tools';
import { ScheduleModule } from '@nestjs/schedule';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { McpModule } from '@rekog/mcp-nest';
import {
  ClientRepositoryAdapter,
  DebugHttpAdapter,
  InfoRepositoryAdapter,
  OllamaEmbeddingHttpAdapter,
  DocumentRepositoryAdapter,
  OpenSerpHttpAdapter,
  LanggraphRagAdapter,
} from '@/app/adapter/';
import * as useCases from '@/app/application/service';
import * as gateways from '@/app/adapter/websocket';
import * as controllers from '@/app/adapter/http/in/';
import * as tools from '@/app/adapter/mcp/in/';
import { DebugController } from '@/app/adapter/http/in/debug.controller';
import {
  GetLocaleUseCase,
  GetMetricsUseCase,
  MetricsRepositoryAdapter,
  RequestCountMiddleware,
  ResponseTimeMiddleware,
  SetLocaleUseCase,
  controllers as C,
} from '@biorate/nestjs-tools';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.create(process.cwd(), '../chrysolite-client/dist'),
    }),
    EventEmitterModule.forRoot({ verboseMemoryLeak: true }),
    ScheduleModule.forRoot(),
    // McpModule.forRoot({
    //   name: 'chrysolite-mcp-server',
    //   version: '0.0.1',
    //   streamableHttp: {
    //     enableJsonResponse: false,
    //     sessionIdGenerator: () => randomUUID(),
    //     statelessMode: false,
    //   },
    // }),
    ...Object.values(gateways),
  ],
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
    ...Object.values(tools),
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
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
    consumer.apply(RequestCountMiddleware).forRoutes('*');
  }
}
