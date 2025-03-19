<script lang="ts" setup>
import { capitalizeEachWord, getUUID } from '@dvcol/common-utils/common/string';
import {
  type FormInst,
  type FormItemRule,
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NLi,
  NModal,
  NP,
  NPopconfirm,
  NSelect,
  NSwitch,
  NText,
  NUl,
  type SelectOption,
} from 'naive-ui';

import {
  type Component,
  computed,
  h,
  onActivated,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';

import IconClose from '~/components/icons/IconClose.vue';
import IconConfirm from '~/components/icons/IconConfirm.vue';
import IconDownload from '~/components/icons/IconDownload.vue';
import IconLoadingDots from '~/components/icons/IconLoadingDots.vue';
import IconPlus from '~/components/icons/IconPlus.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import {
  AllCustomLinkGenreModes,
  AllCustomLinkIconTypes,
  AllCustomLinkScopes,
  AllCustomLinkViews,
  type CustomLink,
  CustomLinkGenreMode,
  CustomLinkView,
  getCustomLinkIcon,
} from '~/models/link.model';
import { AllDataSources, DataSource } from '~/models/source.model';
import { AllTagTypes, TagType } from '~/models/tag.model';
import { Logger } from '~/services/logger.service';
import { NotificationService } from '~/services/notification.service';
import { useAppStateStoreRefs } from '~/stores/app-state.store';
import { useSimklStoreRefs } from '~/stores/data/simkl.store';
import {
  type CustomLinkDictionary,
  useLinksStore,
  useLinksStoreRefs,
} from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'links');

const {
  linkDictionary,
  aliasEnabled,
  openLinkInActiveTab,
  openLinkInBackground,
  exporting,
} = useLinksStoreRefs();
const { addLink, removeLink, exportLinks } = useLinksStore();

const { root } = useAppStateStoreRefs();
const openImport = ref(false);
const linksImport = ref('');

const isValidLink = (link: unknown): link is CustomLink => {
  if (typeof link !== 'object' || link === null) return false;
  if (!('label' in link)) return false;
  if (typeof link.label !== 'string' || !link.label.trim().length) return false;
  if (!('scopes' in link)) return false;
  if (!Array.isArray(link.scopes) || !link.scopes.length) return false;
  return 'url' in link && typeof link.url === 'string' && !!link.url?.trim().length;
};

const parseLinkImport = (_links = linksImport.value): CustomLink[] => {
  const parsed = JSON.parse(_links);
  if (Array.isArray(parsed)) return parsed;
  if (isValidLink(parsed)) return [parsed];
  return Object.values(parsed);
};

const linksValidator: FormItemRule = {
  required: true,
  validator: () => {
    if (!linksImport.value?.trim()) return true;
    try {
      return parseLinkImport(linksImport.value)?.every(isValidLink);
    } catch (err) {
      Logger.debug('Error parsing import link JSON', err);
      return new Error(i18n('import_links_modal_validation_json'));
    }
  },
  message: i18n('import_links_modal_validation_json'),
  trigger: ['input', 'blur'],
};

const form = reactive<CustomLinkDictionary>(structuredClone(toRaw(linkDictionary.value)));

onActivated(() => {
  watch(
    linkDictionary,
    _dictionary => {
      const _dirty = structuredClone(toRaw(form));
      Object.assign(form, structuredClone(toRaw(_dictionary)));
      Object.entries(form).forEach(([key, value]) => {
        if (!_dirty[key]) return;
        form[key] = _dirty[key];
      });
    },
    {
      immediate: true,
      deep: true,
    },
  );
});

const links = computed(() => Object.values(linkDictionary.value));

const dirty = computed(() =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      JSON.stringify(value) !== JSON.stringify(linkDictionary.value[key]),
    ]),
  ),
);

const restore = (link: CustomLink) => {
  form[link.id] = structuredClone(toRaw(link));
};

const addOrUpdate = (link?: CustomLink) => {
  if (!link) {
    link = {
      id: `${links.value?.length ?? 0}-${getUUID()}`,
      label: 'Custom Link All',
      url: 'https://example.com',
      scopes: AllCustomLinkScopes,
      view: CustomLinkView.Panel,
      genres: [],
      genreMode: CustomLinkGenreMode.Some,
      type: TagType.Default,
      bordered: true,
    } satisfies CustomLink;
  }
  if (link.genres?.length) link.genres = link.genres.map(capitalizeEachWord);

  addLink(structuredClone(toRaw(link)));
  NotificationService.message.success(i18n('link_save_success'));
};

const importLinks = () => {
  try {
    const length = links.value?.length ?? 0;
    parseLinkImport()
      .map((link, index) => ({
        ...structuredClone(link),
        id: `${length + index}-${getUUID()}`,
      }))
      .forEach(addLink);
    openImport.value = false;
    linksImport.value = '';
    NotificationService.message.success(i18n('import_links_success'));
  } catch (err) {
    Logger.error('Error importing links', err);
    NotificationService.error(i18n('import_links_failure'), err);
  }
};

const exportCustomLinks = async () => {
  if (!(await exportLinks())) return;
  NotificationService.message.success(i18n('export_links_success'));
};

const remove = (id: CustomLink['id']) => {
  removeLink(id);
  NotificationService.message.success(i18n('link_remove_success'));
};

const scopeOptions = AllCustomLinkScopes.map(scope => ({
  label: i18n(scope, 'common', 'media', 'type'),
  value: scope satisfies string,
}));

const viewOptions = AllCustomLinkViews.map(view => ({
  label: i18n(view, 'common', 'link', 'view'),
  value: view satisfies string,
}));

const genreOptions = AllCustomLinkGenreModes.map(genre => ({
  label: i18n(genre, 'common', 'link', 'genre'),
  value: genre satisfies string,
}));

type IconOption = SelectOption & { icon: Component };
const iconOptions = AllCustomLinkIconTypes.map(icon => ({
  label: i18n(icon, 'common', 'link', 'icon'),
  value: icon satisfies string,
  icon: getCustomLinkIcon(icon).icon,
}));

const renderLabel = (option: IconOption) => [
  h(NIcon, {
    style: {
      verticalAlign: '-0.15em',
      marginRight: '0.7em',
    },
    component: option.icon,
  }),
  option.label?.toString(),
];

const colorOptions = AllTagTypes.map(type => ({
  label: i18n(type, 'common', 'tag', 'type'),
  value: type satisfies string,
}));

const isValid = (link: CustomLink) => {
  return (
    link.label.trim().length > 0 && link.url.trim().length > 0 && link.scopes.length > 0
  );
};

const isDirty = (link: CustomLink) => {
  return dirty.value[link.id];
};

const isDisabled = (link: CustomLink) => {
  return !isDirty(link) || !isValid(link);
};

const getType = (link: CustomLink) => {
  if (!isDirty(link)) return 'default';
  if (!isValid(link)) return 'warning';
  return 'success';
};

const { simklEnabled } = useSimklStoreRefs();
const defaultKeywords = ['season', 'episode', 'title', 'alias'];
const keywords = computed(() => {
  if (simklEnabled.value) return [...AllDataSources, ...defaultKeywords];
  return [
    DataSource.Trakt,
    DataSource.Imdb,
    DataSource.Imdb,
    DataSource.Tvdb,
    ...defaultKeywords,
  ];
});

const formRef = ref<FormInst>();
const containerRef = ref<HTMLDivElement>();
</script>

<template>
  <div ref="containerRef" class="links-container">
    <!--  Header  -->
    <SettingsFormItem :label="i18n('label_show_hide')">
      <NSwitch v-model:value="aliasEnabled" class="form-switch">
        <template #checked>{{ i18n('show', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('hide', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
    <SettingsFormItem :label="i18n('label_open_in_active_tab')">
      <NSwitch v-model:value="openLinkInActiveTab" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>
    <SettingsFormItem :label="i18n('label_open_in_background')">
      <NSwitch v-model:value="openLinkInBackground" class="form-switch">
        <template #checked>{{ i18n('on', 'common', 'button') }}</template>
        <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
      </NSwitch>
    </SettingsFormItem>

    <NP class="template-description">
      <NText>{{ i18n('template_description') }}</NText>

      <div class="keywords-header">{{ i18n('template_keywords_header') }}</div>

      <NUl class="keywords-list">
        <NLi v-for="keyword of keywords" :key="keyword" class="item">
          <span class="keyword">{{ i18n(`template_keywords_${ keyword }`) }}</span> -
          <span>{{ i18n(`template_keywords_${ keyword }_description`) }}</span>
        </NLi>
      </NUl>

      <NP class="keywords-example">
        <NText class="header">{{ i18n('template_example_line_1') }}</NText>
        <code class="code">
          <span>{{ i18n('template_example_template') }}</span>
        </code>
        <NText class="header">{{ i18n('template_example_line_2') }}</NText>
        <code class="code">
          <span>{{ i18n('template_example_result') }}</span>
        </code>
      </NP>
    </NP>

    <SettingsFormItem :label="i18n('export_links')">
      <NButton
        class="export-button"
        type="info"
        secondary
        :disabled="exporting"
        @click="exportCustomLinks()"
      >
        <span>
          {{ i18n(exporting ? 'exporting' : 'export', 'common', 'button') }}
        </span>
        <template #icon>
          <NIcon :component="exporting ? IconLoadingDots : IconDownload" />
        </template>
      </NButton>
    </SettingsFormItem>

    <SettingsFormItem :label="i18n('import_links')">
      <NButton
        class="export-button"
        type="info"
        secondary
        :disabled="openImport"
        @click="openImport = true"
      >
        <span>
          {{ i18n(exporting ? 'importing' : 'import', 'common', 'button') }}
        </span>
        <template #icon>
          <NIcon :component="openImport ? IconLoadingDots : IconDownload" />
        </template>
      </NButton>
    </SettingsFormItem>

    <NModal v-model:show="openImport" :to="root" block-scroll>
      <NCard
        class="import-card"
        :style="{ '--n-border-color': 'var(--border-color)' }"
        :title="i18n('import_links')"
      >
        <NFormItem
          :label="i18n('import_links_modal_label')"
          class="form-row"
          :rule="linksValidator"
        >
          <NInput
            v-model:value="linksImport"
            type="textarea"
            :placeholder="i18n('import_links_modal_placeholder')"
            rows="15"
            autofocus
          />
        </NFormItem>

        <NFlex class="form-row" align="center" justify="flex-end">
          <NButton
            :disabled="exporting"
            class="form-button"
            type="error"
            secondary
            @click="openImport = false"
          >
            <span>{{ i18n('cancel', 'common', 'button') }}</span>
            <template #icon>
              <NIcon :component="IconClose" />
            </template>
          </NButton>
          <NButton
            :disabled="exporting || !linksImport?.trim()?.length"
            class="form-button"
            type="success"
            secondary
            @click="importLinks()"
          >
            <span>{{ i18n('save', 'common', 'button') }}</span>
            <template #icon>
              <NIcon :component="IconConfirm" />
            </template>
          </NButton>
        </NFlex>
      </NCard>
    </NModal>

    <!--  Content  -->
    <NForm ref="formRef" :model="form">
      <TransitionGroup
        name="scale"
        tag="div"
        class="transition-container"
        :style="{ '--length': links?.length }"
      >
        <NCard
          v-for="link in links"
          :key="link.id"
          class="link-card"
          :style="{ '--n-border-color': 'var(--border-color)' }"
        >
          <NFlex class="form-row">
            <NFormItem
              class="flex-auto"
              :label="i18n('label_name')"
              :path="`[${ link.id }].label`"
              :rule="{
                required: true,
                message: i18n('validation_unique_name'),
                trigger: ['input', 'blur'],
              }"
            >
              <NInput v-model:value="form[link.id].label" clearable />
            </NFormItem>

            <NFormItem
              class="flex-auto"
              :label="i18n('label_short')"
              :path="`[${ link.id }].short`"
            >
              <NInput
                v-model:value="form[link.id].short"
                :placeholder="i18n('placeholder_short')"
                clearable
              />
            </NFormItem>
          </NFlex>

          <NFormItem
            :label="i18n('label_template')"
            class="form-row"
            :path="`[${ link.id }].url`"
            :rule="{
              required: true,
              message: i18n('validation_template_required'),
              trigger: ['input', 'blur'],
            }"
          >
            <NInput v-model:value="form[link.id].url" clearable />
          </NFormItem>

          <NFormItem
            :label="i18n('label_label')"
            class="form-row"
            :path="`[${ link.id }].title`"
          >
            <NInput
              v-model:value="form[link.id].title"
              :placeholder="i18n('link_placeholder')"
              clearable
            />
          </NFormItem>

          <NFlex class="form-row">
            <NFormItem
              class="flex-auto"
              :label="i18n('label_scopes')"
              :path="`[${ link.id }].scopes`"
            >
              <NSelect
                v-model:value="form[link.id].scopes"
                multiple
                :to="containerRef"
                :options="
                  scopeOptions.map(option => ({
                    ...option,
                    disabled:
                      form[link.id].scopes?.length === 1 &&
                      form[link.id].scopes[0] === option.value,
                  }))
                "
              />
            </NFormItem>

            <NFormItem
              class="form-select"
              :label="i18n('label_view')"
              :path="`[${ link.id }].view`"
            >
              <NSelect
                v-model:value="form[link.id].view"
                :default-value="CustomLinkView.Panel"
                :to="containerRef"
                :options="viewOptions"
              />
            </NFormItem>
          </NFlex>

          <NFlex class="form-row">
            <NFormItem
              class="flex-auto"
              :label="i18n('label_genres')"
              :path="`[${ link.id }].genres`"
            >
              <NSelect
                v-model:value="form[link.id].genres"
                :placeholder="i18n('placeholder_genres')"
                :to="containerRef"
                :show-arrow="false"
                :show="false"
                filterable
                multiple
                tag
              />
            </NFormItem>

            <NFormItem
              class="form-select"
              :label="i18n('label_genre_mode')"
              :path="`[${ link.id }].genreMode`"
            >
              <NSelect
                v-model:value="form[link.id].genreMode"
                :to="containerRef"
                :default-value="CustomLinkGenreMode.Some"
                :options="genreOptions"
              />
            </NFormItem>
          </NFlex>

          <NFlex class="form-row">
            <NFormItem
              class="form-select"
              :label="i18n('label_color')"
              :path="`[${ link.id }].type`"
            >
              <NSelect
                v-model:value="form[link.id].type"
                class="color-select"
                :class="{ [form[link.id].type as string]: true }"
                :to="containerRef"
                :default-value="TagType.Default"
                :options="colorOptions"
              />
            </NFormItem>

            <NFormItem
              class="flex-auto"
              :label="i18n('label_icon')"
              :path="`[${ link.id }].iconType`"
            >
              <NSelect
                v-model:value="form[link.id].iconType"
                :to="containerRef"
                :options="iconOptions"
                :render-label="renderLabel"
                type="error"
                clearable
              />
            </NFormItem>

            <NFormItem
              class="form-toggle"
              :label="i18n('label_icon_only')"
              :path="`[${ link.id }].iconOnly`"
            >
              <NSwitch v-model:value="form[link.id].iconOnly" class="flex-auto">
                <template #checked>{{ i18n('on', 'common', 'button') }}</template>
                <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
              </NSwitch>
            </NFormItem>

            <NFormItem
              class="form-toggle"
              :label="i18n('label_bordered')"
              :path="`[${ link.id }].bordered`"
            >
              <NSwitch v-model:value="form[link.id].bordered" class="flex-auto">
                <template #checked>{{ i18n('on', 'common', 'button') }}</template>
                <template #unchecked>{{ i18n('off', 'common', 'button') }}</template>
              </NSwitch>
            </NFormItem>
          </NFlex>

          <NFlex class="form-row" align="center" justify="flex-end">
            <NPopconfirm
              :to="containerRef"
              :show-icon="false"
              placement="bottom"
              :on-positive-click="() => remove(link.id)"
              :positive-button-props="{ type: 'error', secondary: true }"
              :negative-button-props="{ secondary: true }"
            >
              <span>{{ i18n('confirm_remove') }}</span>
              <template #trigger>
                <NButton class="form-button" type="error" secondary>
                  <span>{{ i18n('remove', 'common', 'button') }}</span>
                  <template #icon>
                    <NIcon :component="IconClose" />
                  </template>
                </NButton>
              </template>
            </NPopconfirm>
            <NButton
              :disabled="!isDirty(form[link.id])"
              class="form-button"
              type="info"
              secondary
              @click="restore(link)"
            >
              <span>{{ i18n('restore', 'common', 'button') }}</span>
              <template #icon>
                <NIcon :component="IconRestore" />
              </template>
            </NButton>
            <NButton
              :disabled="isDisabled(form[link.id])"
              class="form-button"
              :type="getType(form[link.id])"
              secondary
              @click="addOrUpdate(form[link.id])"
            >
              <span>{{ i18n('save', 'common', 'button') }}</span>
              <template #icon>
                <NIcon :component="IconConfirm" />
              </template>
            </NButton>
          </NFlex>
        </NCard>
      </TransitionGroup>
    </NForm>

    <!--   Footer   -->
    <NFlex class="form-row footer" align="center" justify="center">
      <NButton tertiary type="info" @click="addOrUpdate()">
        <span>{{ i18n('new_custom_link') }}</span>
        <template #icon>
          <NIcon :component="IconPlus" />
        </template>
      </NButton>
    </NFlex>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/mixin' as mixin;
@use '~/styles/transition' as transition;
@include transition.scale;

.links-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.transition-container {
  min-height: calc(var(--length) * 25.75rem);
  transition: min-height 0.75s var(--n-bezier);
  transition-delay: 0.45s;
}

.import-card {
  position: absolute;
  top: 50%;
  left: calc(50% + 3rem);
  max-width: 75%;
  transform: translate(-50%, -50%);
}

.import-card,
.link-card {
  --border-color: var(--white-10);

  background: var(--bg-black-soft);

  &:active,
  &:focus-within,
  &:hover {
    --border-color: var(--white-15);
  }

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
}

.template-description {
  margin: 0;
  font-size: 1rem;
  white-space: pre-wrap;

  .keywords {
    &-header {
      margin-top: 1rem;
    }

    &-list {
      margin: 1rem;

      .keyword {
        color: var(--white-mute);
        font-weight: 600;
        transition: color 0.3s var(--n-bezier);
      }
    }

    &-example {
      margin: 1.5rem 0;

      .code {
        display: flex;
        justify-content: center;
        margin: 1rem;
        color: var(--white);
        font-weight: 400;

        span {
          padding: 0.25ch 1ch;
          background: var(--code-grey);
          border-radius: 4px;
        }
      }
    }
  }
}

.flex-auto {
  flex: 1 1 auto;
}

.form-select {
  flex: 0 1 8.75rem;
}

.form-toggle {
  flex: 0 1 4rem;
}

.form-switch {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  min-width: 5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}

.form-row {
  width: 100%;
}

.form-button {
  margin-left: 0.25rem;

  i {
    margin-left: calc(0% - var(--n-icon-margin));
  }
}

/* stylelint-disable selector-class-pattern -- library class name */
.color-select {
  :deep(.n-base-selection-input__content) {
    transition: color 0.5s var(--n-bezier);
  }

  &.warning {
    :deep(.n-base-selection-input__content) {
      color: var(--color-warning);
    }
  }

  &.primary,
  &.success {
    :deep(.n-base-selection-input__content) {
      color: var(--color-primary);
    }
  }

  &.error {
    :deep(.n-base-selection-input__content) {
      color: var(--color-error);
    }
  }

  &.info {
    :deep(.n-base-selection-input__content) {
      color: var(--color-info);
    }
  }
}

.footer {
  padding: 0.5rem;
}
</style>
