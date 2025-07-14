type IArgs = { obj: Record<string, any>; key: string };

export const toInt = ({ obj, key }: IArgs) => (obj[key] = parseInt(obj[key], 10));

export const toFloat = ({ obj, key }: IArgs) => (obj[key] = parseFloat(obj[key]));

export const toBool = ({ obj, key }: IArgs) => (obj[key] = obj[key] === 'true');
