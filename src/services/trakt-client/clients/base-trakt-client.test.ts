import { describe, expect, it } from 'vitest';

import { TraktApiHeaders } from '../../../models/trakt/trakt-client.model';

import { traktClientSettings } from '../../../settings/traktv.api';

import { CancellableFetch } from '../../../utils/fetch.utils';

import { HttpMethod } from '../../../utils/http.utils';

import { BaseHeaderContentType } from '../../common/base-client';

import { BaseTraktClient, parseResponse } from './base-trakt-client';

import type { TraktClientAuthentication } from '../../../models/trakt/trakt-authentication.model';
import type { TraktApiInit, TraktApiParams, TraktApiTemplate } from '../../../models/trakt/trakt-client.model';
import type { Updater } from '../../../utils/observable.utils';

class TestableTraktClient extends BaseTraktClient {
  publicUpdateAuth(auth: Updater<TraktClientAuthentication>) {
    return this.updateAuth(auth);
  }

  publicCall<P extends TraktApiParams>(template: TraktApiTemplate<P>, params: P = {} as P, init?: TraktApiInit) {
    return this._call<P>(template, params, init);
  }

  publicParseBody<T extends TraktApiParams = TraktApiParams>(template: Record<string, string | boolean>, params: T): BodyInit {
    return this._parseBody(template, params);
  }

  publicParse<T extends TraktApiParams>(template: TraktApiTemplate<T>, params: T) {
    return this._parseUrl(template, params).toString();
  }
}

describe('base-trakt-client.ts', () => {
  const client = new TestableTraktClient(traktClientSettings);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect.assertions(2);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
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
    method: HttpMethod.POST,
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

      const result = client.publicParseBody<TraktApiParams<Params>>(mockTemplate.body!, mockParams);
      expect(result).toBe('{"requiredBody":"requiredBody"}');
    });

    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const mockBody: Record<string, unknown> = { ...mockParams, optionalBody: 'optionalBody' };
      delete mockBody.requiredBody;
      const testFunction = () => client.publicParseBody(mockTemplate.body!, mockBody);
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

    it('should throw on failed fetch response', async () => {
      expect.assertions(1);

      const failedResponse = new Response('content', {
        status: 404,
        statusText: 'Not Found',
      });

      let error;
      try {
        parseResponse(failedResponse);
      } catch (err) {
        error = err;
      } finally {
        expect(error).toBe(failedResponse);
      }
    });

    it('should not throw on failed fetch response of type opaqueredirect', async () => {
      expect.assertions(1);

      const testFunction = () =>
        parseResponse({
          ok: false,
          status: 302,
          statusText: 'Found',
          type: 'opaqueredirect',
          headers: new Headers(),
        } as Response);
      expect(testFunction).not.toThrow();
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
          [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
          [TraktApiHeaders.UserAgent]: traktClientSettings.useragent,
          [TraktApiHeaders.TraktApiKey]: traktClientSettings.client_id,
          [TraktApiHeaders.TraktApiVersion]: '2',
        },
        method: HttpMethod.POST,
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
