import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middlewareList = [logger, sagaMiddleware];

export const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewareList)),
);

sagaMiddleware.run(rootSaga);
