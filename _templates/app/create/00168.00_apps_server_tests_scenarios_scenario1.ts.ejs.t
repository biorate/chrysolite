---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/scenarios/scenario1.ts`) %>
unless_exists: true
---
import { step, Scenario } from '@biorate/mocha';

export class Scenario1 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set('a', 1);
  }

  @step()
  protected async step2() {
    this.ctx.set('b', 2);
  }
}
