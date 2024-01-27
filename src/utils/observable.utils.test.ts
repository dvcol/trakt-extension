import { afterEach, describe, expect, it, vi } from 'vitest';

import { Observable, ObservableState } from './observable.utils';

describe('observable.utils.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe and unsubscribe observers in Observable', () => {
    expect.assertions(3);

    const observable = new Observable<number>();
    const observer = vi.fn();
    const unsubscribe = observable.subscribe(observer);

    observable.update(1);
    expect(observer).toHaveBeenCalledWith(1);

    unsubscribe();
    observable.update(2);
    expect(observer).not.toHaveBeenCalledWith(2);

    expect(observable.unsubscribe()).toBeTruthy();
  });

  it('should get and update state in ObservableState', () => {
    expect.assertions(3);

    const observableState = new ObservableState<number>(0);
    const observer = vi.fn();
    observableState.subscribe(observer);

    expect(observableState.state).toBe(0);

    observableState.update(1);
    expect(observer).toHaveBeenCalledWith(1);

    observableState.update(state => state + 1);
    expect(observer).toHaveBeenCalledWith(2);
  });
});
