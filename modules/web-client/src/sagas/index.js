import { call, fork, takeEvery, all, put } from 'redux-saga/effects';
import { fetchUserOrganizations, fetchBoardById } from '../api/api';
import { addEntities } from '../actions';

export function* fetchUserOrganizationsSaga() {
    const { entities } = yield call(fetchUserOrganizations, 'me');
    yield put(addEntities(entities));
    // yield put('FETCH_USER_ORGANIZATIONS_SUCCESS');
}

export function* fetchBoardSaga({ board }) {
    const { entities } = yield call(fetchBoardById, board.id);
    yield put(addEntities(entities));
}

export function* watchFetchUserOrganizations() {
    yield takeEvery('FETCH_USER_ORGANIZATIONS', fetchUserOrganizationsSaga);
}

export function* watchFetchBoard() {
    yield takeEvery('FETCH_BOARD', fetchBoardSaga);
}

export default function* rootSaga() {
    yield all([
        fork(watchFetchUserOrganizations),
        fork(watchFetchBoard),
    ]);
}
