import { tmdbService } from '~/services/tmdb-client/tmdb-client.service';
import { traktService } from '~/services/trakt-client/trakt-client.service';
import { tvdbService } from '~/services/tvdb-client/tvdb-client.service';
import { useSettingsStore } from '~/stores/settings.store';

export const initServices = async () => {
  const { setAuth, syncRestoreAuth } = useSettingsStore();

  const auth = await syncRestoreAuth();

  const restore = [];
  if (auth.trakt) restore.push(traktService.importAuthentication(auth.trakt).then(_auth => console.info('TraktClient.importAuthentication', _auth)));
  if (auth.tvdb) restore.push(tvdbService.importAuthentication(auth.tvdb).then(_auth => console.info('TvdbClient.importAuthentication', _auth)));
  if (auth.tmdb) console.info('TmdbClient.importAuthentication', tmdbService.importAuthentication(auth.tmdb));
  await Promise.all(restore);

  traktService.onAuthChange(_auth => {
    console.info('TraktClient.onAuthChange', _auth);
    setAuth({ trakt: _auth });
  });

  traktService.onCall(async call => {
    console.info('TraktClient.onCall', call);
  });

  tvdbService.onAuthChange(_auth => {
    console.info('TvdbClient.onAuthChange', _auth);
    setAuth({ tvdb: _auth });
  });

  tvdbService.onCall(async call => {
    console.info('TvdbClient.onCall', call);
  });

  tmdbService.onAuthChange(_auth => {
    console.info('TmdbClient.onAuthChange', _auth);
    setAuth({ tmdb: _auth });
  });

  tmdbService.onCall(async call => {
    console.info('TmdbClient.onCall', call);
  });
};
