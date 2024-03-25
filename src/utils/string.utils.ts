const regex = /(^\w|[.:]\s\w)/g;

export const sentenceCase = (input?: string) =>
  input?.toLowerCase().replace(regex, letter => {
    return letter.toUpperCase();
  });

export const capitalizeEachWord = (input: string) => input?.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());

export const deCapitalise = (input?: string) => {
  if (!input?.trim()) return input;
  if (input !== input.toUpperCase()) return input;
  return capitalizeEachWord(input);
};
