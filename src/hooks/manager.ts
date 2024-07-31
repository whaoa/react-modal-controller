import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { ModalManager, UniqueId } from '../core/types';

export function useManagerState(mm: ModalManager) {
  return useSyncExternalStore(
    mm.store.subscribe,
    mm.store.getState,
    mm.store.getInitialState,
  );
}

export function useManagerModalStack(mm: ModalManager) {
  const state = useManagerState(mm);
  return useMemo(
    () => Object.values(state.modals).sort((a, b) => a.at - b.at),
    [state],
  );
}

export function useManagerModal(mm: ModalManager, id: UniqueId) {
  return useSyncExternalStore(
    mm.store.subscribe,
    useCallback(() => mm.store.getState().modals[id], [mm, id]),
    useCallback(() => mm.store.getInitialState().modals[id], [mm, id]),
  );
}
