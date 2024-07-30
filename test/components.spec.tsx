import React from 'react';
import { act, fireEvent, getByRole, queryByRole, render, screen } from '@testing-library/react';

import { createModalManager } from '../src/core/manager';
import { useModal } from '../src/hooks/modal';
import { createModal } from '../src/components/helper';
import { ModalPlacement } from '../src/components/placement';
import { ModalController } from '../src/components/controller';

import type { ModalControllerRef } from '../src/components/controller';

function Modal(props: { description?: string }) {
  const { description } = props;
  const { visible, close, remove } = useModal();
  return (
    <div role="modal-root" style={{ display: visible ? 'block' : 'none' }}>
      {visible && (
        <div role="modal-content">
          <div role="modal-body">{description}</div>
          <div role="modal-footer">
            <button type="button" role="modal-remove" onClick={() => remove()}>remove</button>
            <button type="button" role="modal-close" onClick={() => close()}>close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const ControlledModal = createModal(Modal);

it('mount ModalPlacement component', () => {
  const mm = createModalManager();

  const elementId = 'modal-placement';

  render(
    <div role={elementId}>
      <ModalPlacement modalManager={mm} />
    </div>,
  );

  const placement = screen.getByRole(elementId);

  expect(placement).toBeEmptyDOMElement();

  let modal: ReturnType<typeof mm['open']>;
  let modalState: ReturnType<typeof mm.store.getState>['modals'][string];

  const modalContent = 'modal content';
  act(() => {
    modal = mm.open(ControlledModal, { description: modalContent });
    modalState = mm.store.getState().modals[modal.id]!;
  });

  expect(modal!).toBeDefined();
  expect(modalState!).toBeDefined();
  expect(modalState!).toMatchObject({
    id: modal!.id,
    visible: false,
    mounted: false,
    waitingForMount: true,
  });

  modalState = mm.store.getState().modals[modal!.id]!;
  expect(modalState).toMatchObject({
    id: modal!.id,
    visible: true,
    mounted: true,
    waitingForMount: false,
  });

  expect(getByRole(placement, 'modal-root')).toBeVisible();
  expect(getByRole(placement, 'modal-content')).toHaveTextContent(modalContent);

  act(() => {
    fireEvent.click(getByRole(placement, 'modal-close'));
  });
  expect(getByRole(placement, 'modal-root', { hidden: true })).not.toBeVisible();

  act(() => {
    mm.open(ControlledModal, { description: modalContent });
  });
  expect(getByRole(placement, 'modal-root')).toBeVisible();

  act(() => {
    fireEvent.click(getByRole(placement, 'modal-remove'));
  });
  expect(queryByRole(placement, 'modal-root')).toBeNull();
});

it('mount ModalController component', () => {
  let controller: ModalControllerRef<Parameters<typeof Modal>[0]> | null = null;

  const modalControllerCallbackRef = (value: typeof controller) => {
    controller = value;
  };

  render(
    <ModalController ref={modalControllerCallbackRef} controlledModal={ControlledModal} />,
  );

  expect(controller).not.toBeNull();

  const modalContent = 'modal content';
  act(() => {
    controller?.open({ description: modalContent });
  });

  let root = screen.queryByRole('modal-root');
  expect(root).not.toBeNull();
  expect(root).toBeVisible();
  expect(screen.getByRole('modal-content')).toHaveTextContent(modalContent);

  act(() => {
    controller?.close();
  });
  root = screen.getByRole('modal-root', { hidden: true });
  expect(root).not.toBeVisible();

  act(() => {
    controller?.open({ description: modalContent });
  });
  root = screen.getByRole('modal-root');
  expect(root).toBeVisible();

  act(() => {
    fireEvent.click(screen.getByRole('modal-remove'));
  });
  root = screen.getByRole('modal-root', { hidden: true });
  expect(root).toBeInTheDocument();
  expect(root).not.toBeVisible();
});
