import { createContext } from 'react';

import type { ModalManager, ModalState } from '../core/types';

export const ModalManagerContext = createContext<ModalManager | null>(null);

export const ModalStateContext = createContext<ModalState | null>(null);
