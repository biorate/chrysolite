import { styled } from 'styled-components';

export const HelloWorld = styled.div<{ size: number }>`
  width: 230px;
  margin-top: -400px;
  margin-left: -100px;
  font-size: ${({ size }) => size}px;
`;
