---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/containers/layout/wrapper.tsx`) %>
unless_exists: true
---
import { styled } from 'styled-components';

export const Wrapper = styled.div<{ $offsetTop: number; $offsetBottom: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: ${({ $offsetTop }) => $offsetTop}px;
  margin-bottom: ${({ $offsetBottom }) => $offsetBottom}px;
`;
