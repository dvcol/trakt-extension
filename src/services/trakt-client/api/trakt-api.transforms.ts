export const TraktApiTransforms = {
  date: {
    /** Drop minutes and secondes from ISO 8601 date */
    dropMinutes: (timestamp: string) => timestamp.replace(/:\d{2}:\d{2}/, ':00:00'),
  },
  array: {
    /** Join array elements with separator (defaults to comma ',') */
    toString: <T extends string>(arrayOrString: T | T[], separator = ',') => {
      if (arrayOrString && Array.isArray(arrayOrString)) return arrayOrString.join(separator) as T;
      return arrayOrString as T;
    },
  },
  search: {
    /** Escape special characters (<b>+ - && || ! ( ) { } [ ] ^ " ~ * ? : /</b>) for search */
    escape: (input: string) => input.replace(/[+&|!{}[\]()^"~*?:/\\-]/g, '\\$&'),
  },
};
