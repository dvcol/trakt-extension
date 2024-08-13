/// <reference types="vite/client" />
interface ImportMeta {
  env: {
    PKG_VERSION: string;
    PKG_NAME: string;
    VITE_BASE?: string;
    VITE_WEB?: boolean;
    VITE_SOURCEMAP?: boolean;

    VITE_TRAKT_PRODUCTION_ID: string;
    VITE_TRAKT_PRODUCTION_SECRET: string;

    VITE_TRAKT_STAGING_ID: string;
    VITE_TRAKT_STAGING_SECRET: string;

    VITE_TMDB_API_KEY: string;
    VITE_TMDB_READ_TOKEN: string;

    VITE_TVDB_API_KEY: string;

    VITE_MAL_CLIENT_ID: string;
    VITE_MAL_CLIENT_SECRET: string;
  };
}
