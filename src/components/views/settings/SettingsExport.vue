<script lang="ts" setup>
import {
  TraktApiExtended,
  type TraktClientPagination,
} from '@dvcol/trakt-http-client/models';
import { NButton, NIcon, NProgress } from 'naive-ui';

import { reactive, ref } from 'vue';

import type { CancellableWritePromise } from '~/utils/trakt-service.utils';

import IconDownload from '~/components/icons/IconDownload.vue';
import IconLoadingDots from '~/components/icons/IconLoadingDots.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';

import { PageSize } from '~/models/page-size.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { TraktService } from '~/services/trakt.service';
import {
  isDefaultList,
  type ListEntity,
  ListType,
  type ListTypes,
  useListsStoreRefs,
} from '~/stores/data/list.store';
import { useUserSettingsStoreRefs } from '~/stores/settings/user.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'export');
const { user, userSetting } = useUserSettingsStoreRefs();

const { lists } = useListsStoreRefs();

const loading = reactive<Record<string | number, boolean>>({});
const cancelled = reactive<Record<string | number, boolean>>({});
const fetching = reactive<
  Record<string | number, CancellableWritePromise<unknown> | undefined>
>({});
const pagination = reactive<
  Record<string | number, Partial<TraktClientPagination> | undefined>
>({});

type ExportScope<T extends Promise<unknown> = CancellableWritePromise<unknown>> = {
  label: string;
  name: string;
  click: () => T;
};
const getOnClick = (scope: ExportScope, index: number) => async () => {
  loading[index] = true;

  try {
    if (fetching[index]) {
      fetching[index]?.cancel();
      cancelled[index] = true;
      await fetching[index];
      NotificationService.message.warning(`${scope.name} ${i18n('export_aborted')}`);
    } else {
      fetching[index] = scope.click();
      pagination[index] = fetching[index]?.pagination;
      await fetching[index];
      if (cancelled[index]) {
        NotificationService.message.success(`${scope.name} ${i18n('export_success')}`);
      }
    }
  } catch (error) {
    Logger.error(`Failed to export '${scope.name}'.`, error);
    NotificationService.error(`${scope.name} ${i18n('export_failure')}`, error);
  } finally {
    cancelled[index] = false;
    delete fetching[index];
    delete pagination[index];
    loading[index] = false;
  }
};

const fetchData = (type: ListTypes, name: string, entity?: ListEntity) => {
  const writer = {
    picker: {
      suggestedName: [
        isDefaultList(type) || type === ListType.History
          ? i18n(`export_${name}_name`)
          : `${i18n(`export_${type}_name`)}_${name}`,
        user.value,
        new Date().toISOString(),
      ]
        .join('_')
        .replace(' ', '_')
        .toLowerCase(),
    },
    separator: ',',
  };

  switch (type) {
    case 'history':
      return TraktService.export.history({ writer });
    case 'watchlist':
      return TraktService.export.watchlist({ writer });
    case 'collection':
      if (!entity?.scope) throw new Error('Entity scope is required for export.');
      return TraktService.export.collection({
        payload: {
          type: entity.scope,
          extended: TraktApiExtended.Full,
        },
        writer,
      });
    case 'favorites':
      return TraktService.export.favorites({ writer });
    case 'list':
      if (!entity) throw new Error('List entity is required for export.');
      return TraktService.export.list({
        payload: {
          id: user.value,
          list_id: entity.id.toString(),
          extended: TraktApiExtended.Full,
          pagination: { limit: PageSize.p1000 },
        },
        writer,
      });
    default:
      throw new Error(`Unsupported list type: ${type}`);
  }
};

const scopes: ExportScope[] = [
  {
    label: i18n('export_history'),
    name: i18n('export_history_name'),
    click: () => fetchData(ListType.History, ListType.History),
  },
  ...(lists.value?.map(list => {
    const name = isDefaultList(list) ? i18n(list.name, 'list') : list.name;
    return {
      label: `${i18n('export_list')} ${name}`,
      name,
      click: () => fetchData(list.type, list.name, list),
    };
  }) ?? []),
];

const exportScope: ExportScope<Promise<unknown>>[] = scopes.map((item, index) => ({
  ...item,
  click: getOnClick(item, index),
}));

const getProgress = (index: number) => {
  if (!pagination[index]?.pageCount) return;
  return [
    i18n('export_progress_1'),
    pagination[index]?.page,
    i18n('export_progress_2'),
    pagination[index]?.pageCount,
  ].join(' ');
};

const getProgressPercentage = (index: number) => {
  if (!pagination[index]?.pageCount || !pagination[index]?.page) return;
  return (pagination[index]!.page! / pagination[index]!.pageCount!) * 100;
};

const container = ref();
</script>

<template>
  <div ref="container" class="cache-container">
    <!--  Scope export  -->
    <SettingsFormItem
      v-for="({ label, click }, index) in exportScope"
      :key="index"
      :label="label"
      :warning="getProgress(index)"
    >
      <NButton
        class="export-button"
        :type="fetching[index] ? 'error' : 'info'"
        secondary
        :disabled="cancelled[index]"
        @click="click"
      >
        <span>
          {{ i18n(fetching[index] ? 'export_cancel' : 'export', 'common', 'button') }}
        </span>
        <template #icon>
          <NIcon :component="loading[index] ? IconLoadingDots : IconDownload" />
        </template>
      </NButton>
      <NProgress
        v-if="pagination[index]?.pageCount"
        class="export-line"
        type="line"
        status="warning"
        :percentage="getProgressPercentage(index)"
        :show-indicator="false"
        :theme-overrides="{
          railHeight: 'var(--rail-height)',
        }"
      />
    </SettingsFormItem>
  </div>
</template>

<style lang="scss" scoped>
.cache-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.export-button {
  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }
}

.export-line {
  --rail-height: 2px;

  position: absolute;
  bottom: calc(var(--rail-height) * -1);
  border-radius: 0;
}

.form-select {
  min-width: 10rem;
}
</style>
