import { describe, expect, it } from 'vitest';

import { DateISO8601 } from '../../../utils/regex.utils';

import { TraktApiValidators } from './trakt-api.validators';

describe('trakt-api.validators.ts', () => {
  describe('date', () => {
    it('should correctly validate a date string in ISO 8601 format', () => {
      expect.assertions(1);

      const validDate = '2022-12-31T23:59:59Z';

      expect(TraktApiValidators.date(validDate, DateISO8601)).toBeTruthy();
    });

    it('should correctly validate a date string in ISO 8601 short format', () => {
      expect.assertions(1);

      const validDate = '2022-12-31';

      expect(TraktApiValidators.date(validDate)).toBeTruthy();
    });

    it('should throw for invalid string', () => {
      expect.assertions(1);

      const invalidDate = '31-12-2022';

      expect(() => TraktApiValidators.date(invalidDate)).toThrow();
    });
  });
});
