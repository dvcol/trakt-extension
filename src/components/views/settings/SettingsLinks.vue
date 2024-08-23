<script lang="ts" setup>
import {
  type FormInst,
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NLi,
  NP,
  NPopconfirm,
  NSelect,
  NSwitch,
  NText,
  NUl,
} from 'naive-ui';

import { computed, onActivated, reactive, ref, toRaw } from 'vue';

import IconClose from '~/components/icons/IconClose.vue';
import IconConfirm from '~/components/icons/IconConfirm.vue';
import IconPlus from '~/components/icons/IconPlus.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import SettingsFormItem from '~/components/views/settings/SettingsFormItem.vue';
import { AllDataSources, DataSource } from '~/models/source.model';
import { useSimklStoreRefs } from '~/stores/data/simkl.store';
import {
  AllCustomLinkScopes,
  type CustomLink,
  type CustomLinkDictionary,
  useLinksStore,
  useLinksStoreRefs,
} from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const i18n = useI18n('settings', 'links');

const { linkDictionary, aliasEnabled, openLinkInBackground } = useLinksStoreRefs();
const { addLink, removeLink } = useLinksStore();

const form = reactive<CustomLinkDictionary>(structuredClone(toRaw(linkDictionary.value)));

onActivated(() => {
  Object.assign(form, structuredClone(toRaw(linkDictionary.value)));
});

const links = computed(() => Object.values(linkDictionary.value));

const dirty = computed(() =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      JSON.stringify(value) !== JSON.stringify(linkDictionary.value[Number(key)]),
    ]),
  ),
);

const restore = (link: CustomLink) => {
  form[link.id] = structuredClone(toRaw(link));
};

const addOrUpdate = (link?: CustomLink) => {
  if (!link) {
    link = {
      id: links.value?.length,
      label: 'Custom Link All',
      url: 'https://example.com',
      scopes: AllCustomLinkScopes,
    };
    form[link.id] = link;
  }
  addLink(structuredClone(toRaw(link)));
};

const remove = (id: number) => {
  delete form[id];
  removeLink(id);
};

const scopeOptions = AllCustomLinkScopes.map(scope => ({
  label: i18n(scope, 'common', 'media', 'type'),
  value: scope satisfies string,
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
          <span class="keyword">{{ i18n(`template_keywords_${keyword}`) }}</span> -
          <span>{{ i18n(`template_keywords_${keyword}_description`) }}</span>
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

    <!--  Content  -->
    <NForm ref="formRef" :model="form">
      <TransitionGroup
        name="scale"
        tag="div"
        class="transition-container"
        :style="{ '--length': links?.length }"
      >
        <NCard
          v-for="(link, index) in links"
          :key="index"
          class="link-card"
          :style="{ '--n-border-color': 'var(--border-color)' }"
        >
          <NFormItem
            :label="i18n('label_name')"
            :path="`[${ index }].label`"
            :rule="{
              required: true,
              message: `Please input a unique name.`,
              trigger: ['input', 'blur'],
            }"
          >
            <NInput v-model:value="form[index].label" clearable />
          </NFormItem>

          <NFormItem
            :label="i18n('label_template')"
            class="form-row"
            :path="`[${ index }].url`"
            :rule="{
              required: true,
              message: `Please input a template url.`,
              trigger: ['input', 'blur'],
            }"
          >
            <NInput v-model:value="form[index].url" clearable />
          </NFormItem>
          <NFormItem
            :label="i18n('label_label')"
            class="form-row"
            :path="`[${ index }].url`"
          >
            <NInput
              v-model:value="form[index].title"
              placeholder="Defaults to the link url if empty."
              clearable
            />
          </NFormItem>

          <NFormItem :label="i18n('label_scopes')" :path="`[${ index }].scopes`">
            <NSelect
              v-model:value="form[index].scopes"
              multiple
              :to="containerRef"
              :options="
                scopeOptions.map(option => ({
                  ...option,
                  disabled:
                    form[index].scopes?.length === 1 &&
                    form[index].scopes[0] === option.value,
                }))
              "
            />
          </NFormItem>
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
              :disabled="!isDirty(form[index])"
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
              :disabled="isDisabled(form[index])"
              class="form-button"
              :type="getType(form[index])"
              secondary
              @click="addOrUpdate(form[index])"
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

.footer {
  padding: 0.5rem;
}
</style>
