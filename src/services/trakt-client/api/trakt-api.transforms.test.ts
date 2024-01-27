import { describe, expect, it } from 'vitest';

import { TraktApiTransforms } from './trakt-api.transforms';

describe('trakt-api.transforms.ts', () => {
  it('should correctly drop minutes and seconds from an ISO 8601 date string', () => {
    expect.assertions(1);

    const timestamp = '2022-12-31T23:59:59Z';
    const expected = '2022-12-31T23:00:00Z';

    const result = TraktApiTransforms.date.dropMinutes(timestamp);
    expect(result).toBe(expected);
  });

  it('should correctly join array elements with a separator', () => {
    expect.assertions(1);

    const array = ['element1', 'element2', 'element3'];
    const expected = 'element1,element2,element3';

    const result = TraktApiTransforms.array.toString(array);
    expect(result).toBe(expected);
  });

  it('should correctly escape special characters for search', () => {
    expect.assertions(1);

    const input = 'search+query';
    const expected = 'search\\+query';

    const result = TraktApiTransforms.search.escape(input);
    expect(result).toBe(expected);
  });
});
