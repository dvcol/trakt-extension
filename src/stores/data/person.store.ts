import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive } from 'vue';

import type { TraktPersonExtended } from '@dvcol/trakt-http-client/models';

import type { ErrorDictionary } from '~/utils/retry.utils';

import { ErrorService } from '~/services/error.service';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';

import { TraktService } from '~/services/trakt.service';
import { useAuthSettingsStoreRefs } from '~/stores/settings/auth.store';
import { ErrorCount } from '~/utils/retry.utils';
import { clearProxy } from '~/utils/vue.utils';

type PersonDictionary = Record<string, TraktPersonExtended>;
type LoadingDictionary = Record<string, boolean>;

export const usePersonStore = defineStore('data.person', () => {
  const people = reactive<PersonDictionary>({});
  const loading = reactive<LoadingDictionary>({});

  const peopleErrors = reactive<ErrorDictionary>({});
  ErrorService.registerDictionary('person', peopleErrors);

  const clearState = () => {
    clearProxy(people);
    clearProxy(loading);
    clearProxy(peopleErrors);
  };

  const { isAuthenticated } = useAuthSettingsStoreRefs();
  const fetchPerson = async (id: string | number, force?: boolean) => {
    if (!isAuthenticated.value) {
      Logger.error('Cannot fetch person, user is not authenticated');
      return;
    }
    if (loading[id]) {
      Logger.warn('Already fetching person', id);
      return;
    }

    Logger.debug('Fetching person', id);

    loading[id] = true;

    try {
      people[id] = await TraktService.person(id, force);
      delete peopleErrors[id.toString()];
    } catch (error) {
      Logger.error('Failed to fetch person', id);
      NotificationService.error(`Failed to fetch person '${id}'.`, error);
      peopleErrors[id.toString()] = ErrorCount.fromDictionary(peopleErrors, id, error);
      throw error;
    } finally {
      loading[id] = false;
    }
  };

  const getPersonLoading = (id: string | number) => computed(() => loading[id.toString()]);
  const getPerson = (id: string | number) => computed(() => people[id.toString()]);

  return {
    clearState,
    fetchPerson,
    getPerson,
    getPersonLoading,
  };
});

export const usePersonStoreRefs = () => storeToRefs(usePersonStore());
