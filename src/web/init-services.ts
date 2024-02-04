import { tmdbService } from '~/services/tmdb-client/tmdb-client.service';
import { traktService } from '~/services/trakt-client/trakt-client.service';
import { tvdbService } from '~/services/tvdb-client/tvdb-client.service';
import { useSettingsStore } from '~/stores/settings.store';
import { storage } from '~/utils/browser/browser-storage.utils';

export const initServices = async () => {
  const { setAuth, syncRestoreAuth } = useSettingsStore();

  const auth = await syncRestoreAuth();

  if (auth) traktService.importAuthentication(auth).then(() => console.info('TraktClient.importAuthentication', auth));

  traktService.onAuthChange(_auth => {
    console.info('TraktClient.onAuthChange', _auth);
    setAuth(_auth);
  });

  traktService.onCall(async call => {
    console.info('TraktClient.onCall', call);
  });

  tvdbService.onAuthChange(_auth => {
    console.info('TvdbClient.onAuthChange', _auth);
    // TODO move this to store
    storage.sync.set('todo.tvdb.auth', _auth);
  });

  tvdbService.onCall(async call => {
    console.info('TvdbClient.onCall', call);
  });

  tmdbService.onAuthChange(_auth => {
    console.info('TmdbClient.onAuthChange', _auth);
    // TODO move this to store
    storage.sync.set('todo.tmdb.auth', _auth);
  });

  tmdbService.onCall(async call => {
    console.info('TmdbClient.onCall', call);
  });
};
