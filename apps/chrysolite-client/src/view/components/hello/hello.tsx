import { styled } from 'styled-components';

export const HelloWorld = styled.div<{ size: number }>`
  margin-top: -400px;
  margin-left: -100px;
  width: 230px;
  font-size: ${({ size }) => size}px;
`;
