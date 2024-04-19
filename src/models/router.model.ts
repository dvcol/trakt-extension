export const RouterStorageKey = {
  LastRoute: 'app.state.last-route',
} as const;

export enum Route {
  Calendar = 'calendar',
  History = 'history',
  Watchlist = 'watchlist',
  Progress = 'progress',
  Search = 'search',
  Settings = 'settings',
  About = 'about',
  Login = 'login',
}
