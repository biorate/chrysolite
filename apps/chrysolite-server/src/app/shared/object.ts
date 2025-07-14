import { snakeCase, camelCase } from 'lodash';

export const transformProps = <I, O>(object: I, transform: (text: string) => string) => {
  const result: Record<string, unknown> = {};
  for (const field in object) result[transform(field)] = object[field];
  return <O>result;
};

export const propsToSnakeCase = <
  I = Record<string, unknown>,
  O = Record<string, unknown>,
>(
  object: I,
) => transformProps<I, O>(object, snakeCase);

export const propsToCamelCase = <
  I = Record<string, unknown>,
  O = Record<string, unknown>,
>(
  object: I,
) => transformProps<I, O>(object, camelCase);
