// eslint-disable-next-line
import materializeCSS from 'materialize-css/dist/css/materialize.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import reduxThunk from 'redux-thunk';
import reducers from './reducers';

import App from './components/App';
// download only axios helper
import axios from 'axios';

window.axios = axios.create({
  baseURL: 'http://localhost:5000',
});

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
