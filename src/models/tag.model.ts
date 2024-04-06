import type { IconProps, TagProps } from 'naive-ui';
import type { Component } from 'vue';

export type TagLink = TagProps & {
  label: string;
  url?: string;
  meta?: boolean;
  icon?: Component;
  iconProps?: IconProps & { style?: { [key: string]: string } | CSSStyleDeclaration };
};
