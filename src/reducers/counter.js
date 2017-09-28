/*
import * as act from '../actions/actions.js'

const initialState = {
    data: {url: '', data: '', reqsent: false},
}

export default function counter(state = initialState, action) {
    console.log('REDUCERS', action);
    switch (action.type) {
        case act.URL_RECEIVED:
            return Object.assign({}, state, {
                data: action.data, reqsent: false
            });

        case act.getURL:
            return Object.assign({}, state, {
                reqsent: true
            });



        default:
            return state
    }
}
*/