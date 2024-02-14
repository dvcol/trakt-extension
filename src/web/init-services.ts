import { tmdbService } from '~/services/tmdb-client/tmdb-client.service';
import { traktService } from '~/services/trakt-client/trakt-client.service';
import { tvdbService } from '~/services/tvdb-client/tvdb-client.service';
import { useAuthSettingsStore, useAuthSettingsStoreRefs, useUserSettingsStore, useUserSettingsStoreRefs } from '~/stores/settings.store';

export const initServices = async () => {
  const { setAuth, syncRestoreAuth, syncSetAuth } = useAuthSettingsStore();
  const { setUserSetting, syncRestoreUser } = useUserSettingsStore();

  const { user } = useUserSettingsStoreRefs();
  const { isAuthenticated } = useAuthSettingsStoreRefs();

  const restoredSettings = await syncRestoreUser();
  const restoredAuth = await syncRestoreAuth(restoredSettings?.user?.username);

  const restore = [];
  if (restoredAuth.trakt) restore.push(traktService.importAuthentication(restoredAuth.trakt).then(_auth => console.info('Trakt import', _auth)));
  if (restoredAuth.tvdb) restore.push(tvdbService.importAuthentication(restoredAuth.tvdb).then(_auth => console.info('Tvdb import', _auth)));
  if (restoredAuth.tmdb) console.info('TmdbClient.importAuthentication', tmdbService.importAuthentication(restoredAuth.tmdb));
  await Promise.all(restore);

  if (isAuthenticated.value && user.value === 'default') {
    console.info('TraktClient.users.settings', user.value);
    const settings = await traktService.users.settings().then(res => res.json());
    await setUserSetting(settings);
    await syncSetAuth();
  }

  traktService.onAuthChange(async (_auth, prev) => {
    console.info('TraktClient.onAuthChange', _auth, prev);
    if (_auth?.access_token !== prev?.access_token) {
      const settings = await traktService.users.settings().then(res => res.json());
      await setUserSetting(settings);
    }
    await setAuth({ trakt: _auth });
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
