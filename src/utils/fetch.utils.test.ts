import { afterEach, describe, it, vi } from 'vitest';

import { CancellableFetch } from './fetch.utils';

describe('fetch.utils.ts', () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok'));
  const spyAbortController = vi.spyOn(AbortController.prototype, 'abort');

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an instance from constructor', () => {
    expect.assertions(2);

    const fetch = new CancellableFetch(true);
    expect(fetch).toBeInstanceOf(CancellableFetch);
    expect(fetch.signal).toBeInstanceOf(AbortSignal);
  });

  it('should execute a fetch call', async () => {
    expect.assertions(3);

    const fetch = new CancellableFetch();
    const response = await fetch.fetch('https://example.com');

    expect(spyFetch).toHaveBeenCalledWith('https://example.com', { signal: fetch.signal });
    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBeTruthy();
  });

  it('should call abort controller', () => {
    expect.assertions(1);

    const fetch = new CancellableFetch();

    fetch.cancel();

    expect(spyAbortController).toHaveBeenCalledWith();
  });

  it('should create a new instance and execute from static fetch', async () => {
    expect.assertions(5);

    const promise = CancellableFetch.fetch('https://example.com');

    expect(promise).toHaveProperty('cancel');
    expect(promise).toHaveProperty('signal');
    expect(promise.signal).toBeInstanceOf(AbortSignal);

    const response = await promise;

    expect(spyFetch).toHaveBeenCalledWith('https://example.com', { signal: promise.signal });
    expect(response).toBeInstanceOf(Response);
  });
});
