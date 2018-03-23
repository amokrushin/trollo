import { denormalize } from 'normalizr';
import { organization } from '../api/schema';

export const STATE_KEY = 'organizations';

export default function reducer(state = {}, action) {
    return state;
}

export const selectHydrated = (state) => {
    const keys = Object.keys(state.entities[STATE_KEY]);
    return denormalize(keys, [organization], state.entities);
};
