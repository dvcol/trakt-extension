import type { TmdbClientAuthentication } from '~/models/tmdb/tmdb-client.model';
import type { TraktClientAuthentication } from '~/models/trakt/trakt-authentication.model';
import type { TraktUserSettings } from '~/models/trakt/trakt-user.model';
import type { TvdbClientAuthentication } from '~/models/tvdb/tvdb-client.model';

export type SettingsAuth = {
  trakt?: TraktClientAuthentication;
  tvdb?: TvdbClientAuthentication;
  tmdb?: TmdbClientAuthentication;
};

export type UserSetting = (TraktUserSettings | Record<string, never>) & { isStaging?: boolean };
