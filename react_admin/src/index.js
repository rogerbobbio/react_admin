import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';

import { icons } from './assets/icons'

import { Provider } from 'react-redux';
import { store, history } from './store/store';
import { ConnectedRouter } from 'connected-react-router';

React.icons = icons;

//console.log(process.env);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
       <App/>
    </ConnectedRouter>    
  </Provider>,
  document.getElementById('root')
);
