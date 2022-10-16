import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {BrowserRouter} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import reducers from './store/reducers';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from 'axios';
import {ApolloProvider} from '@apollo/react-hooks';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

if('serviceWorker' in navigator) {
     runtime.register()
}

const axiosInstance = axios.create({
    baseURL: ''
});

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import AppContainer from "./containers/AppContainer/index";

const client = new ApolloClient({
    uri: process.env.BACKEND_URL,
    cache: new InMemoryCache({
        addTypename: false
    })
});
const store = createStore(reducers, window.INITIAL_STATE, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(axiosInstance))));
const stripePromise = loadStripe(process.env.STRIPE_KEY);

ReactDOM.hydrate(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <Elements stripe={stripePromise}>
                <BrowserRouter>
                    <AppContainer/>
                </BrowserRouter>
            </Elements>
        </Provider>
    </ApolloProvider>
    , document.getElementById('root'));
