---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/schemas/scenarios.ts`) %>
unless_exists: true
---
import { IsNumber } from 'class-validator';

export class ScenariosSchema {
  @IsNumber()
  public a: number;

  @IsNumber()
  public b: number;

  @IsNumber()
  public c: number;

  @IsNumber()
  public d: number;
}
