---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tests/scenarios/scenario1.ts`) %>
unless_exists: true
---
import { expect, step, Scenario } from '@biorate/playwright';

export class Scenario1 extends Scenario {
  @step()
  protected async step1() {
    await this.page.goto('https://google.com/');
  }

  @step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
