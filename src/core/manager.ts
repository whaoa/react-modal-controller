import { createId, createPromise, createStore } from './utils';

import type { ControlledModalComponent, ModalManager, ModalOperation } from './types';

const MODAL_ID_ATTRIBUTE = '__mc_modal_id__';

function resolveModalId(Modal: ControlledModalComponent<any>) {
  if (MODAL_ID_ATTRIBUTE in Modal) {
    return Modal[MODAL_ID_ATTRIBUTE] as string;
  }
  const id = createId();
  Object.assign(Modal, { [MODAL_ID_ATTRIBUTE]: id });
  return id;
}

export function createModalManager(): ModalManager {
  const store: ModalManager['store'] = createStore({ modals: {} });

  const mm: ModalManager = {
    store,

    open(Modal, props) {
      const Component = Modal as ControlledModalComponent<unknown>;
      const id = resolveModalId(Modal);
      const modals = store.getState().modals;
      let modal = modals[id];
      if (modal && modal?.visible) {
        throw new Error(`Modal ${id} is already opened`);
      }
      modal = {
        id,
        at: Date.now(),
        Modal: Component,
        props: props || undefined,
        visible: true,
        promise: createPromise<ModalOperation>(),
      };
      store.setState({ modals: { ...modals, [id]: modal } });
      return {
        id: modal.id,
        promise: modal.promise.instance,
        close: () => mm.close(id),
        remove: () => mm.remove(id),
      };
    },

    close(id) {
      const modals = store.getState().modals;
      let modal = modals[id];
      if (modal) {
        modal.promise.resolve({ type: 'close', payload: null });
        modal = { ...modal, visible: false };
        store.setState({ modals: { ...modals, [id]: modal } });
      }
    },

    remove(id) {
      let modals = store.getState().modals;
      if (modals[id]) {
        modals[id].promise.resolve({ type: 'remove', payload: null });
        modals = { ...modals };
        delete modals[id];
        store.setState({ modals });
      }
    },
  };

  return mm;
}
