import defineComponent from '~/web/define-component';

defineComponent({ baseUrl: import.meta.env.VITE_BASE, view: { option: true, web: import.meta.env.VITE_WEB ?? false } })
  .then(() => console.info('Web Component defined', import.meta.env))
  .catch(err => console.error('Failed to define component', err));
