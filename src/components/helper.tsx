import React from 'react';

import { ModalManagerContext, ModalStateContext } from './context';

import type { ComponentType } from 'react';
import type { ControlledModalComponent } from '../core/types';

export function createModal<T>(Modal: ComponentType<T>): ControlledModalComponent<T> {
  return function ControlledModal(props) {
    const { modalManager, modalState, ...otherProps } = props;

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
