import { describe, expect, it } from 'vitest';

import { TraktApiHeaders } from '../../../models/trakt/trakt-client.model';

import { CancellableFetch } from '../../../utils/fetch.utils';

import { traktClientSettings } from '../trakt-client.config';

import { BaseTraktClient, parseBody, parseResponse } from './base-trakt-client';

import type { TraktClientAuthentication } from '../../../models/trakt/trakt-authentication.model';
import type { TraktApiInit, TraktApiParams, TraktApiQuery, TraktApiResponse, TraktApiTemplate } from '../../../models/trakt/trakt-client.model';

import type { CacheStore } from '../../../utils/cache.utils';
import type { CancellablePromise } from '../../../utils/fetch.utils';

import type { Updater } from '../../../utils/observable.utils';

class TestableTraktClient extends BaseTraktClient {
  get callListeners() {
    return this._callListeners;
  }

  publicUpdateAuth(auth: Updater<TraktClientAuthentication>) {
    return this.updateAuth(auth);
  }

  publicCall<P extends TraktApiParams, R = unknown>(template: TraktApiTemplate<P>, params: P = {} as P, init?: TraktApiInit) {
    return this._call<P, R>(template, params, init);
  }

  publicParse<T extends TraktApiParams>(template: TraktApiTemplate<T>, params: T) {
    return this._parse(template, params);
  }
}

describe('base-trakt-client.ts', () => {
  const cacheStore: CacheStore<TraktApiResponse> = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    delete: vi.fn(),
  };
  const client = new TestableTraktClient({ ...traktClientSettings, cacheStore });
  const auth: TraktClientAuthentication = {
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires: 1234567890,
    state: 'state',
  };
  const query: TraktApiQuery<unknown> = {
    request: {
      input: 'https://api.trakt.tv/oauth/device/code',
      init: {
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-key': 'client_id',
          'trakt-api-version': '2',
        },
      },
    },
    query: new Promise(() => {}) as CancellablePromise<unknown>,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect.assertions(2);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  describe('cache', () => {
    it('should delete a cached entry', async () => {
      expect.assertions(1);

      await client.clearCache('key');

      expect(cacheStore.delete).toHaveBeenCalledWith('key');
    });

    it('should delete a cached entry', async () => {
      expect.assertions(1);

      await client.clearCache();

      expect(cacheStore.clear).toHaveBeenCalledWith();
    });
  });

  describe('observers', () => {
    const authObserver = vi.fn();
    const callObserver = vi.fn();

    afterEach(() => {
      client.publicUpdateAuth({});
    });

    it('should subscribe an observer to authentication state changes', () => {
      expect.assertions(5);

      client.onAuthChange(authObserver);

      client.publicUpdateAuth(auth);
      expect(authObserver).toHaveBeenCalledWith(auth);
      expect(client.auth.state).toBe(auth.state);

      const newState = 'new-state';
      client.publicUpdateAuth(_auth => ({ ..._auth, state: newState }));
      expect(authObserver).toHaveBeenCalledWith({ ...auth, state: newState });
      expect(client.auth.state).toBe(newState);

      expect(authObserver).toHaveBeenCalledTimes(2);
    });

    it('should subscribe an observer to calls', () => {
      expect.assertions(2);

      client.onCall(callObserver);

      client.callListeners.update(query);
      expect(callObserver).toHaveBeenCalledWith(query);
      expect(callObserver).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe an observer', () => {
      expect.assertions(6);

      client.onAuthChange(authObserver);
      client.onCall(callObserver);

      client.callListeners.update(query);
      client.publicUpdateAuth(auth);

      expect(authObserver).toHaveBeenCalledTimes(1);
      expect(callObserver).toHaveBeenCalledTimes(1);

      client.unsubscribe(authObserver);

      client.callListeners.update(query);
      client.publicUpdateAuth(auth);

      expect(authObserver).toHaveBeenCalledTimes(1);
      expect(callObserver).toHaveBeenCalledTimes(2);

      client.unsubscribe(callObserver);

      client.callListeners.update(query);
      client.publicUpdateAuth(auth);

      expect(authObserver).toHaveBeenCalledTimes(1);
      expect(callObserver).toHaveBeenCalledTimes(2);
    });

    it('should unsubscribe all observers', () => {
      expect.assertions(4);

      client.onCall(callObserver);
      client.onAuthChange(authObserver);

      client.publicUpdateAuth(auth);
      client.callListeners.update(query);

      expect(authObserver).toHaveBeenCalledTimes(1);
      expect(callObserver).toHaveBeenCalledTimes(1);

      client.unsubscribe();

      client.publicUpdateAuth(auth);
      client.callListeners.update(query);

      expect(authObserver).toHaveBeenCalledTimes(1);
      expect(callObserver).toHaveBeenCalledTimes(1);
    });
  });

  type Params = {
    requiredQuery: string;
    optionalQuery?: string;
    requiredPath: string;
    optionalPath?: string;
    requiredBody: string;
    optionalBody?: string;
  };

  // Mock data for testing
  const mockParams: TraktApiParams<Params> = {
    requiredQuery: 'requiredQuery',
    requiredPath: 'requiredPath',
    requiredBody: 'requiredBody',
    filters: {
      genres: ['action', 'adventure'],
    },
    pagination: {
      page: 1,
      limit: 10,
    },
    extended: 'full',
  };

  // Mock TraktApiTemplate for testing
  const mockTemplate: TraktApiTemplate<Params> = {
    url: '/movies/:requiredPath/:optionalPath/popular?requiredQuery=&optionalQuery=',
    method: 'POST',
    opts: {
      parameters: {
        query: {
          requiredQuery: true,
          optionalQuery: false,
        },
        path: {
          requiredPath: true,
          optionalPath: false,
        },
      },
      filters: ['genres', 'query'],
      pagination: true,
      extended: ['full'],
    },
    body: {
      requiredBody: true,
      optionalBody: false,
    },
  };

  describe('parseParams', () => {
    it('should construct a valid URL for Trakt API request', async () => {
      expect.assertions(1);

      const result = client.publicParse(mockTemplate, mockParams);

      expect(result).toBe(
        'https://api-staging.trakt.tv/movies/requiredPath/popular?requiredQuery=requiredQuery&genres=action%2Cadventure&page=1&limit=10&extended=full',
      );
    });

    it('should throw an error for missing mandatory query parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredQuery: '' });
      expect(testFunction).toThrow("Missing mandatory query parameter: 'requiredQuery'");
    });

    it('should throw an error for missing mandatory path parameter', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse(mockTemplate, { ...mockParams, requiredPath: '' });
      expect(testFunction).toThrow("Missing mandatory path parameter: 'requiredPath'");
    });

    it('should throw an error for un-supported filter', async () => {
      expect.assertions(1);

      const testFunction = () =>
        client.publicParse<TraktApiParams<Params>>(mockTemplate, {
          ...mockParams,
          filters: { status: ['filter1', 'filter2'] },
        });
      expect(testFunction).toThrow("Filter is not supported: 'status'");
    });

    it('should throw an error for invalid filter value', async () => {
      expect.assertions(1);

      const testFunction = () =>
        client.publicParse<TraktApiParams<Params>>(mockTemplate, {
          ...mockParams,
          filters: { query: ['action', 'adventure', 'invalidFilter'] },
        });

      expect(testFunction).toThrow("Filter 'query' doesn't support multiple values.");
    });

    it('should throw an error for invalid extended', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParse<TraktApiParams<Params>>(mockTemplate, { ...mockParams, extended: 'comments' });
      expect(testFunction).toThrow("Invalid value 'comments', extended should be 'full'");
    });
  });

  describe('parseBody', () => {
    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const result = parseBody<TraktApiParams<Params>>(mockTemplate.body, mockParams);
      expect(result).toBe('{"requiredBody":"requiredBody"}');
    });

    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const mockBody: Record<string, unknown> = { ...mockParams, optionalBody: 'optionalBody' };
      delete mockBody.requiredBody;
      const testFunction = () => parseBody(mockTemplate.body, mockBody);
      expect(testFunction).toThrow("Missing mandatory body parameter: 'requiredBody'");
    });
  });

  describe('parseResponse', () => {
    it('should parse an empty response', () => {
      expect.assertions(6);

      const response = new Response();
      const parsed = parseResponse(response);

      expect(parsed).toBe(response);
      expect(parsed.pagination).toBeUndefined();
      expect(parsed.sort).toBeUndefined();
      expect(parsed.appliedSort).toBeUndefined();
      expect(parsed.interval).toBeUndefined();
      expect(parsed.vip).toBeUndefined();
    });

    it('should parse a response with pagination headers', () => {
      expect.assertions(5);

      const response = new Response();
      response.headers.set(TraktApiHeaders.XPaginationItemCount, '1');
      response.headers.set(TraktApiHeaders.XPaginationPageCount, '2');
      response.headers.set(TraktApiHeaders.XPaginationLimit, '3');
      response.headers.set(TraktApiHeaders.XPaginationPage, '4');
      const parsed = parseResponse(response);

      expect(parsed.pagination).toMatchObject({
        itemCount: 1,
        pageCount: 2,
        limit: 3,
        page: 4,
      });

      expect(parsed.sort).toBeUndefined();
      expect(parsed.appliedSort).toBeUndefined();
      expect(parsed.interval).toBeUndefined();
      expect(parsed.vip).toBeUndefined();
    });

    it('should parse a response with sort headers', () => {
      expect.assertions(5);

      const response = new Response();
      response.headers.set(TraktApiHeaders.XSortBy, 'order');
      response.headers.set(TraktApiHeaders.XSortHow, 'asc');
      const parsed = parseResponse(response);

      expect(parsed.pagination).toBeUndefined();

      expect(parsed.sort).toMatchObject({
        by: 'order',
        how: 'asc',
      });

      expect(parsed.appliedSort).toBeUndefined();
      expect(parsed.interval).toBeUndefined();
      expect(parsed.vip).toBeUndefined();
    });

    it('should parse a response with appliedSort headers', () => {
      expect.assertions(5);

      const response = new Response();
      response.headers.set(TraktApiHeaders.XAppliedSortBy, 'order');
      response.headers.set(TraktApiHeaders.XAppliedSortHow, 'asc');
      const parsed = parseResponse(response);

      expect(parsed.pagination).toBeUndefined();
      expect(parsed.sort).toBeUndefined();

      expect(parsed.appliedSort).toMatchObject({
        by: 'order',
        how: 'asc',
      });

      expect(parsed.interval).toBeUndefined();
      expect(parsed.vip).toBeUndefined();
    });

    it('should parse a response with appliedSort headers', () => {
      expect.assertions(5);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const response = new Response();
      response.headers.set(TraktApiHeaders.XStartDate, startDate.toISOString());
      response.headers.set(TraktApiHeaders.XEndDate, endDate.toISOString());
      const parsed = parseResponse(response);

      expect(parsed.pagination).toBeUndefined();
      expect(parsed.sort).toBeUndefined();
      expect(parsed.appliedSort).toBeUndefined();

      expect(parsed.interval).toMatchObject({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      expect(parsed.vip).toBeUndefined();
    });

    it('should parse a response with vip headers', () => {
      expect.assertions(5);

      const response = new Response();
      response.headers.set(TraktApiHeaders.XUpgradeURL, 'url');
      response.headers.set(TraktApiHeaders.XVipUser, 'vip');
      response.headers.set(TraktApiHeaders.XAccountLimit, '2000');
      const parsed = parseResponse(response);

      expect(parsed.pagination).toBeUndefined();
      expect(parsed.sort).toBeUndefined();
      expect(parsed.appliedSort).toBeUndefined();
      expect(parsed.interval).toBeUndefined();

      expect(parsed.vip).toMatchObject({
        url: 'url',
        user: 'vip',
        limit: '2000',
      });
    });
  });

  it('should make a call to the Trakt API', async () => {
    expect.assertions(8);

    const response = new Response();

    response.headers.set(TraktApiHeaders.XPaginationItemCount, '1');
    response.headers.set(TraktApiHeaders.XPaginationPageCount, '2');
    response.headers.set(TraktApiHeaders.XPaginationLimit, '3');
    response.headers.set(TraktApiHeaders.XPaginationPage, '4');

    response.headers.set(TraktApiHeaders.XSortBy, 'order');
    response.headers.set(TraktApiHeaders.XSortHow, 'asc');

    response.headers.set(TraktApiHeaders.XSortBy, 'order');
    response.headers.set(TraktApiHeaders.XSortHow, 'asc');

    response.headers.set(TraktApiHeaders.XAppliedSortBy, 'order');
    response.headers.set(TraktApiHeaders.XAppliedSortHow, 'asc');

    response.headers.set(TraktApiHeaders.XUpgradeURL, 'url');
    response.headers.set(TraktApiHeaders.XVipUser, 'vip');
    response.headers.set(TraktApiHeaders.XAccountLimit, '2000');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    response.headers.set(TraktApiHeaders.XStartDate, startDate.toISOString());
    response.headers.set(TraktApiHeaders.XEndDate, endDate.toISOString());

    const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

    const result = await client.publicCall(mockTemplate, mockParams);

    expect(spyFetch).toHaveBeenCalledWith(
      'https://api-staging.trakt.tv/movies/requiredPath/popular?requiredQuery=requiredQuery&genres=action%2Cadventure&page=1&limit=10&extended=full',
      {
        body: '{"requiredBody":"requiredBody"}',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': '@dvcol/trakt-extension/1.2.0',
          'trakt-api-key': 'e3fe38d76cbd787f74ada8f043a69dfc8b20a86569e51ee125bf0c084d6c553c',
          'trakt-api-version': '2',
        },
        method: 'POST',
      },
    );

    expect(result).toBe(response);

    expect(result.pagination).toMatchObject({
      itemCount: 1,
      pageCount: 2,
      limit: 3,
      page: 4,
    });
    expect(result.sort).toMatchObject({
      by: 'order',
      how: 'asc',
    });
    expect(result.appliedSort).toMatchObject({
      by: 'order',
      how: 'asc',
    });
    expect(result.interval).toMatchObject({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
    expect(result.vip).toMatchObject({
      url: 'url',
      user: 'vip',
      limit: '2000',
    });

    expect(spyFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if auth is missing', async () => {
    expect.assertions(1);

    const testFunction = () => client.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: true } }, mockParams);
    await expect(testFunction).rejects.toThrow('OAuth required: access_token is missing');
  });
});
