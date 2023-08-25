import AppWeb from '~/components/web/AppWeb.ce.vue';
import { createElementInstance } from '~/views/common/create-wc';

export const TraktExtensionWc = createElementInstance(AppWeb);

export type TraktExtensionComponent = typeof TraktExtensionWc;
