<script setup lang="ts">
import { useLoadingBar } from 'naive-ui';

import { LoadingBarService } from '~/services/loading-bar.service';

const loadingBar = useLoadingBar();

LoadingBarService.instance = loadingBar;
</script>
