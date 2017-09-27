/**
 * Created by zzeee on 26.09.2017.
 */
import { call, put, fork, take, delay, select, takeEvery, takeLatest, effects } from 'redux-saga/effects'

import * as act from '../actions/actions.js'

function fetchU(param, param1) {
  return fetch(param, param1).then(response => (response.status === 200 ? response.json() : Promise.reject('logon')))
}

function* doUrl(action) {
  if (action.type === act.getURL) {
    console.log('from saga', action);
    try {
      let url = 'http://localhost:8080/?param=' + action.url;
      console.log('URL', url);
      const logd = yield call(fetchU, url, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('from dourl saga', typeof logd);
      if (typeof logd === 'object' /*&& logd.status==200*/) yield put(act.receivingUrl(action.url, logd))
      } catch (ex) {
      console.log('error', ex);
      yield put(act.novExcept(ex))
    }
  }
}

function* doSaga() {
  yield takeEvery(act.doGetUrl, doUrl)
}

export default doSaga
