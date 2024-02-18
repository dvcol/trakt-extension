export type TraktAuthentication = {
  access_token: string;
  refresh_token: string;
  created_at: number;
  expires_in: number;
  token_type: string;
  scope: string;
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
  prompt?: 'login' | boolean;
};

export type TraktAuthenticationBaseRequest = {
  /** Get this from your app settings. */
  client_id: string;
  /** Get this from your app settings. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri: string;
  /** Authentication type: authorization_code or refresh_token */
  grant_type: 'authorization_code' | 'refresh_token';
};

export type TraktAuthenticationCodeRequest = TraktAuthenticationBaseRequest & {
  /** Authorization code. */
  code: string;
  /** Authentication type: authorization_code */
  grant_type: 'authorization_code';
};

export type TraktAuthenticationRefreshRequest = TraktAuthenticationBaseRequest & {
  /** Saved from the initial token method. */
  refresh_token: string;
  /** Authentication type: refresh_token */
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

export type TraktAuthenticationApprove = Pick<TraktAuthenticationAuthorizeRequest, 'state' | 'signup' | 'prompt'> & {
  redirect?: RequestRedirect;
  redirect_uri?: string;
};
