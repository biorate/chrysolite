---
to: <%= h.server(!CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/00001.probes.spec.ts`) %>
unless_exists: true
---
import { expect } from 'chai';
import {
  suite,
  test,
  parallel,
  ContentType,
  Severity,
  allure,
  description,
  epic,
  feature,
  issue,
  owner,
  severity,
  story,
  tag,
  testCaseId,
  Context,
} from '@biorate/mocha';
import { Spec } from './common/spec';
import { isString } from './schemas';

@suite('Probes')
@parallel(false)
class Example extends Spec {
  protected static async after() {
    allure.attachment('Test attachment', 'test attachment content', ContentType.TEXT);
  }

  @issue('1')
  @testCaseId('1')
  @severity(Severity.MINOR)
  @epic('HTTP API tests')
  @feature('Readiness')
  @story('Probe')
  @owner('60000000')
  @tag('api')
  @description('Readiness probe test.')
  @test('/probe/readiness (GET)')
  protected async probeReadiness() {
    await this.validate({
      schema: isString,
      data: await this.supertest.get('/probe/readiness').expect(200),
      field: 'text',
    });
  }

  @issue('2')
  @testCaseId('2')
  @severity(Severity.MINOR)
  @epic('HTTP API tests')
  @feature('Healthz')
  @story('Probe')
  @owner('60000000')
  @tag('api')
  @description('Healthz probe test.')
  @test('/probe/healthz (GET)')
  protected async probeHealthz() {
    await this.validate({
      schema: isString,
      data: await this.supertest.get('/probe/healthz').expect(200),
      field: 'text',
    });
  }
}
