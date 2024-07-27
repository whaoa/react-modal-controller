import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { createId } from '../core/utils';
import { createModalManager } from '../core/manager';
import { useManagerModal } from '../hooks/manager';

import type { ReactNode, RefAttributes } from 'react';
import type { ControlledModalComponent, ModalInstance } from '../core/types';

export interface ModalControllerRef<P = unknown> {
  open: (props?: Partial<P>) => ModalInstance;
  close: (payload?: any) => void;
  remove: () => void;
}

export type ModalControllerProps<P = unknown> = Partial<P> & {
  controlledModal: ControlledModalComponent<P>;
};

function useModalId() {
  const [modalId] = useState(createId);
  return modalId;
}

function useModalManager() {
  const [mm] = useState(createModalManager);
  return mm;
}

export const ModalController = forwardRef<ModalControllerRef, ModalControllerProps>(
  (props, ref) => {
    const { controlledModal: Modal, ...otherProps } = props;

    const modalId = useModalId();
    const modalManager = useModalManager();

    const modalState = useManagerModal(modalManager, modalId) || null;

    useImperativeHandle(ref, () => ({
      open(args) {
        return modalManager.open(Modal, (args || null) as any, { modalId });
      },
      close() {
        modalManager.close(modalId);
      },
      remove() {
        modalManager.remove(modalId);
      },
    }), [Modal, modalId, modalManager]);

    return (
      <Modal {...(otherProps as any)} modalManager={modalManager} modalState={modalState} />
    );
  },
) as <P>(props: ModalControllerProps<P> & RefAttributes<ModalControllerRef<P>>) => ReactNode;
