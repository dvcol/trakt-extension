import { describe, expect, it } from 'vitest';

import { TraktEpisodeType } from '../../../models/trakt/trakt-episode.model';
import { TraktShowStatus } from '../../../models/trakt/trakt-show.model';

import {
  TraktApiCommonFilter,
  TraktApiEpisodeFilter,
  type TraktApiFilters,
  TraktApiFilterValidator,
  TraktApiRatingFilter,
  TraktApiShowFilter,
} from './trakt-api.filters';

import type { Primitive } from '../../../utils/typescript.utils';

describe('trakt-api.filters.ts', () => {
  describe('traktApiFilterValidator', () => {
    const validate = (filter: TraktApiFilters, value: Primitive | Primitive[]) => TraktApiFilterValidator.validate(filter, value, true);

    it('should correctly validate common filters', () => {
      expect.assertions(10);

      const singleValue = 'action';
      const multipleValue = ['action', 'adventure'];

      expect(validate(TraktApiCommonFilter.Query, singleValue)).toBeTruthy();
      expect(validate(TraktApiCommonFilter.Genres, multipleValue)).toBeTruthy();
      expect(() => validate(TraktApiCommonFilter.Query, multipleValue)).toThrow("Filter 'query' doesn't support multiple values.");

      expect(validate(TraktApiCommonFilter.Runtimes, '5-10')).toBeTruthy();
      expect(() => validate(TraktApiCommonFilter.Runtimes, '12')).toThrow("Filter 'runtimes' should be dash separated digits, i.e. \\d+-\\d+");

      expect(validate(TraktApiCommonFilter.Languages, 'fr')).toBeTruthy();
      expect(validate(TraktApiCommonFilter.Languages, ['en', 'fr'])).toBeTruthy();
      expect(() => validate(TraktApiCommonFilter.Languages, 'french')).toThrow("Filter 'languages' needs to be a 2 digit value.");

      expect(validate(TraktApiCommonFilter.Years, '2024')).toBeTruthy();
      expect(() => validate(TraktApiCommonFilter.Years, '12/12/2024')).toThrow("Filter 'years' needs to be a 4 digit value.");
    });

    it('should correctly validate rating filters', () => {
      expect.assertions(9);

      expect(validate(TraktApiRatingFilter.Ratings, '0-100')).toBeTruthy();

      expect(() => validate(TraktApiRatingFilter.Ratings, ['0-10', '0-100'])).toThrow("Filter 'ratings' doesn't support multiple values.");
      expect(() => validate(TraktApiRatingFilter.Ratings, '0-101')).toThrow("Filter 'ratings' should be a range between 0 and 100.");

      expect(validate(TraktApiRatingFilter.Votes, '0-100')).toBeTruthy();
      expect(() => validate(TraktApiRatingFilter.Votes, '0-300000')).toThrow("Filter 'votes' should be a range between 0 and 100 0000.");

      expect(validate(TraktApiRatingFilter.ImdbVotes, '0-300000')).toBeTruthy();
      expect(() => validate(TraktApiRatingFilter.ImdbVotes, '0-400000')).toThrow("Filter 'imdb_votes' should be a range between 0 and 300 0000.");

      expect(validate(TraktApiRatingFilter.TmdbRatings, '0.0-10.0')).toBeTruthy();
      expect(() => validate(TraktApiRatingFilter.TmdbRatings, '0-10')).toThrow("Filter 'tmdb_ratings' should be a range between 0.0 and 10.0.");
    });

    it('should correctly validate show filters', () => {
      expect.assertions(3);

      expect(validate(TraktApiShowFilter.Certifications, 'any value')).toBeTruthy();

      expect(validate(TraktApiShowFilter.Status, TraktShowStatus.Canceled)).toBeTruthy();
      expect(() => validate(TraktApiShowFilter.Status, 'invalid status')).toThrow("Filter 'status' is invalid: unknown status 'invalid status'.");
    });

    it('should correctly validate episode filters', () => {
      expect.assertions(3);

      expect(validate(TraktApiEpisodeFilter.Certifications, 'any value')).toBeTruthy();

      expect(validate(TraktApiEpisodeFilter.EpisodeTypes, TraktEpisodeType.MidSeasonFinale)).toBeTruthy();
      expect(() => validate(TraktApiEpisodeFilter.EpisodeTypes, 'invalid status')).toThrow(
        "Filter 'episode_types' is invalid: unknown episode type 'invalid status'.",
      );
    });
  });
});
