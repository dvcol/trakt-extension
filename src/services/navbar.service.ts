import { ref } from 'vue';

export class NavbarService {
  static readonly ref = ref<HTMLElement>();
  static readonly open = ref(false);
  static readonly drawer = ref(false);
  static readonly dropdown = ref(false);
  static readonly isHover = ref(false);
  static readonly isFocus = ref(false);

  static hideDrawer() {
    NavbarService.ref.value?.blur();
    NavbarService.ref.value?.dispatchEvent(new Event('mouseleave'));
  }

  static destroy() {
    this.ref.value = undefined;
    this.open.value = false;
    this.drawer.value = false;
    this.dropdown.value = false;
    this.isHover.value = false;
    this.isFocus.value = false;
  }
}
