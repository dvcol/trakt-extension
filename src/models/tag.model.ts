import type { TagProps } from 'naive-ui';
import type { Component } from 'vue';

export type TagLink = TagProps & {
  label: string;
  url?: string;
  meta?: boolean;
};

export type PanelTag = TagLink & {
  icon?: Component;
};
