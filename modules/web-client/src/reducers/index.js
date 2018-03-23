import { combineReducers } from 'redux';
import entities, { STATE_KEY as ENTITIES_STATE_KEY } from './entities';

const reducer = combineReducers({
    [ENTITIES_STATE_KEY]: entities,
});

export default reducer;
