import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { tvdbClientSettings } from '../../../settings/tvdb.api';

import { CancellableFetch } from '../../../utils/fetch.utils';
import { HttpMethod } from '../../../utils/http.utils';
import { BaseApiHeaders, BaseHeaderContentType } from '../../common/base-client';

import { hasOwnProperty } from '../../common/test.utils';
import { tvdbApi } from '../api/tvdb-api.endpoint';

import { TvdbClient } from './tvdb-client';

import type { TvdbClientAuthentication } from '../../../models/tvdb/tvdb-client.model';

describe('tvdb-client.ts', () => {
  const tvdbClient = new TvdbClient(tvdbClientSettings);

  const data = {
    data: { results: 'result' },
    message: 'message',
    status: 'success',
  };

  const fetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(new Response(JSON.stringify(data)));

  const auth: TvdbClientAuthentication = {
    accessToken: 'access_token',
  };

  const mockTokenResponse = { ...data, data: { token: auth.accessToken } };

  const mockNow = 100;

  const payload = {
    headers: {
      [BaseApiHeaders.Authorization]: `Bearer ${auth.accessToken}`,
      [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent,
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
    },
    method: HttpMethod.GET,
  };

  beforeEach(async () => {
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
    await tvdbClient.importAuthentication(auth);
  });

  afterEach(async () => {
    await tvdbClient.importAuthentication({});
    await tvdbClient.clearCache();

    vi.clearAllMocks();
  });

  describe('tvdbClient', () => {
    it('should have every endpoint', () => {
      expect.hasAssertions();

      hasOwnProperty(tvdbApi, tvdbClient);
    });

    it('should query companies endpoint', async () => {
      expect.assertions(1);

      await tvdbClient.companies.list();

      expect(fetch).toHaveBeenCalledWith(new URL(`${tvdbClientSettings.version}/companies`, tvdbClientSettings.endpoint).toString(), payload);
    });

    it('should query cached companies endpoint', async () => {
      expect.assertions(2);

      await tvdbClient.companies.list.cached();
      await tvdbClient.companies.list.cached();
      await tvdbClient.companies.list.cached();

      expect(fetch).toHaveBeenCalledWith(new URL(`${tvdbClientSettings.version}/companies`, tvdbClientSettings.endpoint).toString(), payload);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should query authentication without user pin', async () => {
      expect.assertions(2);

      fetch.mockResolvedValue(new Response(JSON.stringify(mockTokenResponse)));

      // clear auth
      await tvdbClient.importAuthentication({});
      await tvdbClient.authenticate();

      expect(fetch).toHaveBeenCalledWith(new URL(`${tvdbClientSettings.version}/login`, tvdbClientSettings.endpoint).toString(), {
        ...payload,
        headers: { [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent, [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json },
        method: HttpMethod.POST,
        body: `{"apiKey":"${tvdbClientSettings.apiKey}"}`,
      });

      expect(tvdbClient.auth).toMatchObject({
        accessToken: mockTokenResponse.data.token,
        expires: mockNow + tvdbClientSettings.tokenTTL,
      });
    });

    it('should query authentication with user pin', async () => {
      expect.assertions(2);

      const mockToken = { ...data, data: { token: auth.accessToken } };
      const mockUserPin = 'userPin';

      fetch.mockResolvedValue(new Response(JSON.stringify(mockToken)));

      // clear auth
      await tvdbClient.importAuthentication({});
      await tvdbClient.authenticate(mockUserPin);

      expect(fetch).toHaveBeenCalledWith(new URL(`${tvdbClientSettings.version}/login`, tvdbClientSettings.endpoint).toString(), {
        ...payload,
        headers: { [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent, [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json },
        method: HttpMethod.POST,
        body: `{"apiKey":"${tvdbClientSettings.apiKey}","pin":"${mockUserPin}"}`,
      });

      expect(tvdbClient.auth).toMatchObject({
        accessToken: mockToken.data.token,
        userPin: mockUserPin,
        expires: mockNow + tvdbClientSettings.tokenTTL,
      });
    });

    it('should load authentication', async () => {
      expect.assertions(2);

      const mockAuth = { ...auth, userPin: 'userPin', expires: 2000 };

      await tvdbClient.importAuthentication(mockAuth);

      expect(fetch).not.toHaveBeenCalled();
      expect(tvdbClient.auth).toMatchObject(mockAuth);
    });

    it('should load expired authentication and attempt refresh', async () => {
      expect.assertions(3);

      fetch.mockResolvedValue(new Response(JSON.stringify(mockTokenResponse)));

      const mockAuth = { ...auth, userPin: 'userPin', expires: 0 };

      await tvdbClient.importAuthentication(mockAuth);

      expect(fetch).toHaveBeenCalledWith(new URL(`${tvdbClientSettings.version}/login`, tvdbClientSettings.endpoint).toString(), {
        ...payload,
        headers: { [BaseApiHeaders.UserAgent]: tvdbClientSettings.useragent, [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json },
        method: HttpMethod.POST,
        body: `{"apiKey":"${tvdbClientSettings.apiKey}","pin":"${mockAuth.userPin}"}`,
      });
      expect(tvdbClient.auth).not.toMatchObject(mockAuth);
      expect(tvdbClient.auth).toMatchObject({
        accessToken: mockTokenResponse.data.token,
        expires: mockNow + tvdbClientSettings.tokenTTL,
      });
    });
  });
});
