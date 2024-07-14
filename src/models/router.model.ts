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
