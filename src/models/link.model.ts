import type { TagLink } from '~/models/tag.model';

import IconDownload from '~/components/icons/IconDownload.vue';
import IconExternalLink from '~/components/icons/IconExternalLink.vue';
import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';
import IconLink from '~/components/icons/IconLink.vue';
import IconSearch from '~/components/icons/IconSearch.vue';

export const CustomLinkScope = {
  Movie: 'movie' as const,
  Show: 'show' as const,
  Season: 'season' as const,
  Episode: 'episode' as const,
  Person: 'person' as const,
} as const;

export const AllCustomLinkScopes = Object.values(CustomLinkScope);

export const isCustomLinkScope = (scope: string): scope is CustomLinkScopes => AllCustomLinkScopes.includes(scope as CustomLinkScopes);

export type CustomLinkScopes = (typeof CustomLinkScope)[keyof typeof CustomLinkScope];

export type CustomLinkSubstitution<T = string | number> = Partial<{
  slug: T;
  trakt: T;
  imdb: T;
  tmdb: T;
  tvdb: T;
  alias: T;
  episode: T;
  season: T;
  title: T;
}>;

export const CustomLinkView = {
  Panel: 'panel' as const,
  List: 'list' as const,
  Both: 'both' as const,
} as const;

export const AllCustomLinkViews = Object.values(CustomLinkView);

export type CustomLinkViews = (typeof CustomLinkView)[keyof typeof CustomLinkView];

export const CustomLinkGenreMode = {
  Some: 'some' as const,
  Every: 'every' as const,
  None: 'none' as const,
} as const;

export type CustomLinkGenreModes = (typeof CustomLinkGenreMode)[keyof typeof CustomLinkGenreMode];

export const AllCustomLinkGenreModes = Object.values(CustomLinkGenreMode);

export const CustomLinkIconType = {
  Link: 'link' as const,
  Search: 'search' as const,
  Squared: 'squared' as const,
  Rounded: 'rounded' as const,
  Download: 'download' as const,
} as const;

export type CustomLinkIconTypes = (typeof CustomLinkIconType)[keyof typeof CustomLinkIconType];

export const AllCustomLinkIconTypes = Object.values(CustomLinkIconType);

export type CustomLink = TagLink & {
  id: string | number;
  url: string;
  scopes: CustomLinkScopes[];
  genres?: string[];
  genreMode?: CustomLinkGenreModes;
  iconType?: CustomLinkIconTypes;
  view?: CustomLinkViews;
};

export const getCustomLinkIcon = (type: CustomLinkIconTypes): Pick<TagLink, 'icon' | 'iconProps'> => {
  switch (type) {
    case CustomLinkIconType.Link:
      return { icon: IconLink, iconProps: { style: { paddingLeft: '0.075rem' } } };
    case CustomLinkIconType.Search:
      return { icon: IconSearch, iconProps: { style: { paddingLeft: '0.075rem' } } };
    case CustomLinkIconType.Squared:
      return { icon: IconExternalLink, iconProps: { style: { paddingLeft: '0.075remÒ' } } };
    case CustomLinkIconType.Rounded:
      return { icon: IconExternalLinkRounded, iconProps: { style: { paddingLeft: '0' } } };
    case CustomLinkIconType.Download:
      return { icon: IconDownload, iconProps: { style: { paddingLeft: '0.1rem' } } };
    default:
      return {};
  }
};

export type AliasScope = 'movie' | 'show';

export const isAliasScope = (scope: string): scope is AliasScope => ['movie', 'show'].includes(scope);
