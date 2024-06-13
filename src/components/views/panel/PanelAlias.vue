<script lang="ts" setup>
import { NFlex, NInput } from 'naive-ui';
import { computed, nextTick, type PropType, ref, toRefs } from 'vue';

import type { InputInst } from 'naive-ui';

import TextField from '~/components/common/typography/TextField.vue';

import {
  type AliasScope,
  useLinksStore,
  useLinksStoreRefs,
} from '~/stores/settings/links.store';
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
  placeholder: {
    type: String,
    required: false,
    default: 'none',
  },
});

const { scope, id, placeholder } = toRefs(props);

const { aliasEnabled } = useLinksStoreRefs();
const { getAlias } = useLinksStore();

const alias = getAlias(scope.value, id);

const value = computed(() => {
  if (!id.value) return;
  return alias.value || placeholder.value;
});

const hover = ref(false);
const focus = ref(false);

const inputRef = ref<InputInst>();

const onClick = async () => {
  if (!id.value || !aliasEnabled.value) return;
  hover.value = true;
  await nextTick();
  inputRef.value?.focus();
};

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
    <!--  Alias Input -->
    <NInput
      v-if="hover || focus"
      ref="inputRef"
      v-model:value="alias"
      class="alias-input"
      :placeholder="placeholder"
      @focus="focus = true"
      @blur="focus = false"
      @mouseleave="hover = false"
    >
      <template #prefix>
        <span class="alias-prefix">{{ i18n('label') }}</span>
      </template>
    </NInput>

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
    min-width: 3rem;
    color: var(--white-50);
    font-weight: 600;
  }
}
</style>
