export type TraktAuthentication = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
};

export type TraktDeviceAuthentication = {
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
};

export type TraktAuthenticationError = {
  error: string;
  error_description: string;
};

export type TraktClientAuthentication = {
  refresh_token?: string;
  access_token?: string;
  expires?: number;
  state?: string;
};

export type TraktAuthenticationAuthorizeRequest = {
  /** Must be set to code. */
  response_type: 'code';
  /** Get this from your app settings. */
  client_id: string;
  /** URI specified in your app settings. */
  redirect_uri: string;
  /** State variable for CSRF purposes. */
  state?: string;
  /** Prefer the account sign up page to be the default. */
  signup?: boolean;
  /** Force the user to sign in and authorize your app. */
  prompt?: 'login';
};

export type TraktAuthenticationCodeRequest = {
  /** Authorization code. */
  code: string;
  /** Get this from your app settings. */
  client_id: string;
  /** Get this from your app settings. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri: string;
  /** Authentication type: authorization_code */
  grant_type: 'authorization_code';
};

export type TraktAuthenticationRefreshRequest = {
  /** Saved from the initial token method. */
  refresh_token: string;
  /** Get this from your app settings. */
  client_id: string;
  /** Get this from your app settings. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri: string;
  /** Authentication type: authorization_code */
  grant_type: 'refresh_token';
};

export type TraktAuthenticationRevokeRequest = {
  /** A valid OAuth access_token. */
  token: string;
  /** Get this from your app settings. */
  client_id: string;
  /** Get this from your app settings. */
  client_secret: string;
};
