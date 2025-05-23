---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/__mocks__/test.ts`) %>
unless_exists: true
---
import { injectable } from '@biorate/inversion';
import { Test as BaseTest } from '../../src/test';

@injectable()
export class Test extends BaseTest {
  public echo() {
    return `${super.echo()} world!`;
  }
}
