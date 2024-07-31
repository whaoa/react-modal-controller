import { useContext, useMemo } from 'react';

import { ModalManagerContext, ModalStateContext } from '../components/context';

export function useModal<T = unknown>() {
  const modalManager = useContext(ModalManagerContext);

  if (!modalManager) {
    throw new Error(
      'useModal must be used within ModalManagerContext.Provider, you can wrapper your component with createModal',
    );
  }

  const modalState = useContext(ModalStateContext);

  return useMemo(() => ({
    modalId: modalState?.id || '',

    visible: modalState?.visible || false,

    open() {
      if (modalState && !modalState.visible) {
        modalManager.open(modalState.Modal, modalState.props);
      }
    },

    close(payload?: T) {
      if (modalState) {
        modalState.promise.resolve({ type: 'close', payload });
        modalManager.close(modalState.id);
      }
    },

    remove() {
      if (modalState) {
        modalState.promise.resolve({ type: 'remove', payload: null });
        modalManager.remove(modalState.id);
      }
    },
  }), [modalManager, modalState]);
}
