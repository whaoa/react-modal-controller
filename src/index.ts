export { createModalManager } from './core/manager';

export type {
  UniqueId,
  ModalManager,
  ModalState,
  ModalOperation,
  ModalInstance,
  ModalOpenOptions,
} from './core/types';

export { ModalManagerContext, ModalStateContext } from './components/context';

export { createModal } from './components/helper';
export type { ControlledModalComponent, ControlledModalProps } from './core/types';

export { ModalPlacement } from './components/placement';
export type { ModalPlacementProps } from './components/placement';

export { ModalController } from './components/controller';
export type { ModalControllerProps, ModalControllerRef } from './components/controller';

export { useManagerState, useManagerModals } from './hooks/manager';
export { useModal } from './hooks/modal';
