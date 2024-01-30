import { traktService } from '~/services/trakt-client/trakt-client.service';
import { tvdbService } from '~/services/tvdb-client/tvdb-client.service';
import { useSettingsStore } from '~/stores/settings.store';

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
  });

  tvdbService.onCall(async call => {
    console.info('TvdbClient.onCall', call);
  });
};
