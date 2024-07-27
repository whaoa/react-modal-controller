import { useMemo, useSyncExternalStore } from 'react';

import type { ModalManager } from '../core/types';

export function useManagerState(mm: ModalManager) {
  return useSyncExternalStore(
    mm.store.subscribe,
    mm.store.getState,
    mm.store.getInitialState,
  );
}

export function useManagerModals(mm: ModalManager) {
  const state = useManagerState(mm);
  return useMemo(
    () => Object.values(state.modals).sort((a, b) => a.at - b.at),
    [state],
  );
}
