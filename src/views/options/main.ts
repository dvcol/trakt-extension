import defineComponent from '~/web/define-component';

defineComponent({ baseUrl: import.meta.env.VITE_BASE, view: { option: true } })
  .then(() => console.info('Web Component defined', import.meta.env))
  .catch(err => console.error('Failed to define component', err));
