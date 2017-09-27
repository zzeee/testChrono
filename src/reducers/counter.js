import * as act from '../actions/actions.js'

const initialState = {
  data: { url: '', data: '' },
}

export default function counter(state = initialState, action) {
  console.log('REDUCERS', action);
  switch (action.type) {
    case act.URL_RECEIVED:
      return Object.assign({}, state, {
        data: action.data,
      });

    default:
      return state
  }
}
