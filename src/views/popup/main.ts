import defineComponent from '~/web/define-component';

const root = document?.getElementById('app-popup');

if (root) {
  root.style.width = `${window.innerWidth}px`;
  root.style.height = `${window.innerHeight}px`;
}

defineComponent({ baseUrl: import.meta.env.VITE_BASE })
  .then(() => console.info('Web Component defined'))
  .catch(err => console.error('Failed to define component', err));
