import { merge } from 'lodash';
import { MERGE_ENTITIES } from '../actions';

export const STATE_KEY = 'entities';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case MERGE_ENTITIES:
            return merge({}, state, action.entities);

        default:
            return state;
    }
}
