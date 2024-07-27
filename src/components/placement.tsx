import React from 'react';

import { useManagerModals } from '../hooks/manager';

import type { ModalManager } from '../core/types';

export interface ModalPlacementProps {
  modalManager: ModalManager;
}

export function ModalPlacement(props: ModalPlacementProps) {
  const { modalManager } = props;

  const modals = useManagerModals(modalManager);

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
