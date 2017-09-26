/**
 * Created by zzeee on 26.09.2017.
 */
import {call, put, fork, take, delay, select, takeEvery, takeLatest, effects} from 'redux-saga/effects';

import * as act  from '../actions/actions.js';

function* doUrl(action) {
    if (action.type === act.getURL) {
        console.log("from saga",action);

    }

}
function* doSaga(action) {
    // console.log("SAGA LOGGER:", action);
    //  while(true) {
    console.log('saga',action);

    yield takeEvery(act.doGetUrl, doUrl);
}

export default doSaga;
