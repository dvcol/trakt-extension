import { describe, expect, it } from 'vitest';

import { TraktClient } from './trakt-client';

describe('traktClient', () => {
  const test = new TraktClient();
  const fetch = vi.spyOn(global, 'fetch').mockResolvedValue(new Response());

  it('should query certifications with call method', async () => {
    expect.assertions(1);

    await test.certifications.call({
      type: 'movies',
    });

    expect(fetch).toHaveBeenCalledWith('https://api.trakt.tv/certifications/movies', {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '@dvcol/trakt-extension/1.2.0',
        'trakt-api-key': '4f2745eb6a58949bd35f4948b70d0dd7184462841052fa11f24d85edc1256a22',
        'trakt-api-version': '2',
      },
      method: 'GET',
    });
  });

  it('should query certifications with direct call', async () => {
    expect.assertions(1);

    await test.certifications({
      type: 'shows',
    });

    expect(fetch).toHaveBeenCalledWith('https://api.trakt.tv/certifications/shows', {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '@dvcol/trakt-extension/1.2.0',
        'trakt-api-key': '4f2745eb6a58949bd35f4948b70d0dd7184462841052fa11f24d85edc1256a22',
        'trakt-api-version': '2',
      },
      method: 'GET',
    });
  });

  it.skip('test', () => {
    test.certifications
      .call({
        type: 'shows',
      })
      .then(r => r.json());

    test.calendars.my.shows.get
      .call({
        start_date: '2009',
        days: 12,
        extended: 'full',
        filters: {
          query: '12',
          countries: [12, '13', true],
        },
      })
      .then(r => r.json());

    test.checkin.add
      .call({
        movie: {
          title: 'test',
          ids: {
            trakt: 28,
            slug: 'guardians-of-the-galaxy-2014',
            imdb: 'tt2015381',
            tmdb: 118340,
          },
          year: 206,
        },
      })
      .then(r => r.json());

    test.checkin.add
      .call({
        episode: {
          ids: {
            trakt: 28,
            imdb: 'tt2015381',
            tvdb: 123,
            tmdb: 118340,
          },
        },
        sharing: {
          mastodon: true,
          tumblr: false,
          twitter: false,
        },
      })
      .then(r => r.json());

    test.checkin.add
      .call({
        episode: {
          season: 12,
          number: 123,
        },
        show: {
          title: 'Breaking Bad',
          year: 2008,
          ids: {
            trakt: 1,
            slug: 'breaking-bad',
            tvdb: 81189,
            imdb: 'tt0903747',
            tmdb: 1396,
          },
        },
      })
      .then(r => r.json());

    test.checkin.add
      .call({
        episode: {
          number_abs: 12,
        },
        show: {
          title: 'Breaking Bad',
          year: 2008,
          ids: {
            trakt: 1,
            slug: 'breaking-bad',
            tvdb: 81189,
            imdb: 'tt0903747',
            tmdb: 1396,
          },
        },
      })
      .then(r => r.json());

    test.comments.comment.recent
      .call({
        pagination: {
          limit: 12,
        },
      })
      .then(r => r.json());
  });
});
