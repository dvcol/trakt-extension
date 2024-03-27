import defineComponent from '~/web/define-component';

const resizeContainer = () => {
  const root = document?.getElementById('app-popup');

  if (!root) return;
  root.style.width = `${window.innerWidth}px`;
  root.style.height = `${window.innerHeight}px`;
};

defineComponent({ baseUrl: import.meta.env.VITE_BASE })
  .then(() => {
    resizeContainer();
    console.info('Web Component defined');
  })
  .catch(err => console.error('Failed to define component', err));
