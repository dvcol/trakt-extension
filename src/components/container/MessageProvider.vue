<script setup lang="ts">
import { useMessage } from 'naive-ui';

import { NotificationService } from '~/services/notification.service';

NotificationService.message = useMessage();
</script>

<template>
  <div id="message-provider" hidden style="display: none" />
</template>
