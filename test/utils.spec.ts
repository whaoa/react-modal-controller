import { createId, createPromise, createStore } from '../src/core/utils';

it('create a unique id', () => {
  const id1 = createId();
  expect(typeof id1).toBe('string');
  const id2 = createId();
  expect(id1).not.toBe(id2);
});

it('create a controlled promise', async () => {
  const p1 = createPromise<null>();
  p1.resolve(null);
  await expect(p1.instance).resolves.toBe(null);

  const p2 = createPromise<null>();
  const error = new Error('rejected promise error');
  p2.reject(error);
  await expect(p2.instance).rejects.toBe(error);
});

it('create a store', () => {
  const defaultValue = { count: 0, list: [] };
  const store = createStore(defaultValue);

  expect(store.getInitialState()).toBe(defaultValue);
  expect(store.getState()).toBe(defaultValue);

  const onStateChange = jest.fn();
  const removeStateChangeListener = store.subscribe(onStateChange);
  store.setState({ count: 1 });

  expect(store.getInitialState()).toBe(defaultValue);

  const currentState = store.getState();

  expect(currentState).not.toBe(defaultValue);
  expect(currentState.list).toBe(defaultValue.list);
  expect(currentState.count).toBe(1);

  expect(onStateChange).toHaveBeenCalledTimes(1);
  expect(onStateChange).toHaveBeenCalledWith(currentState);

  removeStateChangeListener();
  store.setState({ count: 0 });

  expect(onStateChange).toHaveBeenCalledTimes(1);
});
