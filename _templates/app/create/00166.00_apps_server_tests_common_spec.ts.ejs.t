---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/tests/common/spec.ts`) %>
unless_exists: true
---
import { timeout } from '@biorate/mocha';
import { Spec as CommonSpec } from '@biorate/mocha-spec';
import { container } from '@biorate/inversion';
import { Root } from '../../src/config';
import '../setup';

@timeout(2000)
export abstract class Spec extends CommonSpec {
  protected root: Root = container.get<Root>(Root);

  protected get httpServer() {
    return this.root.application.app.getHttpServer();
  }
}
