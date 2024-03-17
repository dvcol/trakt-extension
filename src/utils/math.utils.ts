/**
 * Returns the maximum value of an array of objects by a given property
 * @param array - The array to search
 * @param prop - The property to compare
 * @param filter - Optional filter function
 */
export const arrayMax = <T>(array: Array<T>, prop: keyof T, filter?: (item: T) => boolean) =>
  array.reduce((prev, current) => {
    if (filter && !filter(current)) return prev;
    if (prev[prop] === undefined || (current[prop] !== undefined && current[prop] > prev[prop])) {
      return current;
    }
    return prev;
  });
