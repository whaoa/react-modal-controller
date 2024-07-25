import type { FunctionComponent } from 'react';

export type UniqueId = string;

export type ControlledModalComponent<P> = FunctionComponent<P>;

export interface Store<T> {
  getState: () => T;
  setState: (state: Partial<T>) => void;
  getInitialState: () => T;
  subscribe: (listener: (state: T) => void) => (() => void);
}

export interface ControlledPromise<T> {
  instance: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
}

export interface ModalOperation<T = unknown> {
  type: 'close' | 'remove';
  payload: T;
}

export interface ModalState {
  id: UniqueId;
  at: number;
  visible: boolean;
  promise: ControlledPromise<ModalOperation>;

  Modal: ControlledModalComponent<unknown>;
  props: Record<string, any> | undefined;
}

interface ModalManagerState {
  modals: Record<UniqueId, ModalState>;
}

interface ModalInstance {
  id: ModalState['id'];
  promise: ModalState['promise']['instance'];
  close: () => void;
  remove: () => void;
}

type ModalProps<T> = T extends ControlledModalComponent<infer P> ? P : unknown;

export interface ModalManager {
  store: Store<ModalManagerState>;

  open: <
    M extends ControlledModalComponent<unknown>,
    P = ModalProps<M>,
  >(Modal: M, props: P | null) => ModalInstance;

  close: (id: ModalInstance['id']) => void;

  remove: (id: ModalInstance['id']) => void;
}
