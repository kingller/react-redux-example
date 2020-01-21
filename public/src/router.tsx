import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch as RouterSwitch, Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import hashHistory from './js/hash-history';
import DevTools from 'mobx-react-devtools';

import ModuleWrapper from './components/module-wrapper';

import User from './modules/user/index';

const MainWithRouter = withRouter(
    class Main extends React.Component<RouteComponentProps> {
        static childContextTypes = {
            //获取当前页面的地址
            location: PropTypes.object,
        };

        getChildContext(): {} {
            return {
                //获取当前页面的地址
                location: this.props.location,
            };
        }

        render(): React.ReactNode {
            const location = this.props.location;
            const module = 'module' + location.pathname.replace(/\//g, '-');

            return (
                <React.Fragment>
                    <div className="layout-responsive-left-fixed page-container">
                        <div className="page-content">
                            <div className={`page-body ${module}`}>
                                <ModuleWrapper>
                                    <RouterSwitch>
                                        <Route key="user" exact={true} component={User} path="/user" />
                                        <Redirect to="/user" />
                                    </RouterSwitch>
                                </ModuleWrapper>
                            </div>
                        </div>
                    </div>
                    <If condition={!!process.env.DEVTOOLS}>
                        <DevTools />
                    </If>
                </React.Fragment>
            );
        }
    }
);

export default (
    <Router history={hashHistory}>
        <MainWithRouter />
    </Router>
);
