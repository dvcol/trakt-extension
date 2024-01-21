/**
 * Represents a cancellable promise with a cancellation function.
 *
 * @template T - The type of the promise result.
 */
export type CancellablePromise<T> = Omit<Promise<T>, 'then'> & {
  signal: AbortSignal;
  cancel(): void;
  then(...params: Parameters<Promise<T>['then']>): CancellablePromise<T>;
};

/**
 * A wrapper class for making cancellable fetch requests using the Fetch API.
 *
 * @class CancellableFetch
 */
export class CancellableFetch {
  private readonly _controller = new AbortController();
  private readonly _debug: boolean;

  /**
   * Gets the AbortSignal associated with the AbortController, allowing external code to listen for cancellation events.
   *
   * @readonly
   * @type {AbortSignal}
   * @memberof CancellableFetch
   */
  get signal() {
    return this._controller.signal;
  }

  /**
   * Creates an instance of CancellableFetch.
   *
   * @param {boolean} [debug=false] - Indicates whether debug information should be logged when a fetch request is cancelled.
   * @memberof CancellableFetch
   */
  constructor(debug: boolean = false) {
    this._debug = debug;
  }

  /**
   * Performs a fetch request with optional cancellation support.
   *
   * @param {RequestInfo | URL} input - The resource URL or a Request object.
   * @param {Omit<RequestInit, 'signal'>} [init] - Optional RequestInit options, excluding the 'signal' property.
   * @returns {Promise<Response>} A Promise that resolves to the Response to that request.
   * @memberof CancellableFetch
   * @throws {Error} If an error occurs during the fetch operation, other than an 'AbortError'.
   */
  async fetch(input: RequestInfo | URL, init?: Omit<RequestInit, 'signal'>): Promise<Response> {
    try {
      return await fetch(input, { ...init, signal: this._controller.signal });
    } catch (error) {
      if (error instanceof Error && error?.name === 'AbortError') {
        if (this._debug) console.error('Fetch request was cancelled.', { input, init, error });
        return Promise.reject(error);
      }
      throw error;
    }
  }

  /**
   * Performs a fetch request using a new instance of CancellableFetch.
   *
   * @static
   * @template T - The type of the promise result.
   * @param {RequestInfo | URL} input - The resource URL or a Request object.
   * @param {Omit<RequestInit, 'signal'>} [init] - Optional RequestInit options, excluding the 'signal' property.
   * @returns {CancellablePromise<T>} A cancellable promise that resolves to the Response to the fetch request.
   * @memberof CancellableFetch
   */
  static fetch<T extends Response = Response>(input: RequestInfo | URL, init?: Omit<RequestInit, 'signal'>): CancellablePromise<T> {
    const cancellableFetch = new CancellableFetch();
    const promise = cancellableFetch.fetch(input, init) as CancellablePromise<T>;

    promise.cancel = () => cancellableFetch.cancel();
    promise.signal = cancellableFetch.signal;

    const _then = promise.then;
    promise.then = (...params) => {
      const thenPromise = _then.bind(promise)(...params);
      thenPromise.cancel = () => cancellableFetch.cancel();
      thenPromise.signal = cancellableFetch.signal;
      return thenPromise;
    };
    return promise;
  }

  /**
   * Cancels the currently active fetch request by aborting the associated AbortController.
   *
   * @memberof CancellableFetch
   */
  cancel() {
    this._controller.abort();
  }
}
