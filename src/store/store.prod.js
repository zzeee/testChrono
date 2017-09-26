import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import rootReducer from 'reducers'
import createSagaMiddleware from 'redux-saga';
import cSaga from '../saga/saga.js';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [ReduxThunk, sagaMiddleware]
const enhancer = [applyMiddleware(...middlewares)]


export default function configureStore(initialState = {}) {
  const mstore= createStore(rootReducer, initialState, ...enhancer);
    sagaMiddleware.run(cSaga);
    return mstore;
}
