import React from 'react';

import { useManagerModalStack } from '../hooks/manager';

import type { ModalManager } from '../core/types';

export interface ModalStackPlacementProps {
  modalManager: ModalManager;
}

export function ModalStackPlacement(props: ModalStackPlacementProps) {
  const { modalManager } = props;

  const modals = useManagerModalStack(modalManager);

  return (
    <>
      {modals.map((modal) => (
        <modal.Modal
          key={modal.id}
          {...modal.props}
          modalManager={modalManager}
          modalState={modal}
        />
      ))}
    </>
  );
}
