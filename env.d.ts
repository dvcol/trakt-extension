/// <reference types="vite/client" />
interface ImportMeta {
  env: {
    PKG_VERSION: string;
    PKG_NAME: string;
    VITE_BASE?: string;
    VITE_WEB?: boolean;
    VITE_SOURCEMAP?: boolean;
  };
}
