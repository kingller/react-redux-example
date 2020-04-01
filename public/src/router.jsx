import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch as RouterSwitch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'
import history from './js/hash-history';

import ModuleWrapper from './components/module-wrapper';

import Main from './modules/to-do-app/main';

const Root = ({ store }) => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <div className="layout-responsive-left-fixed page-container">
                    <div className="page-content">
                        <div className="page-body">
                            <ModuleWrapper>
                                <RouterSwitch>
                                    <Route key="app" exact={true} component={Main} path="/app" />
                                    <Redirect to="/app" />
                                </RouterSwitch>
                            </ModuleWrapper>
                        </div>
                    </div>
                </div>
            </Router>
        </Provider>
    );
};

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root;
