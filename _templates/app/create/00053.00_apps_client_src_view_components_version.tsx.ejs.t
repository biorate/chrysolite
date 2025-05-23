---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/components/version.tsx`) %>
unless_exists: true
---
import { styled } from 'styled-components';

export const Version = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  font-size: 10px;
`;


