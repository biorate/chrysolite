---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/request/dto/info.ts`) %>
unless_exists: true
---
export type GETInfoREQ = unknown;

export type GETInfoRES = {
  ENV: string;

  version: string;

  name: string;
};
