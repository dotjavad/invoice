import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Invoice from './Invoice';
import Preview from './Preview';
import { loadState, saveState } from './localStorage';
import './index.css';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer, loadState());

store.subscribe(() => {
    saveState(store.getState());
});

const App = () => {
    return (
        <Router basename={window.location.pathname || ''}>
            <Route exact path="/" component={Invoice} />
            <Route path="/preview" component={Preview} />
        </Router >
    );
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
