import { createPinia } from 'pinia';
import { createApp } from 'vue';

import router from '../../router';

import OptionView from './OptionView.vue';
import '../../styles/base.css';

const app = createApp(OptionView);

app.use(createPinia());
app.use(router);

app.mount('#app');
