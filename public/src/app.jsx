import '@babel/polyfill';
import './style.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import todoApp from './redux/reducers';

// import './redux/index';

let store = createStore(todoApp)

import Root from './router';

const App = (<Root store={store} />);
ReactDOM.render(App, document.getElementById('app'));
