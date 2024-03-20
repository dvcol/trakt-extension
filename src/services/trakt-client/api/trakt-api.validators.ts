import { DateISO8601Short } from '~/utils/regex.utils';

export const TraktApiValidators = {
  date: (date: string, regex = DateISO8601Short) => {
    if (!regex.test(date)) {
      throw new Error(`Invalide 'start_date' format : ${date}`);
    }
    return true;
  },
} as const;
