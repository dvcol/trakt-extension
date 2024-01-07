import type {
  TraktAuthentication,
  TraktAuthenticationAuthorizeRequest,
  TraktAuthenticationCodeRequest,
  TraktAuthenticationRefreshRequest,
  TraktAuthenticationRevokeRequest,
  TraktDeviceAuthentication,
} from '~/models/trakt-authentication.model';

import { TraktClientEndpoint } from '~/models/trakt-client.model';
import { HttpMethod } from '~/utils/http.utils';

export const authentication = {
  /**
   * The API uses OAuth2. If you know what's up with OAuth2, grab your library and starting rolling.
   * If you have access to a web browser (mobile app, desktop app, website), use standard <b>OAuth</b>.
   * If you don't have web browser access (media center plugins, smart watches, smart TVs, command line scripts, system services), use <b>Device</b> authentication.
   *
   * To obtain a client_id and client_secret, create an application on the Trakt website. Here are some helpful links to get your started:
   *
   * * [Create a new API app]{@link https://trakt.tv/oauth/applications/new}
   * * [View your API apps]{@link https://trakt.tv/oauth/applications}
   *
   * Application Flow
   * * <b>Redirect to request Trakt access.</b> Using the <b>/oauth/authorize</b> method, construct then redirect to this URL. The Trakt website will request permissions for your app and the user will have the opportunity to sign up for a new Trakt account or sign in with their existing account.
   * * <b>Trakt redirects back to your site.</b> If the user accepts your request, Trakt redirects back to your site with a temporary code in a code GET parameter as well as the state (if provided) in the previous step in a state parameter. If the states don’t match, the request has been created by a third party and the process should be aborted.
   * * <b>Exchange the code for an access token.</b> If everything looks good in step 2, exchange the code for an access token using the <b>/oauth/token</b> method. Save the access_token so your app can authenticate the user by sending the Authorization header as indicated below or in any example code. The access_token is valid for 3 months. Save and use the refresh_token to get a new access_token without asking the user to re-authenticate.
   *
   * @see [authentication-oauth]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth}
   */
  oAuth: {
    /**
     * Construct then redirect to this URL.
     * The Trakt website will request permissions for your app, which the user needs to approve.
     * If the user isn't signed into Trakt, it will ask them to do so.
     *
     * Note: Use the website https://trakt.tv hostname when creating this URL and not the API URL.
     *
     * @see [authorize]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/authorize}
     */
    authorize: new TraktClientEndpoint<TraktAuthenticationAuthorizeRequest>({
      method: HttpMethod.GET,
      url: '/oauth/authorize?response_type=code&client_id=&redirect_uri=&state=',
      opts: {
        parameters: {
          query: {
            response_type: true,
            client_id: true,
            redirect_uri: true,
            state: false,
            signup: false,
            prompt: false,
          },
        },
      },
    }),
    /** @see [get-token]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/get-token} */
    token: {
      /**
       * Use the authorization code GET parameter sent back to your redirect_uri to get an access_token.
       * Save the access_token so your app can authenticate the user by sending the Authorization header.
       *
       * The access_token is valid for 3 months.
       * Save and use the refresh_token to get a new access_token without asking the user to re-authenticate.
       *
       * @throws TraktAuthenticationError
       *
       * @see [exchange-code-for-access_token]{@link https://trakt.docs.apiary.io/reference/authentication-oauth/get-token/exchange-code-for-access_token}
       */
      code: new TraktClientEndpoint<TraktAuthenticationCodeRequest, TraktAuthentication>({
        method: HttpMethod.POST,
        url: '/oauth/token',
        body: {
          code: true,
          client_id: true,
          client_secret: true,
          redirect_uri: true,
          grant_type: true,
        },
      }),

      /**
       * Use the refresh_token to get a new access_token without asking the user to re-authenticate.
       * The access_token is valid for 3 months before it needs to be refreshed again.
       *
       * @throws TraktAuthenticationError
       *
       * @see [exchange-refresh_token-for-access_token]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/get-token/exchange-refresh_token-for-access_token}
       */
      refresh: new TraktClientEndpoint<TraktAuthenticationRefreshRequest, TraktAuthentication>({
        method: HttpMethod.POST,
        url: '/oauth/token',
        body: {
          refresh_token: true,
          client_id: true,
          client_secret: true,
          redirect_uri: true,
          grant_type: true,
        },
      }),
    },
    /**
     * An access_token can be revoked when a user signs out of their Trakt account in your app.
     * This is not required, but might improve the user experience so the user doesn't have an unused app connection hanging around.
     *
     * @see [revoke-token]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth/revoke-token}
     */
    revoke: new TraktClientEndpoint<TraktAuthenticationRevokeRequest>({
      method: HttpMethod.POST,
      url: '/oauth/revoke',
      body: {
        token: true,
        client_id: true,
        client_secret: true,
      },
    }),
  },
  /**
   * Device authentication is for apps and services with limited input or display capabilities.
   * This include media center plugins, smart watches, smart TVs, command line scripts, and system services.
   *
   * Your app displays an alphanumeric code (typically 8 characters) to the user.
   * They are then instructed to visit the verification URL on their computer or mobile device.
   * After entering the code, the user will be prompted to grant permission for your app.
   * After your app gets permissions, the device receives an access_token and works like standard OAuth from that point on.
   *
   * * [authentication-oauth]{@link https://trakt.docs.apiary.io/#reference/authentication-oauth}
   *
   * Application Flow:
   *
   * * <b>Generate codes.</b> Your app calls <b>/oauth/device/code</b> to generate new codes. Save this entire response for later use.
   * * <b>Display the code.</b> Display the user_code and instruct the user to visit the verification_url on their computer or mobile device.
   * * <b>Poll for authorization.</b> Poll the <b>/oauth/device/token</b> method to see if the user successfully authorizes your app. Use the device_code and poll at the interval (in seconds) to check if the user has authorized your app. Check the docs below for the specific error codes you need to handle. Use expires_in to stop polling after that many seconds, and gracefully instruct the user to restart the process. <b>It is important to poll at the correct interval and also stop polling when expired. </b>
   * * <b>Successful authorization.</b> When you receive a 200 success response, save the access_token so your app can authenticate the user in methods that require it. The access_token is valid for 3 months. Save and use the refresh_token to get a new access_token without asking the user to re-authenticate. It's normal OAuth from this point.
   *
   * User Flow:
   *
   * * <b>Call to action.</b> Consider your user experience when asking a user to connect their Trakt account. For some devices this will be right away, and for others it might be later in the experience.
   * * <b>Display the code.</b> When a user clicks the call to action, your app calls [/oauth/device/code]{@link https://trakt.docs.apiary.io/reference/authentication-devices/code} to generate new codes. In your UI, display the user_code and instruct the user to visit the verification_url on their computer or mobile device. The user_code is typically 8 characters, so make sure there is enough room to display the full code.
   * * <b>Authorizing your app.</b> When the user visits the verification_url it first checks to make sure they're signed in. If not signed in, they'll be able to or can sign up for a new account. After entering the code, the user will be prompted to grant permission for your app. Once approved, the user will see a success message indicating their device is connected.
   * * <b>Confirm successful authorization.</b> Your app will be polling to see if the user successfully authorizes your app. Once they have, refresh your UI to indicate a successful connection has been made.
   * @see [authentication-devices]{@link https://trakt.docs.apiary.io/#reference/authentication-devices}
   */
  device: {
    /**
     * Generate new codes to start the device authentication process.
     * The device_code and interval will be used later to poll for the access_token.
     * The user_code and verification_url should be presented to the user as mentioned in the flow steps above.
     *
     * @see [device-code]{@link https://trakt.docs.apiary.io/#reference/authentication-devices/device-code}
     */
    code: new TraktClientEndpoint<
      {
        /** Get this from your app settings. */
        client_id: string;
      },
      TraktDeviceAuthentication
    >({
      method: HttpMethod.POST,
      url: '/oauth/device/code',
      body: {
        client_id: true,
      },
    }),
    /**
     * Use the device_code and poll at the interval (in seconds) to check if the user has authorized you app.
     * Use expires_in to stop polling after that many seconds, and gracefully instruct the user to restart the process.
     * <b>It is important to poll at the correct interval and also stop polling when expired.</b>
     *
     * When you receive a 200 success response, save the access_token so your app can authenticate the user in methods that require it.
     * The access_token is valid for 3 months.
     * Save and use the refresh_token to get a new access_token without asking the user to re-authenticate.
     * Check below for all the error codes that you should handle.
     *
     * Code	Description
     *
     * * <b>200	Success</b>       - save the access_token
     * * <b>400	Pending</b>       - waiting for the user to authorize your app
     * * <b>404	Not Found</b>     - invalid device_code
     * * <b>409	Already Used</b>  - user already approved this code
     * * <b>410	Expired</b>       - the tokens have expired, restart the process
     * * <b>418	Denied</b>        - user explicitly denied this code
     * * <b>429	Slow Down</b>     - your app is polling too quickly
     *
     * @see [get-token]{@link https://trakt.docs.apiary.io/#reference/authentication-devices/get-token}
     */
    token: new TraktClientEndpoint<
      {
        /** device_code from the initial method. */
        code: string;
        /** Get this from your app settings. */
        client_id: string;
        /** Get this from your app settings. */
        client_secret: string;
      },
      TraktAuthentication
    >({
      method: HttpMethod.POST,
      url: '/oauth/device/token',
      body: {
        code: true,
        client_id: true,
        client_secret: true,
      },
    }),
  },
};
