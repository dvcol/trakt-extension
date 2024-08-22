import type { SimklClientAuthentication } from '@dvcol/simkl-http-client/models';
import type { TmdbClientAuthentication } from '@dvcol/tmdb-http-client/models';
import type { TraktClientAuthentication, TraktUserSettings } from '@dvcol/trakt-http-client/models';

export type SettingsAuth = {
  trakt?: TraktClientAuthentication | null;
  simkl?: SimklClientAuthentication | null;
  tmdb?: TmdbClientAuthentication | null;
};

export type UserSetting = (TraktUserSettings | Record<string, never>) & { isStaging?: boolean };
