import type { Component } from 'vue';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconClipboard from '~/components/icons/IconClipboard.vue';
import IconCog from '~/components/icons/IconCog.vue';
import IconExternalLinkRounded from '~/components/icons/IconExternalLinkRounded.vue';
import IconLightBulb from '~/components/icons/IconLightBulb.vue';
import IconList from '~/components/icons/IconList.vue';
import IconLogIn from '~/components/icons/IconLogIn.vue';
import IconMovie from '~/components/icons/IconMovie.vue';
import IconRestore from '~/components/icons/IconRestore.vue';
import IconSearch from '~/components/icons/IconSearch.vue';

export const RouterStorageKey = {
  LastRoute: 'app.state.last-route',
} as const;

export enum Route {
  Progress = 'progress',
  Calendar = 'calendar',
  Releases = 'releases',
  History = 'history',
  Watchlist = 'watchlist',
  Search = 'search',
  Settings = 'settings',
  About = 'about',
  Login = 'login',
}

export const getRouteIcon = (route: Route): Component => {
  switch (route) {
    case Route.Progress:
      return IconClipboard;
    case Route.Calendar:
      return IconCalendar;
    case Route.Releases:
      return IconMovie;
    case Route.History:
      return IconRestore;
    case Route.Watchlist:
      return IconList;
    case Route.Search:
      return IconSearch;
    case Route.Settings:
      return IconCog;
    case Route.About:
      return IconLightBulb;
    case Route.Login:
      return IconLogIn;
    default:
      return IconExternalLinkRounded;
  }
};
