export const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .slice(1);
