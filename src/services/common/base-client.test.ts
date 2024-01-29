import { describe, expect, it } from 'vitest';

import { TraktApiHeaders } from '../../models/trakt/trakt-client.model';

import { CancellableFetch } from '../../utils/fetch.utils';

import { HttpMethod } from '../../utils/http.utils';

import {
  BaseApiHeaders,
  BaseClient,
  BaseHeaderContentType,
  type BaseOptions,
  type BaseQuery,
  type BaseTemplate,
  ClientEndpoint,
  type IApi,
  parseBody,
  parseUrl,
  type ResponseOrTypedResponse,
} from './base-client';

import type { CacheStore } from '../../utils/cache.utils';
import type { CancellablePromise } from '../../utils/fetch.utils';

import type { Updater } from '../../utils/observable.utils';
import type { RecursiveRecord } from '../../utils/typescript.utils';

const mockEndpoint = 'https://api-endpoint.url';

type TestableAuthentication = Record<string, string | number>;

class TestableBaseClient extends BaseClient {
  constructor(settings: BaseOptions, authentication: TestableAuthentication, api: IApi) {
    super(settings, authentication, api);
  }

  get callListeners() {
    return this._callListeners;
  }

  publicUpdateAuth(auth: Updater<TestableAuthentication>) {
    return this.updateAuth(auth);
  }

  // eslint-disable-next-line class-methods-use-this -- abstract method
  _parseHeaders(): HeadersInit {
    return {
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
    };
  }

  // eslint-disable-next-line class-methods-use-this -- abstract method
  _parseUrl<T extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<T>, params: T): URL {
    return parseUrl(template, params, mockEndpoint);
  }

  // eslint-disable-next-line class-methods-use-this -- abstract method
  _parseBody<T extends RecursiveRecord = RecursiveRecord>(body: Record<string, string | boolean>, params: T): BodyInit {
    return parseBody(body, params);
  }

  // eslint-disable-next-line class-methods-use-this -- abstract method
  _parseResponse(_response: Response): Response {
    return _response;
  }

  publicCall<T extends RecursiveRecord = RecursiveRecord>(template: BaseTemplate<T>, params: T): Promise<Response> {
    return this._call(template, params);
  }
}

describe('base-client.ts', () => {
  const cacheStore: CacheStore<ResponseOrTypedResponse> = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    delete: vi.fn(),
  };

  const api: IApi = {
    endpoint: new ClientEndpoint({
      method: HttpMethod.GET,
      url: '/endpoint',
    }),
    anotherEndpoint: new ClientEndpoint({
      method: HttpMethod.GET,
      url: '/another-endpoint',
    }),
    endpointWithParams: new ClientEndpoint({
      method: HttpMethod.GET,
      url: '/endpoint/:param',
      opts: {
        parameters: {
          path: {
            param: true,
          },
        },
      },
    }),
    endpointWithValidation: new ClientEndpoint({
      method: HttpMethod.GET,
      url: '/endpoint/:param',
      opts: {
        parameters: {
          path: {
            param: true,
          },
        },
        validate: {
          param: (value: string) => value === 'valid',
        },
      },
    }),
    endpointWithBody: new ClientEndpoint({
      method: HttpMethod.POST,
      url: '/endpoint',
      body: {
        param: true,
      },
    }),
    endpointWithInit: new ClientEndpoint({
      method: HttpMethod.GET,
      url: '/endpoint',
      init: {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      },
    }),
  };

  const client = new TestableBaseClient({ cacheStore }, {}, api);
  const auth: TestableAuthentication = {
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires: 1234567890,
    state: 'state',
  };
  const query: BaseQuery = {
    request: {
      input: 'https://api.trakt.tv/oauth/device/code',
      init: {
        headers: {
          [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
          [TraktApiHeaders.TraktApiKey]: 'client_id',
          [TraktApiHeaders.TraktApiVersion]: '2',
        },
      },
    },
    query: new Promise(() => {}) as CancellablePromise<unknown>,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  const hasOwnProperty = (template: RecursiveRecord, _client: RecursiveRecord) =>
    Object.keys(template).forEach(endpoint => {
      expect(_client).toHaveProperty(endpoint);
      if (!(template[endpoint] instanceof ClientEndpoint)) {
        hasOwnProperty(template[endpoint], _client[endpoint]);
      } else {
        expect(_client[endpoint]).toBeTypeOf('function');
        expect(_client[endpoint].method).toBeDefined();
        expect(_client[endpoint].url).toBeDefined();
        expect(_client[endpoint].opts).toBeDefined();
        if (template[endpoint].validate) expect(_client[endpoint].validate).toBeDefined();
        if (template[endpoint].body) expect(_client[endpoint].body).toBeDefined();
        if (template[endpoint].init) expect(_client[endpoint].init).toBeDefined();
      }
    });

  it('should have every endpoint', () => {
    expect.hasAssertions();

    hasOwnProperty(api, client);
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
  const mockParams: Params = {
    requiredQuery: 'requiredQuery',
    requiredPath: 'requiredPath',
    requiredBody: 'requiredBody',
  };

  // Mock TraktApiTemplate for testing
  const mockTemplate: BaseTemplate<Params> = {
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

  describe('parseBody', () => {
    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const result = parseBody(mockTemplate.body!, mockParams);
      expect(result).toBe('{"requiredBody":"requiredBody"}');
    });

    it('should parse body to JSON string', () => {
      expect.assertions(1);

      const mockBody: Record<string, unknown> = { ...mockParams, optionalBody: 'optionalBody' };
      delete mockBody.requiredBody;
      const testFunction = () => parseBody(mockTemplate.body!, mockBody);
      expect(testFunction).toThrow("Missing mandatory body parameter: 'requiredBody'");
    });
  });

  describe('parseUrl', () => {
    it('should construct a valid URL for Trakt API request', async () => {
      expect.assertions(2);

      const result = parseUrl(mockTemplate, mockParams, mockEndpoint);

      expect(result).toBeInstanceOf(URL);
      expect(result?.toString()).toBe(`${mockEndpoint}/movies/requiredPath/popular?requiredQuery=requiredQuery`);
    });

    it('should throw an error for missing mandatory query parameter', async () => {
      expect.assertions(1);

      const testFunction = () => parseUrl(mockTemplate, { ...mockParams, requiredQuery: '' }, mockEndpoint);
      expect(testFunction).toThrow("Missing mandatory query parameter: 'requiredQuery'");
    });

    it('should throw an error for missing mandatory path parameter', async () => {
      expect.assertions(1);

      const testFunction = () => parseUrl(mockTemplate, { ...mockParams, requiredPath: '' }, mockEndpoint);
      expect(testFunction).toThrow("Missing mandatory path parameter: 'requiredPath'");
    });
  });

  describe('call', () => {
    it('should call an endpoint', async () => {
      expect.assertions(2);

      const response = new Response();

      const spyFetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(response);

      const result = await client.publicCall(mockTemplate, mockParams);

      expect(spyFetch).toHaveBeenCalledWith(`${mockEndpoint}/movies/requiredPath/popular?requiredQuery=requiredQuery`, {
        body: '{"requiredBody":"requiredBody"}',
        headers: {
          [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
        },
        method: HttpMethod.POST,
      });

      expect(result).toBe(response);
    });
  });
});
