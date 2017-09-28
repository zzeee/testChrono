import * as act from '../actions/actions.js'

const initialState = {
    data:{}, url: '',  reqsent: false,error:false
}

export default function main(state = initialState, action) {
   // console.log('REDUCERS', action);
    switch (action.type) {
        case act.URL_RECEIVED:
            return Object.assign({}, state, {
                data: action.data, reqsent: false, error:false
            });

        case act.getURL:
            return Object.assign({}, state, {
                reqsent: true,
                data:[],
                error:false
            });
        case act.receivingErr:
            return Object.assign({}, state, {
                reqsent: false,
                error:true
            });
            case act.dexception:
            return Object.assign({}, state, {
                reqsent: false,
                error:true
            });
        default:
            return state
    }
}
