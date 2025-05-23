---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tests/scenarios/scenario2.ts`) %>
unless_exists: true
---
import { expect, step, Scenario } from '@biorate/playwright';

export class Scenario2 extends Scenario {
  @step('Some title of step1')
  protected async step1() {
    await this.page.goto('https://playwright.dev/');
  }

  @step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }
}
