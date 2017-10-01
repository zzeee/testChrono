/**
 * Created by zzeee on 26.09.2017.
 */
import {call, put, fork, take, delay, select, takeEvery, takeLatest, effects} from 'redux-saga/effects'

import * as act from '../actions/actions.js'

function fetchU(param, param1) {
    return fetch(param, param1).then(response => (response.status === 200 ? response.json() : response.text()))
}

function* doUrl(action) {
    if (action.type === act.getURL) {
        const errmsg='"{\\"err\\":\\"\\"}"';

        //console.log('from saga', action,errmsg);
        try {
            let url = 'http://localhost:8080/?param=' + action.url;
           // console.log('URL', url);
            const logd = yield call(fetchU, url, {
                method: 'GET',
                credentials: 'include',
            });
            //console.log('from dourl saga', typeof logd,logd);


            if (typeof logd==="object" && logd.data && logd.data===errmsg )
            {
                // console.log('from dourl saga2', typeof logd.data,logd.data);
                console.log('ошибка обработки');
                yield put(act.exReceivingErr(action.url));
                return;
            }

            if ((logd === {"err": {}} || logd === '{"err":{}}') || ((typeof logd === 'object') && logd.data && (logd.data === {"err": {}} || (logd.data === '{"err":{}}')) )) {
                console.log('ошибка обработки');
                yield put(act.exReceivingErr(action.url));
                return;
            }
            // if (typeof logd=='object' && logd.data && logd.data=={"err":{}} )  {console.log('ошибка обработки');yield put(act.exReceivingErr(action.url)); }
            if (typeof logd === 'object' /* && logd.status==200 */) yield put(act.receivingUrl(action.url, logd))
        } catch (ex) {
           // console.log('error',  ex);
            yield put(act.exCommon(ex, "dourl"))
        }
    }
}

function* doSaga() {
    yield takeEvery(act.doGetUrl, doUrl)
}

export default doSaga
