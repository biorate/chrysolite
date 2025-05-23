---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/index.tsx`) %>
unless_exists: true
---
import { container } from '@biorate/inversion';
import { Root } from './config';

container.get(Root).$run();

import('./view');
