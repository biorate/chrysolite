---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/scenarios/scenario2.ts`) %>
unless_exists: true
---
import { step, Scenario } from '@biorate/mocha';

export class Scenario2 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set('c', 3);
  }

  @step()
  protected async step2() {
    this.ctx.set('d', 4);
  }
}
