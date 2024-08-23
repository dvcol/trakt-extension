export const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .slice(1);

export const isTrailer = (title: string) => title && /(trailer|teaser)/.test(title.toLowerCase());
