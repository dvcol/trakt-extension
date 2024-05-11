import { BaseApiHeaders, BaseHeaderContentType } from '@dvcol/base-http-client';
import { CancellableFetch } from '@dvcol/base-http-client/utils/fetch';
import { HttpMethod } from '@dvcol/base-http-client/utils/http';
import { describe, expect, it } from 'vitest';

import { TraktApiHeaders } from '../../../models/trakt/trakt-client.model';
import { tvdbClientSettings } from '../../../settings/tvdb.api';

import { BaseTvdbClient } from './base-tvdb-client';

import type {
  TvdbApiParam,
  TvdbApiResponse,
  TvdbApiResponseData,
  TvdbApiTemplate,
  TvdbClientAuthentication,
} from '../../../models/tvdb/tvdb-client.model';
import type { BaseInit } from '@dvcol/base-http-client';

import type { Updater } from '@dvcol/base-http-client/utils/observable';

class TestableTvdbClient extends BaseTvdbClient {
  publicUpdateAuth(auth: Updater<TvdbClientAuthentication> = {}) {
    return this.updateAuth(auth);
  }

  publicParseResponse(response: TvdbApiResponse<TvdbApiResponseData>): TvdbApiResponse {
    return this._parseResponse(response);
  }

  publicParseHeader<T extends TvdbApiParam = TvdbApiParam>(template: TvdbApiTemplate<T>): HeadersInit {
    return this._parseHeaders(template);
  }

  publicParseUrl<T extends TvdbApiParam = TvdbApiParam>(template: TvdbApiTemplate<T>, params: T): URL {
    return this._parseUrl(template, params);
  }

  publicCall<P extends TvdbApiParam>(template: TvdbApiTemplate<P>, params: P = {} as P, init?: BaseInit) {
    return this._call<P>(template, params, init);
  }
}

describe('base-tvdb-client.ts', () => {
  const client = new TestableTvdbClient(tvdbClientSettings);

  const mockAuth: TvdbClientAuthentication = {
    accessToken: 'access_token',
    expires: 1000,
    userPin: 'user_pin',
  };

  type Params = {
    requiredQuery: string;
    optionalQuery?: string;
    requiredPath: string;
    optionalPath?: string;
    requiredBody: string;
    optionalBody?: string;
  };

  // Mock data for testing
  const mockParams: Params = {
    requiredQuery: 'requiredQuery',
    requiredPath: 'requiredPath',
    requiredBody: 'requiredBody',
  };

  // Mock TraktApiTemplate for testing
  const mockTemplate: TvdbApiTemplate<Params> = {
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
    },
    body: {
      requiredBody: true,
      optionalBody: false,
    },
  };

  const data = {
    data: { results: 'result' },
    message: 'message',
    status: 'success',
  };

  const response = new Response(JSON.stringify(data));

  afterEach(() => {
    vi.clearAllMocks();
    client.publicUpdateAuth();
  });

  it('should be defined', () => {
    expect.assertions(2);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  describe('_parseUrl', () => {
    it('should prefix the url with /v4 if it does not start with it', () => {
      expect.assertions(1);

      const url = client.publicParseUrl({ ...mockTemplate }, mockParams);

      expect(url.pathname).toBe('/v4/movies/requiredPath/popular');
    });

    it('should not prefix the url with /v4 if it starts with it', () => {
      expect.assertions(1);

      const url = client.publicParseUrl({ ...mockTemplate, url: `/v4${mockTemplate.url}` }, mockParams);

      expect(url.pathname).toBe('/v4/movies/requiredPath/popular');
    });
  });

  describe('_parseHeaders', () => {
    it('should parse headers without auth', async () => {
      expect.assertions(1);

      const parsed = client.publicParseHeader(mockTemplate);

      expect(parsed).toMatchObject({
        [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent,
      });
    });

    it('should parse headers with auth', async () => {
      expect.assertions(1);

      client.publicUpdateAuth(mockAuth);
      const parsed = client.publicParseHeader({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: true } });

      expect(parsed).toMatchObject({
        [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent,
        [TraktApiHeaders.Authorization]: `Bearer ${mockAuth.accessToken}`,
      });
    });

    it('should throw error when auth is required but missing', async () => {
      expect.assertions(1);

      const testFunction = () => client.publicParseHeader({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: true } });

      expect(testFunction).toThrow('OAuth required: access_token is missing');
    });
  });

  describe('_parseResponse', () => {
    it('should parse an empty response', async () => {
      expect.assertions(1);

      const parsed = client.publicParseResponse(response);

      const result = await parsed.json();

      expect(result).toMatchObject(data.data);
    });

    it('should parse a response with pagination', async () => {
      expect.assertions(1);

      const paginatedData = {
        ...data,
        links: {
          prev: 'prev',
          next: 'next',
          self: 'self',
          total_items: 1,
          page_size: 1,
        },
      };
      const paginatedResponse = new Response(JSON.stringify(paginatedData));
      const parsed = client.publicParseResponse(paginatedResponse);
      const result = await parsed.json();

      expect(result).toMatchObject({ data: paginatedData.data, pagination: paginatedData.links });
    });

    it('should throw on failure response', async () => {
      expect.assertions(1);

      const failedData = {
        ...data,
        status: 'failure',
      };
      const failedResponse = new Response(JSON.stringify(failedData));
      const parsed = client.publicParseResponse(failedResponse);

      await expect(parsed.json()).rejects.toMatchObject(failedData);
    });

    it('should throw on failed fetch response', async () => {
      expect.assertions(1);

      const failedResponse = new Response(JSON.stringify(data), {
        status: 404,
        statusText: 'Not Found',
      });

      let error;
      try {
        client.publicParseResponse(failedResponse);
      } catch (err) {
        error = err;
      } finally {
        expect(error).toBe(failedResponse);
      }
    });
  });

  it('should make a call to the Trakt API', async () => {
    expect.assertions(2);

    response.headers.set(BaseApiHeaders.UserAgent, tvdbClientSettings.useragent);
    response.headers.set(BaseApiHeaders.ContentType, BaseHeaderContentType.Json);

    const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

    const result = await client.publicCall(mockTemplate, mockParams);

    expect(spyFetch).toHaveBeenCalledWith('https://api4.thetvdb.com/v4/movies/requiredPath/popular?requiredQuery=requiredQuery', {
      body: '{"requiredBody":"requiredBody"}',
      headers: {
        [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent,
      },
      method: HttpMethod.POST,
    });

    expect(result).toBe(response);
  });

  it('should throw an error if auth is missing', async () => {
    expect.assertions(1);

    const testFunction = () => client.publicCall({ ...mockTemplate, opts: { ...mockTemplate.opts, auth: true } }, mockParams);
    await expect(testFunction).rejects.toThrow('OAuth required: access_token is missing');
  });
});
