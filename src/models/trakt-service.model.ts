import type { TmdbClientAuthentication } from '@dvcol/tmdb-http-client/models';
import type { TraktClientAuthentication, TraktUserSettings } from '@dvcol/trakt-http-client/models';
import type { TvdbClientAuthentication } from '@dvcol/tvdb-http-client/models';

export type SettingsAuth = {
  trakt?: TraktClientAuthentication;
  tvdb?: TvdbClientAuthentication;
  tmdb?: TmdbClientAuthentication;
};

export type UserSetting = (TraktUserSettings | Record<string, never>) & { isStaging?: boolean };
