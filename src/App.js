//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { initShopify } from "./store/actions/shopifyActions";
import { checkCookies } from "./store/actions/analyticsActions";

//> Components
/**
 * Footer: Global Footer
 * Navbar: Global navigation bar
 */
import { Footer, Navbar, CookieModal } from "./components/molecules";
// Starts the page on top when reloaded or redirected
import { ScrollToTop } from "./components/atoms";

//> Routes
import Routes from "./Routes";
//#endregion

//#region > Components
class App extends React.Component {
  state = {};

  componentDidMount = () => {
    // Initialize Shopify
    this.props.initShopify();
    // Initialize analytics
    this.props.checkCookies();
  };

  saveCookie = () => {
    this.props.checkCookies();
  };

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes />
              <CookieModal saveCookie={this.saveCookie} />
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    checkout: state.shop.checkout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initShopify: () => dispatch(initShopify()),
    checkCookies: () => dispatch(checkCookies()),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(App);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
