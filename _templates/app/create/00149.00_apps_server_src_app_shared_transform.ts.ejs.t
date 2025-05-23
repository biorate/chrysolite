---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/shared/transform.ts`) %>
unless_exists: true
---
type IArgs = { obj: Record<string, any>; key: string };

export const toInt = ({ obj, key }: IArgs) => (obj[key] = parseInt(obj[key], 10));

export const toBool = ({ obj, key }: IArgs) => (obj[key] = obj[key] === 'true');
