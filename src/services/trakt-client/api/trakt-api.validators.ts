import { DateISO8601 } from '~/utils/regex.utils';

export const TraktApiValidators = {
  date: (date: string) => {
    if (!DateISO8601.test(date)) {
      throw new Error(`Invalide 'start_date' format : ${date}`);
    }
    return true;
  },
} as const;
