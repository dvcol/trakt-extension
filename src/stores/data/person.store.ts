import { defineStore, storeToRefs } from 'pinia';

import { computed, reactive, ref } from 'vue';

import type { TraktPersonExtended } from '~/models/trakt/trakt-people.model';

import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import { logger } from '~/stores/settings/log.store';
import { asyncRefGetter } from '~/utils/vue.utils';

type PersonDictionary = Record<string, TraktPersonExtended>;
type LoadingDictionary = Record<string, boolean>;

export const usePersonStore = defineStore('data.person', () => {
  const people = reactive<PersonDictionary>({});
  const loading = reactive<LoadingDictionary>({});

  const clearState = () => {
    Object.assign(people, {});
    Object.assign(loading, {});
  };

  const fetchPerson = async (id: string | number) => {
    if (loading[id]) {
      logger.warn('Already fetching person', id);
      return;
    }

    logger.debug('Fetching person', id);

    loading[id] = true;

    try {
      people[id] = await TraktService.person(id);
    } catch (error) {
      logger.error('Failed to fetch person', id);
      NotificationService.error(`Failed to fetch person '${id}'.`, error);
      throw error;
    } finally {
      loading[id] = false;
    }
  };

  const getPersonLoading = (id: string | number) => computed(() => loading[id.toString()]);
  const getPerson = async (id: string | number) => {
    if (!people[id.toString()] && !loading[id.toString()]) await fetchPerson(id);
    return people[id.toString()];
  };
  const getPersonRef = (id: string | number, response = ref<TraktPersonExtended>()) =>
    asyncRefGetter(() => getPerson(id), getPersonLoading(id), response);

  return {
    clearState,
    fetchPerson,
    getPerson,
    getPersonRef,
    getPersonLoading,
  };
});

export const usePersonStoreRefs = () => storeToRefs(usePersonStore());
