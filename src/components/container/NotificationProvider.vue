<script setup lang="ts">
import { useNotification } from 'naive-ui';

import { NotificationService } from '~/services/notification.service';

NotificationService.notification = useNotification();
</script>

<template>
  <div id="notification-provider" hidden style="display: none" />
</template>
