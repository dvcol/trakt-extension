/**
 * Returns the maximum value of an array of objects by a given property
 * @param array - The array to search
 * @param prop - The property to compare
 * @param filter - Optional filter function
 */
export const arrayMax = <T>(array: Array<T>, prop: keyof T, filter?: (item: T) => boolean) =>
  array?.length
    ? array?.reduce((prev, current) => {
        if (filter && !filter(current)) return prev;
        if (prev[prop] === undefined || (current[prop] !== undefined && current[prop] > prev[prop])) {
          return current;
        }
        return prev;
      })
    : undefined;

export const findClosestMatch = (value: number, array?: string[]) => {
  if (!array?.length) return 'original';
  let closestMatch = array[0];
  let minDifference = Math.abs(value - parseInt(array[0].substring(1), 10));

  for (let i = 1; i < array.length; i += 1) {
    const currentValue = parseInt(array[i].substring(1), 10);
    const difference = Math.abs(value - currentValue);

    if (difference < minDifference) {
      minDifference = difference;
      closestMatch = array[i];
    }
  }

  if (!closestMatch) return 'original';
  if (Math.abs(parseInt(closestMatch.substring(1), 10)) * 2 < Math.abs(value)) return 'original';
  return closestMatch;
};
