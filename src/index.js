//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from "react-dom";

//> Font Awesome
// Font Awesome is an awesome icon library
import "@fortawesome/fontawesome-free/css/all.min.css";

//> Bootstrap
import "bootstrap-css-only/css/bootstrap.min.css";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import "mdbreact/dist/css/mdb.css";

//> CSS
// Root SCSS file
import "./index.scss";

//> Components
// Root component
import App from "./App";

//> Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

//> Redux
// Store, Middleware, Compose
import { createStore, applyMiddleware, compose } from "redux";
// Provider
import { Provider } from "react-redux";
// Thunk
import thunk from "redux-thunk";
// Reducer
import rootReducer from "./store/reducers/rootReducer";

//> Firestore
// Cloud Firestore is the Database of Firebase
import { reduxFirestore, getFirestore } from "redux-firestore";

//> Firebase
// React-Redux interface for Firebase
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
// Firebase config
import fbInit from "./config/fbInit";
//#endregion

//#region > Config
//> Shopify API
// API Link
const httpLinkShopify = createHttpLink({
  uri: `https://${process.env.REACT_APP_SHOP}.myshopify.com//api/graphql`,
});
// Storefront access token
const middlewareLinkShopify = setContext(() => ({
  headers: {
    "X-Shopify-Storefront-Access-Token": process.env.REACT_APP_STOREFRONT_TOKEN,
  },
}));

// Apollo Client
const clientShopify = new ApolloClient({
  link: middlewareLinkShopify.concat(httpLinkShopify),
  cache: new InMemoryCache(),
});

/**
 * FIREBASE INIT SETTINGS
 */
// Automatically load user data to logged in user (realtime functionality). Sync user data to user profile.
const syncUserToAuth = true;
/**
 * Set user collection
 * The name of the collection can vary from project to project. Check Firebase for information.
 * This tells Redux Firebase where the users are being stored.
 */
const userCollection = "users";
// Enable firebase initializing before DOM rendering
const onlyLoadWhenReady = true;
// Create Redux data-store and store it in store and apply thunk middleware
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      thunk.withExtraArgument({
        /* Firebase binding */
        getFirebase,
        /* Cloud Firestore Database binding */
        getFirestore,
        /* Shopify Storefront binding */
        clientShopify,
      })
    ),
    reduxFirestore(fbInit),
    reactReduxFirebase(fbInit, {
      useFirestoreForProfile: syncUserToAuth,
      userProfile: userCollection,
      attachAuthIsReady: onlyLoadWhenReady,
    })
  )
);
//#endregion

//#region > Render
// Wait until firebase is initialized, then render the DOM
store.firebaseAuthIsReady.then(() => {
  // Render the DOM
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
