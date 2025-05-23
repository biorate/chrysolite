---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/tests/__mocks__/index.ts`) %>
unless_exists: true
---
import { container, Types } from '@biorate/inversion';
<% if (!CUT_EXAMPLES) { %>
import { Test } from './test';

container.unbind(Types.Test);
container.bind(Types.Test).to(Test).inSingletonScope();
<% } %>
