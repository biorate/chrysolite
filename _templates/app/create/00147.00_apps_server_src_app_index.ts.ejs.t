---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/index.ts`) %>
unless_exists: true
---
import { MiddlewareConsumer, Module } from '@nestjs/common';
<%- CLIENT ? "import { ServeStaticModule } from '@nestjs/serve-static';" : '' %>;
<%- CLIENT ? "import { path } from '@biorate/tools';" : '' %>;
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestCountMiddleware, ResponseTimeMiddleware } from '@biorate/nestjs-tools';
import { CommonModule } from './common';

@Module({
  imports: [
    <%- CLIENT ? `ServeStaticModule.forRoot({ rootPath: path.create(process.cwd(), '../${CLIENT_NAME}/dist'), }),` : '' -%>
    EventEmitterModule.forRoot({ verboseMemoryLeak: true }),
    ScheduleModule.forRoot(),
    CommonModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
    consumer.apply(RequestCountMiddleware).forRoutes('*');
  }
}
