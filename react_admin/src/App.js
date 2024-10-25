import React, { useEffect } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './scss/style.scss';
import { startChecking } from './actions/auth';
import { PublicRoute } from './router/PublicRoute';
import { PrivateRoute } from './router/PrivateRoute';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/auth/login/Login'));

export const App = () => {
    const dispatch = useDispatch();
    const { checking, uid } = useSelector(state => state.auth);
  
    //Se ejecuta la primera vez que se renderize el componente
    // y cuando el dispatch se ejecute
    // hacemos esto para saber si el usuario esta autenticado
    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch])

    if (checking) {
      //false => es que el usuario ya esta autenticando.
      return <h5>Esperando informacion del backend...</h5>
    }

    //console.log(checking);

    return (
      
          <React.Suspense fallback={loading}>
            <Switch>
              <PublicRoute exact path='/login' component={Login} isAuthenticated={!!uid}></PublicRoute>
              <PrivateRoute path='/' component={TheLayout} isAuthenticated={!!uid}></PrivateRoute>              
            </Switch>
          </React.Suspense>
      
    );
  
}