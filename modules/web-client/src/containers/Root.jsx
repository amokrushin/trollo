import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from '../store/configureStore';

const store = configureStore({
    entities: {
        organizations: {},
        organizationMembers: {},
        users: {},
        boards: {},
    },
});

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'),
);
