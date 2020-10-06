import {
	configureStore,
	getDefaultMiddleware,
	Action,
	combineReducers,
} from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { ThunkAction } from 'redux-thunk';

import media from './containers/SelectMedia/SelectMedia.reducers';

export const history = createHashHistory();

const reducer = combineReducers({
	router: connectRouter(history),
	media,
});

export type RootState = ReturnType<typeof reducer>;

const router = routerMiddleware(history);
const middleware = [...getDefaultMiddleware(), router];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
	process.env.NODE_ENV || ''
);

if (shouldIncludeLogger) {
	const logger = createLogger({
		level: 'info',
		collapsed: true,
	});
	middleware.push(logger);
}

export const configuredStore = (initialState?: RootState) => {
	// Create Store
	const store = configureStore({
		reducer,
		middleware,
		preloadedState: initialState,
	});

	if (process.env.NODE_ENV === 'development' && module.hot) {
		module.hot.accept(() => store.replaceReducer(reducer));
	}
	return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
