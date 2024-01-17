import defineComponent from '~/web/define-component';

defineComponent({ baseUrl: import.meta.env.VITE_BASE })
  .then(() => console.info('Web Component defined', import.meta.env))
  .catch(err => console.error('Failed to define component', err));
