export type Observer<T> = (next: T, prev?: T) => void;
export type UpdateFunction<T> = (state: T) => T;
export type Updater<T> = T | UpdateFunction<T>;

const isFunction = <T>(value: T | UpdateFunction<T>): value is UpdateFunction<T> => typeof value === 'function';

/**
 * Represents an observable object that can be observed by multiple observers.
 *
 * @class Observable
 * @template T - The type of data that observers will receive.
 */
export class Observable<T> {
  protected _observers: Set<Observer<T>> = new Set();

  /**
   * Notifies all observers with optional data.
   *
   * @protected
   * @param {T} data - The new data to be sent to observers.
   * @memberof Observable
   */
  protected _notify(data: T) {
    this._observers.forEach(observer => observer(data));
  }

  /**
   * Updates the observers with the new data.
   *
   * @param {T} data - The new data to be sent to observers.
   * @memberof Observable
   */
  update(data: T) {
    this._notify(data);
  }

  /**
   * Subscribes an observer to the observable and returns an unsubscribe function.
   *
   * @param {Observer<T>} observer - The observer function to be added.
   * @returns {() => boolean} An unsubscribe function that removes the observer.
   * @memberof Observable
   */
  subscribe(observer: Observer<T>): () => boolean {
    this._observers.add(observer);
    return () => this.unsubscribe(observer);
  }

  /**
   * Unsubscribes an observer from the observable.
   * If no observer is provided, unsubscribes all observers.
   *
   * @param {Observer<T>} [observer] - The observer to be removed.
   * @returns {boolean} True if the observer(s) were successfully removed, false otherwise.
   * @memberof Observable
   */
  unsubscribe(observer?: Observer<T>): boolean {
    if (observer) return this._observers.delete(observer);
    this._observers.clear();
    return true;
  }
}

/**
 * Represents an observable object with state that can be observed and updated.
 *
 * @class ObservableState
 * @extends {Observable<T>}
 * @template T - The type of the state.
 */
export class ObservableState<T> extends Observable<T> {
  private readonly _mutable: boolean;
  private _state: T;

  /**
   * Notifies all observers with optional data and previous state.
   *
   * @protected
   * @param {T} data - The new data to be sent to observers.
   * @param  {T} prev - the previous data (defaults to this._state).
   * @memberof Observable
   */
  protected _notify(data: T, prev: T = this._state) {
    this._observers.forEach(observer => observer(data, prev));
  }

  /**
   * Gets the current state of the observable.
   *
   * @readonly
   * @type {T} The current state.
   * @memberof ObservableState
   */
  get state() {
    return this._state;
  }

  /**
   * Creates an instance of ObservableState with an initial state and mutability option.
   *
   * @param {T} state - The initial state.
   * @param {boolean} [mutable=false] - Indicates whether the state is mutable.
   * @memberof ObservableState
   */
  constructor(state: T, mutable: boolean = false) {
    super();
    this._state = state;
    this._mutable = mutable;
  }

  /**
   * Updates the state based on mutability and freezes it if necessary.
   *
   * @private
   * @param {T} state - The new state.
   * @memberof ObservableState
   */
  private _update(state: T) {
    if (this._mutable) this._state = state;
    else this._state = Object.freeze(state);
  }

  /**
   * Updates the state based on either a direct value or an update function.
   * Notifies observers with the new state.
   *
   * @param {T | UpdateFunction<T>} state - The new state or an update function.
   * @memberof ObservableState
   */
  update(state: Updater<T>) {
    const data = isFunction(state) ? state(this._state) : state;
    super.update(data);
    this._update(data);
  }
}
