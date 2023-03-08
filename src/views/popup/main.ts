import { createPinia } from 'pinia';
import { createApp } from 'vue';

import router from '../../router';

import PopupView from './PopupView.vue';
import '../../styles/base.css';

const app = createApp(PopupView);

app.use(createPinia());
app.use(router);

app.mount('#app');
