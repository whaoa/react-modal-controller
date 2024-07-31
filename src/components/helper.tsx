import React, { useEffect } from 'react';

import { markModalComponentAsMounted, markModalComponentAsUnmounted } from '../core/manager';

import { ModalManagerContext, ModalStateContext } from './context';

import type { ComponentType } from 'react';
import type { ManagedModalComponent } from '../core/types';

export function createModal<T>(Modal: ComponentType<T>): ManagedModalComponent<T> {
  return function ControlledModal(props) {
    const { modalManager, modalState, ...otherProps } = props;

    const modalId = modalState?.id;

    useEffect(
      () => {
        if (modalId) {
          markModalComponentAsMounted(modalManager, modalId);
        }
        return () => {
          if (modalId) {
            markModalComponentAsUnmounted(modalManager, modalId);
          }
        };
      },
      [modalManager, modalId],
    );

    if (!modalState) {
      return null;
    }

    return (
      <ModalManagerContext.Provider value={modalManager}>
        <ModalStateContext.Provider value={modalState}>
          <Modal {...modalState.props} {...otherProps as any} />
        </ModalStateContext.Provider>
      </ModalManagerContext.Provider>
    );
  };
}
