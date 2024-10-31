import UFuzzy from '@leeoniya/ufuzzy';

export const isTrailer = (title: string) => title && /(trailer|teaser)/.test(title.toLowerCase());

let fuzzy: UFuzzy;
export const fuzzyMatch = (
  values: string[],
  search: string,
): {
  match: string[];
  highlight: string[];
  ids: { exact?: number; matches: number[]; order: number[]; info: { idx: number[]; ranges: number[][] } };
} => {
  if (!fuzzy) fuzzy = new UFuzzy();
  const matches = fuzzy.filter(values, search);
  if (matches === null || !matches.length) return { match: [], highlight: [], ids: { matches: [], order: [], info: { idx: [], ranges: [] } } };

  const info = fuzzy.info(matches, values, search);
  const order = fuzzy.sort(info, values, search);
  const match: string[] = order.map(idx => values[matches[idx]]);
  const highlight: string[] = order.map(idx => UFuzzy.highlight(values[info.idx[idx]], info.ranges[idx]));

  const exact = match.findIndex(m => m === search);
  if (exact !== -1) {
    match.splice(exact, 1);
    highlight.splice(exact, 1);
  }
  return { match, highlight, ids: { exact, matches, order, info } };
};
