import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({isAuthenticated, component: Component, ...rest}) => {
    if (isAuthenticated)
        return (
            <Route {...rest}
                render={routeProps => (<Component {...routeProps} />)
                } />
        )

    return (
        <Route {...rest}
            render={_ => (<Redirect to="/login" />)
            } />
    )
}

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.any.isRequired
}