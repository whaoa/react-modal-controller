import type { FunctionComponent } from 'react';

export type UniqueId = string;

export type ManagedModalProps<P = unknown> = P & {
  modalManager: ModalManager;
  modalState: ModalState | null;
};

export type ManagedModalComponent<P> = FunctionComponent<ManagedModalProps<P>>;

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
  mounted: boolean;
  waitingForMount: boolean;
  promise: ControlledPromise<ModalOperation>;

  Modal: ManagedModalComponent<unknown>;
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
    Modal: ManagedModalComponent<P>,
    props?: P,
    options?: ModalOpenOptions,
  ) => ModalInstance;

  close: (id: ModalInstance['id'], payload?: any) => void;

  remove: (id: ModalInstance['id'], payload?: any) => void;
}
