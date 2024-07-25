import type { ControlledPromise, Store, UniqueId } from './types';

export const createId = (() => {
  let id = 0;
  return (): UniqueId => (++id).toString();
})();

export function createPromise<T>(): ControlledPromise<T> {
  type PromiseValue = ControlledPromise<T>;
  let resolve: PromiseValue['resolve'];
  let reject: PromiseValue['reject'];
  const instance: PromiseValue['instance'] = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { instance, resolve: resolve!, reject: reject! };
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;

  const listeners: Set<(s: typeof state) => void> = new Set();

  return {
    getInitialState: () => initialState,

    getState: () => state,

    setState: (partial) => {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener(state));
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
