import { TmdbClientEndpoint } from '~/models/tmdb/tmdb-client.model';
import { HttpMethod } from '~/utils/http.utils';

/**
 * Authentication v3 endpoints.
 *
 * @see [authentication]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id}
 */
export const authentification = {
  /**
   * Guest sessions are a special kind of session that give you some of the functionality of an account, but not all. For example, some of the things you can do with a guest session are; maintain a rated list, a watchlist and a favourite list.
   *
   * Guest sessions will automatically be deleted if they are not used within 60 minutes of it being issued.
   *
   * @version 3
   *
   * @see [guest-session]{@link https://developer.themoviedb.org/reference/authentication-create-guest-session}
   */
  guest: new TmdbClientEndpoint<
    Record<string, never>,
    {
      quest_session_id: string;
      expires_at: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/authentication/guest_session/new',
    opts: {
      version: 3,
    },
  }),
  /**
   * Create an intermediate request token that can be used to validate a TMDB user login.
   * More details about how this works can be found [here]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id}.
   *
   * This is step 1 from the [How do I generate a session id?]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id} guide.
   *
   * @version 3
   *
   * @see [create-request-token]{@link https://developer.themoviedb.org/reference/authentication-create-request-token}
   */
  request: new TmdbClientEndpoint<
    Record<string, never>,
    {
      request_token: string;
      expires_at: string;
    }
  >({
    method: HttpMethod.GET,
    url: '/authentication/token/new',
    opts: {
      version: 3,
    },
  }),
  session: {
    /**
     * You can use this method to create a fully valid session ID once a user has validated the request token.
     * More information about how this works can be found [here]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id}.
     *
     * This is step 3 from the [How do I generate a session id?]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id} guide.
     *
     * @version 3
     *
     * @see [create-session]{@link https://developer.themoviedb.org/reference/authentication-create-session}
     */
    create: new TmdbClientEndpoint<
      {
        request_token: string;
      },
      {
        session_id: string;
      }
    >({
      method: HttpMethod.POST,
      url: '/authentication/session/new',
      body: {
        request_token: true,
      },
      opts: {
        version: 3,
      },
    }),
    v4: {
      /**
       * Use this method to create a v3 session ID if you already have a valid v4 access token.
       * The v4 token needs to be authenticated by the user.
       * Your standard "read token" will not validate to create a session ID.
       *
       * This would replace step 3 from the [How do I generate a session id?]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id} guide.
       *
       * @version 3
       *
       * @see [create-session-from-v4]{@link https://developer.themoviedb.org/reference/authentication-create-session-from-v4-token}
       */
      create: new TmdbClientEndpoint<
        {
          access_token: string;
        },
        {
          session_id: string;
        }
      >({
        method: HttpMethod.POST,
        url: '/authentication/session/convert/4',
        body: {
          access_token: true,
        },
        opts: {
          version: 3,
        },
      }),
    },
    /**
     * This method allows an application to validate a request token by entering a username and password.
     *
     * Not all applications have access to a web view so this can be used as a substitute.
     *
     * Please note, the preferred method of validating a request token is to have a user authenticate the request via the TMDB website.
     * You can read about that method here.
     *
     * If you decide to use this method please use HTTPS.
     *
     * This would replace step 3 from the [How do I generate a session id?]{@link https://developer.themoviedb.org/reference/authentication-how-do-i-generate-a-session-id} guide.
     *
     * @version 3
     *
     * @see [login]{@link https://developer.themoviedb.org/reference/authentication-create-session-from-login}
     */
    login: new TmdbClientEndpoint<
      {
        username: string;
        password: string;
        request_token: string;
      },
      {
        request_token: string;
        expires_at: string;
      }
    >({
      method: HttpMethod.POST,
      url: '/authentication/token/validate_with_login',
      body: {
        username: true,
        password: true,
        request_token: true,
      },
      opts: {
        version: 3,
      },
    }),
    /**
     * Delete a session from its ID.
     *
     * @version 3
     *
     * @see [delete-session]{@link https://developer.themoviedb.org/reference/authentication-delete-session}
     */
    delete: new TmdbClientEndpoint<{
      session_id: string;
    }>({
      method: HttpMethod.DELETE,
      url: '/authentication/session',
      opts: {
        version: 3,
      },
    }),
  },
  /**
   * Test API key to see if it is valid.
   *
   * @version 3
   *
   * @see [validate]{@link https://developer.themoviedb.org/reference/authentication-validate-key}
   */
  validate: new TmdbClientEndpoint({
    method: HttpMethod.GET,
    url: '/authentication',
    opts: {
      version: 3,
    },
  }),
};
