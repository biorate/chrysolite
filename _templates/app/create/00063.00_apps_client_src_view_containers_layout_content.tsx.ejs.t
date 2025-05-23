---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/containers/layout/content.tsx`) %>
unless_exists: true
---
import { styled } from 'styled-components';

export const Content = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
`;
