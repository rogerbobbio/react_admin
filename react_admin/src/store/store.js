import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import thunk from "redux-thunk";
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();

export const store = createStore(rootReducer(history), composeWithDevTools(
  applyMiddleware(routerMiddleware(history), thunk)
));