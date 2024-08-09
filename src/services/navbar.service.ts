import { ref } from 'vue';

export class NavbarService {
  static readonly open = ref(false);
  static readonly drawer = ref(false);
  static readonly dropdown = ref(false);
}
