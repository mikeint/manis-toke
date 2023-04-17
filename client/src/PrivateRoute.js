import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import AuthFunctions from './AuthFunctions';

const Auth = new AuthFunctions();

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Auth.loggedIn() === true
            ? <Component {...rest} {...props} />
            : <Redirect to='/login' />
    )} />
)

export default PrivateRoute;