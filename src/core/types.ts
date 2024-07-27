import type { FunctionComponent } from 'react';

export type UniqueId = string;

export type ControlledModalProps<P = unknown> = P & {
  modalManager: ModalManager;
  modalState: ModalState | null;
};

export type ControlledModalComponent<P> = FunctionComponent<ControlledModalProps<P>>;

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

export interface ModalOperation<T = any> {
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

export interface ModalManagerState {
  modals: Record<UniqueId, ModalState>;
}

export interface ModalInstance {
  id: ModalState['id'];
  promise: ModalState['promise']['instance'];
  close: () => void;
  remove: () => void;
}

export interface ModalOpenOptions {
  modalId?: UniqueId;
}

export interface ModalManager {
  store: Store<ModalManagerState>;

  open: <P>(
    Modal: ControlledModalComponent<P>,
    props: P | null,
    options?: ModalOpenOptions,
  ) => ModalInstance;

  close: (id: ModalInstance['id']) => void;

  remove: (id: ModalInstance['id']) => void;
}
