import type { IconProps, TagProps } from 'naive-ui';
import type { Component } from 'vue';

export const TagType = {
  Default: 'default' as const,
  Primary: 'primary' as const,
  Success: 'success' as const,
  Info: 'info' as const,
  Warning: 'warning' as const,
  Error: 'error' as const,
} as const;

export type TagTypes = (typeof TagType)[keyof typeof TagType];

export const AllTagTypes = Object.values(TagType) as TagTypes[];

export type TagLink = TagProps & {
  label: string;
  short?: string;
  title?: string;
  url?: string;
  meta?: boolean;
  icon?: Component;
  iconOnly?: boolean;
  iconProps?: IconProps & { style?: { [key: string]: string } | CSSStyleDeclaration };
  iconImgProps?: { disabled?: boolean; freeze?: boolean };
};
