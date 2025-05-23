---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/index.tsx`) %>
unless_exists: true
---
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './containers';

export const root = createRoot(document.getElementById('root')!);

root.render(<App />);
