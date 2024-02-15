<script setup lang="ts">
import { NAvatar, NDropdown, NEllipsis, NIcon, NSpace } from 'naive-ui';
import { computed, defineProps, h } from 'vue';

import IconAccount from '~/components/icons/IconAccount.vue';
import IconLogOut from '~/components/icons/IconLogOut.vue';

import { Route } from '~/router';
import { useUserSettingsStoreRefs } from '~/stores/settings.store';
import { Blurs, Colors } from '~/styles/colors.style';
import { useI18n } from '~/utils';

const i18n = useI18n('route');

const { userSetting } = useUserSettingsStoreRefs();

const avatar = computed(() => userSetting.value?.user?.images?.avatar?.full);
const username = computed(() => userSetting.value?.user?.username);

defineProps({
  parentElement: {
    type: HTMLElement,
    required: true,
  },
});

const options = [
  {
    label: 'Logout',
    key: 'logout',
    icon: () =>
      h(NIcon, null, {
        default: () => h(IconLogOut, { size: '1.5em' }),
      }),
  },
];
</script>

<template>
  <NDropdown
    trigger="hover"
    :options="options"
    :to="parentElement"
    placement="bottom-end"
    size="small"
    class="dropdown"
    :style="{
      'margin-top': '0.75rem',
      'margin-right': '-0.25rem',
      'text-align': 'left',
      'min-width': 'calc(100vw / 6 - 3px)',
      'background-color': Colors.bgBlurBlackHover,
      'backdrop-filter': Blurs.blur,
    }"
    @select="(...args: any[]) => console.info(args)"
  >
    <NSpace justify="space-around" align="center" :wrap="false">
      <NEllipsis
        style="
          max-width: calc(100vw / 6 - 0.25rem - 3px - 1.75rem);
          margin-right: 1.75rem;
          margin-left: 0.5rem;
        "
        :tooltip="{
          to: parentElement,
          placement: 'left',
          delay: 1000,
        }"
      >
        {{ username ?? i18n(Route.Settings.toLowerCase()) }}
      </NEllipsis>

      <NAvatar
        v-if="avatar"
        :src="avatar"
        round
        size="small"
        color="transparent"
        style="position: absolute; top: 3px; right: 0.5rem"
      />
      <NIcon v-else style="position: absolute; top: 0.4rem; right: 0.75rem" size="1.5em">
        <IconAccount />
      </NIcon>
    </NSpace>
  </NDropdown>
</template>
