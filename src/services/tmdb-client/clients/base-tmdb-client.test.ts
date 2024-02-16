import { describe } from 'vitest';

import { tmdbClientSettings } from '../../../settings/tmdb.api';

import { HttpMethod } from '../../../utils/http.utils';

import { BaseApiHeaders, BaseHeaderContentType } from '../../common/base-client';

import { BaseTmdbClient, parsePageResponse, parseResponse } from './base-tmdb-client';

import type {
  TmdbApiPagination,
  TmdbApiParam,
  TmdbApiResponse,
  TmdbApiResponseData,
  TmdbApiResponsePageData,
  TmdbApiTemplate,
  TmdbClientAuthentication,
  TmdbClientSettings,
} from '../../../models/tmdb/tmdb-client.model';
import type { BaseInit } from '../../common/base-client';

class TestableTmdbClient extends BaseTmdbClient {
  publicParseHeaders<T extends TmdbApiParam = TmdbApiParam>(template: TmdbApiTemplate<T>): HeadersInit {
    return this._parseHeaders(template);
  }

  publicParseUrl<T extends TmdbApiParam = TmdbApiParam>(template: TmdbApiTemplate<T>, params: T): URL {
    return this._parseUrl(template, params);
  }

  publicParseResponse(response: TmdbApiResponse<TmdbApiResponseData | TmdbApiResponsePageData>): TmdbApiResponse {
    return this._parseResponse(response);
  }

  publicCall<P extends TmdbApiParam>(template: TmdbApiTemplate<P>, params: P = {} as P, init?: BaseInit) {
    return this._call<P>(template, params, init);
  }

  publicSetAuth(auth: TmdbClientAuthentication) {
    super.updateAuth(auth);
  }
}

describe('base-tmdb-client.ts', () => {
  const client = new TestableTmdbClient(tmdbClientSettings);

  const mockAuth: TmdbClientAuthentication = {
    accessToken: 'access_token',
    sessionId: 'session_id',
    isGuest: false,
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

  const mockTemplate: TmdbApiTemplate<Params> = {
    url: '/movies/:requiredPath/:optionalPath/popular?requiredQuery=&optionalQuery=',
    method: HttpMethod.POST,
    opts: {
      version: 4,
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

  describe('parseResponse', () => {
    const data = { results: 'result', value: 'value', nested: { key: 'value' } };

    it('should parse response correctly', () => {
      expect.assertions(1);

      const mockResponse: TmdbApiResponseData<typeof data> = {
        success: true,
        status_code: 200,
        status_message: 'OK',
        ...data,
      };
      expect(parseResponse(mockResponse)).toStrictEqual(data);
    });

    it('should throw an error if response is not successful', () => {
      expect.assertions(1);

      const mockResponse = {
        success: false,
        status_code: 400,
        status_message: 'Bad Request',
      };

      const errorSpy = vi.fn();
      try {
        parseResponse(mockResponse);
      } catch (e) {
        errorSpy(e);
      } finally {
        expect(errorSpy).toHaveBeenCalledWith(mockResponse);
      }
    });

    it('should parse page response correctly', () => {
      expect.assertions(1);

      const common = { id: 1, name: 'name' };
      const pagination: TmdbApiPagination = {
        page: 1,
        total_pages: 10,
        total_results: 100,
      };

      const mockResponse: TmdbApiResponsePageData<typeof data, typeof common> = {
        results: [data, data],
        ...common,
        ...pagination,
      };
      expect(parsePageResponse<typeof data, typeof common>(mockResponse)).toStrictEqual({
        data: mockResponse.results,
        pagination,
        common,
      });
    });
  });

  describe('_parseHeaders', () => {
    afterEach(() => {
      client.publicSetAuth({});
    });

    it('should parse headers without auth or read token', () => {
      expect.assertions(1);

      const clientNoTokenSettings: Partial<TmdbClientSettings> = { ...tmdbClientSettings };
      delete clientNoTokenSettings.readToken;

      const clientNoToken = new TestableTmdbClient(clientNoTokenSettings as TmdbClientSettings);
      const parsed = clientNoToken.publicParseHeaders(mockTemplate);

      expect(parsed).toMatchObject({
        [BaseApiHeaders.UserAgent]: tmdbClientSettings.useragent,
        [BaseApiHeaders.Accept]: BaseHeaderContentType.Json,
        [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
      });
    });

    it('should parse headers without auth but with read token', () => {
      expect.assertions(1);

      client.publicSetAuth(mockAuth);

      const parsed = client.publicParseHeaders(mockTemplate);

      expect(parsed).toMatchObject({
        [BaseApiHeaders.UserAgent]: tmdbClientSettings.useragent,
        [BaseApiHeaders.Accept]: BaseHeaderContentType.Json,
        [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        [BaseApiHeaders.Authorization]: `Bearer ${tmdbClientSettings.readToken}`,
      });
    });

    describe('with token auth', () => {
      it('should parse headers with token auth and access token', () => {
        expect.assertions(1);

        client.publicSetAuth(mockAuth);

        const parsed = client.publicParseHeaders({
          ...mockTemplate,
          opts: {
            ...mockTemplate.opts,
            version: 4,
            auth: 'token',
          },
        });

        expect(parsed).toMatchObject({
          [BaseApiHeaders.UserAgent]: tmdbClientSettings.useragent,
          [BaseApiHeaders.Accept]: BaseHeaderContentType.Json,
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
          [BaseApiHeaders.Authorization]: `Bearer ${mockAuth.accessToken}`,
        });
      });
    });

    it('should parse headers with token auth and without access token', () => {
      expect.assertions(1);

      const error = vi.fn();

      try {
        client.publicParseHeaders({
          ...mockTemplate,
          opts: {
            ...mockTemplate.opts,
            version: 4,
            auth: 'token',
          },
        });
      } catch (e) {
        error(e);
      } finally {
        expect(error).toHaveBeenCalledWith(new Error('User auth required: access_token is missing'));
      }
    });

    describe('with session auth', () => {
      it('should parse headers with session auth and session id', () => {
        expect.assertions(1);

        client.publicSetAuth({ ...mockAuth, accessToken: undefined });

        const parsed = client.publicParseHeaders({
          ...mockTemplate,
          opts: {
            ...mockTemplate.opts,
            version: 4,
            auth: 'session',
          },
        });

        expect(parsed).toMatchObject({
          [BaseApiHeaders.UserAgent]: tmdbClientSettings.useragent,
          [BaseApiHeaders.Accept]: BaseHeaderContentType.Json,
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        });
      });

      it('should parse headers with session auth and without session id', () => {
        expect.assertions(1);

        const error = vi.fn();

        try {
          client.publicParseHeaders({
            ...mockTemplate,
            opts: {
              ...mockTemplate.opts,
              version: 4,
              auth: 'session',
            },
          });
        } catch (e) {
          error(e);
        } finally {
          expect(error).toHaveBeenCalledWith(new Error('User auth required: session_id is missing'));
        }
      });
    });

    it('should parse headers with truthy auth and without access token or session id', () => {
      expect.assertions(1);

      const error = vi.fn();

      try {
        client.publicParseHeaders({
          ...mockTemplate,
          opts: {
            ...mockTemplate.opts,
            version: 4,
            auth: true as false,
          },
        });
      } catch (e) {
        error(e);
      } finally {
        expect(error).toHaveBeenCalledWith(new Error('User auth required: session_id or access_token is missing'));
      }
    });
  });

  describe('_parseUrl', () => {
    it('should prefix the url with /v4 if it does not start with it', () => {
      expect.assertions(1);

      const url = client.publicParseUrl({ ...mockTemplate }, mockParams);

      expect(url.pathname).toBe('/4/movies/requiredPath/popular');
    });

    it('should not prefix the url with /4 if it starts with it', () => {
      expect.assertions(1);

      const url = client.publicParseUrl({ ...mockTemplate, url: `/4${mockTemplate.url}` }, mockParams);

      expect(url.pathname).toBe('/4/movies/requiredPath/popular');
    });

    it('should add api key to the url if no access token or read token is present', () => {
      expect.assertions(1);

      const settings: Partial<TmdbClientSettings> = { ...tmdbClientSettings, readToken: undefined };
      const clientNoToken = new TestableTmdbClient(settings as TmdbClientSettings);
      const url = clientNoToken.publicParseUrl({ ...mockTemplate }, mockParams);

      expect(url.searchParams.get('api_key')).toBe(tmdbClientSettings.apiKey);
    });

    it('should add session id to the params if present', () => {
      expect.assertions(1);

      client.publicSetAuth({ ...mockAuth, accessToken: undefined });

      const url = client.publicParseUrl({ ...mockTemplate }, mockParams);

      expect(url.searchParams.get('session_id')).toBe(mockAuth.sessionId);
    });
  });

  describe('_parseResponse', () => {
    const data = { results: 'result', value: 'value', nested: { key: 'value' } };

    const mockResponse: TmdbApiResponseData<typeof data> = {
      success: true,
      status_code: 200,
      status_message: 'OK',
      ...data,
    };
    const response = new Response(JSON.stringify(mockResponse));

    it('should parse response correctly', async () => {
      expect.assertions(2);

      const res = client.publicParseResponse(response);

      expect(res).toStrictEqual(response);

      await expect(res.json()).resolves.toStrictEqual(data);
    });
  });
});
