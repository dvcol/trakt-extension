<script lang="ts" setup>
import { NFlex, NInput, NPopselect } from 'naive-ui';

import { computed, nextTick, type PropType, ref, toRefs } from 'vue';

import type { InputInst } from 'naive-ui';

import type { AliasScope } from '~/models/link.model';

import TextField from '~/components/common/typography/TextField.vue';

import { useLinksStore, useLinksStoreRefs } from '~/stores/settings/links.store';
import { useI18n } from '~/utils/i18n.utils';

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null,
  },
  scope: {
    type: String as PropType<AliasScope>,
    required: true,
  },
  options: {
    type: Array as PropType<string[]>,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: 'none',
  },
});

const { scope, id, placeholder, options } = toRefs(props);

const { aliasEnabled } = useLinksStoreRefs();
const { getAliasRef } = useLinksStore();

const alias = getAliasRef(scope.value, id);

const value = computed(() => {
  if (!id.value) return;
  return alias.value || placeholder.value;
});

const hover = ref(false);
const focus = ref(false);

const inputRef = ref<InputInst & { $el?: HTMLInputElement }>();

const onClick = async () => {
  if (!id.value || !aliasEnabled.value) return;
  hover.value = true;
  await nextTick();
  inputRef.value?.focus();
};

const popOptions = computed(() => {
  if (!options?.value) return [];
  return options.value.map(option => ({ label: option, value: option }));
});

const popWidth = computed(() => {
  const _input = inputRef?.value?.$el?.querySelector('input');
  if (!_input?.offsetWidth) return;
  return _input.offsetWidth + 32;
});

const i18n = useI18n('panel', 'alias');
</script>

<template>
  <NFlex
    v-if="aliasEnabled"
    class="alias-container"
    vertical
    size="large"
    justify="center"
  >
    <!--  Options select -->
    <NPopselect
      v-if="hover || focus"
      v-model:value="alias"
      class="alias-pop-select"
      :options="popOptions"
      :disabled="!popOptions?.length"
      :width="popWidth"
      placement="bottom-end"
      :style="{ '--custom-bg-color': 'var(--bg-color-70)' }"
      scrollable
    >
      <!--  Alias Input -->
      <NInput
        ref="inputRef"
        v-model:value="alias"
        class="alias-input"
        :placeholder="placeholder"
        clearable
        @focus="focus = true"
        @blur="focus = false"
        @mouseleave="hover = false"
      >
        <template #prefix>
          <span class="alias-prefix">{{ i18n('label') }}</span>
        </template>
      </NInput>
    </NPopselect>

    <!--  Alias  -->
    <TextField
      v-else
      class="alias-detail"
      :label="i18n('label')"
      :value="value"
      :skeleton="{ width: '6.25rem' }"
      @click="onClick"
    />
  </NFlex>
</template>

<style lang="scss" scoped>
.alias-container {
  box-sizing: border-box;
  min-height: 36px;
}

.alias-detail {
  border-top: 1px solid transparent;
}

.alias-input {
  margin: 0 -0.75rem;
  font-size: 1rem;

  .alias-prefix {
    min-width: var(--prefix-min-width, 4rem);
    margin-right: 0.5rem;
    color: var(--white-50);
    font-weight: 600;
  }
}
</style>
