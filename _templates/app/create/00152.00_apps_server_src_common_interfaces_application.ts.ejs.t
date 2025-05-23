---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/common/interfaces/application.ts`) %>
unless_exists: true
---
import { INestApplication } from '@nestjs/common';

export interface IApplication<T = any> {
  app: INestApplication<T>;
}
