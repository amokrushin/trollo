import { denormalize } from 'normalizr';
import { board } from '../api/schema';

export const selectHydrated = (state, boardId) => {
    return denormalize(boardId, board, state.entities);
};
