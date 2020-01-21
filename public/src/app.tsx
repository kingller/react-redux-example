import '@babel/polyfill';
import './style.less';
import React from 'react';
import ReactDOM from 'react-dom';

import router from './router';

const App = <React.Fragment>{router}</React.Fragment>;
ReactDOM.render(App, document.getElementById('app'));
