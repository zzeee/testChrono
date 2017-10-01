import * as act from '../actions/actions.js'

const initialState = {
  data: {},
  url: '',
  reqsent: false,
  error: false,
}

export default function main(state = initialState, action) {
  // console.log('REDUCERS', action);
  switch (action.type) {
    case act.URL_RECEIVED:
      let res={};
      let resu="";
      let maxwidth=0;
      try {
          if (action.data && action.data.data) res = JSON.parse(JSON.parse(action.data.data).data)

           maxwidth = Math.max.apply(null, res.map((e) => parseInt(e.length)));
          /*
          *

           *
          * */
          if (action.data && action.data.url) resu=action.data.url;
      }
      catch(ex) {console.log(action.data, ex);}
      return Object.assign({}, state, {
        data: action.data,
        data_d: res,
        data_d_mwidth:maxwidth,
        data_u:resu,
        reqsent: false,
        error: false,
      });

    case act.getURL:
      return Object.assign({}, state, {
        reqsent: true,
        data: {},
        error: false,
      })

    case act.resetState:
      return Object.assign({}, state, {
        reqsent: false,
        data: {},
        error: false,
      })
    case act.receivingErr:
      return Object.assign({}, state, {
        reqsent: false,
        error: true,
      })
    case act.dexception:
      return Object.assign({}, state, {
        reqsent: false,
        error: true,
      })
    default:
      return state
  }
}
