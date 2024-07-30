import {
  createModalManager,
  markModalComponentAsMounted,
  markModalComponentAsUnmounted,
} from '../src/core/manager';
import { createModal } from '../src/components/helper';

const ControlledModal = createModal(() => null);

it('open a new modal', () => {
  const mm = createModalManager();

  const modal = mm.open(ControlledModal, null);

  const modals = mm.store.getState().modals;

  expect(modals[modal.id]).toBeDefined();

  expect(modals[modal.id]).toMatchObject({
    id: modal.id,
    visible: false,
    mounted: false,
    waitingForMount: true,
    promise: { instance: modal.promise },
    Modal: ControlledModal,
  });
});

it('close a opened modal', async () => {
  const mm = createModalManager();

  const modal = mm.open(ControlledModal, null);
  modal.close();

  const modals = mm.store.getState().modals;

  expect(modals[modal.id]).toBeDefined();

  expect(modals[modal.id]).toMatchObject({
    id: modal.id,
    visible: false,
    mounted: false,
    waitingForMount: false,
    Modal: ControlledModal,
  });

  const modalClosePayload = { type: 'close', payload: null };
  await expect(modal.promise).resolves.toEqual(modalClosePayload);

  const onModalClose = jest.fn();
  await modal.promise.then(onModalClose);
  expect(onModalClose).toHaveBeenCalledWith(modalClosePayload);
});

it('remove a modal', async () => {
  const mm = createModalManager();

  const modal = mm.open(ControlledModal, null);
  modal.remove();

  const modals = mm.store.getState().modals;

  expect(modals[modal.id]).toBeUndefined();

  const modalRemovePayload = { type: 'remove', payload: null };

  await expect(modal.promise).resolves.toEqual(modalRemovePayload);

  const onModalRemove = jest.fn();
  await modal.promise.then(onModalRemove);
  expect(onModalRemove).toHaveBeenCalledWith(modalRemovePayload);
});

it('open a new modal with custom id', () => {
  const mm = createModalManager();

  const id = jest.getSeed().toString();
  const modal = mm.open(ControlledModal, null, { modalId: id });

  expect(modal.id).toBe(id);
});

it('throw a error when modal is already opened', () => {
  const mm = createModalManager();

  let error: any;
  try {
    mm.open(ControlledModal, null);
    mm.open(ControlledModal, null);
  } catch (err) {
    error = err;
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toContain('is already opened');
});

it('mark modal component as mounted', () => {
  const mm = createModalManager();

  const modal = mm.open(ControlledModal, null);
  markModalComponentAsMounted(mm, modal.id);

  const modalState = mm.store.getState().modals[modal.id];

  expect(modalState).toMatchObject({
    id: modal.id,
    visible: true,
    mounted: true,
    waitingForMount: false,
    promise: { instance: modal.promise },
    Modal: ControlledModal,
  });
});

it('mark modal component as unmounted', () => {
  const mm = createModalManager();

  const modal = mm.open(ControlledModal, null);
  markModalComponentAsUnmounted(mm, modal.id);

  const modalState = mm.store.getState().modals[modal.id];

  expect(modalState).toMatchObject({
    id: modal.id,
    visible: false,
    mounted: false,
    waitingForMount: true,
    promise: { instance: modal.promise },
    Modal: ControlledModal,
  });
});
