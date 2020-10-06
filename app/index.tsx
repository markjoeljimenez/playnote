import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';

import { history, configuredStore } from './store';

import App from './containers/App/App';

import './styles/app.global.scss';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line global-require
	// const Root = require('./containers/Root').default;
	render(
		<AppContainer>
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</Provider>
		</AppContainer>,
		document.getElementById('root')
	);
});
