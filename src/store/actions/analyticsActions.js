//#region > Imports
// Analytics
import ReactGA from "react-ga";

// Facebook Pixel
import ReactPixel from "react-facebook-pixel";
//#endregion

//#region > Functions
// Number formatting
const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Initialize Analytics
export const checkCookies = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // Create custom user id for tracking
    let userId = localStorage.getItem("userId");

    if (!userId) {
      const sha256 = require("js-sha256");

      userId = sha256.create();

      localStorage.setItem("userId", userId);
    }

    // Check cookies
    let cookie = localStorage.getItem("cookie");

    if (cookie) {
      cookie = JSON.parse(cookie);
      if (cookie.marketing || cookie.statistics) {
        /*
        if (
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1"
        ) {
          */
        // Google Analytics
        ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
          gaOptions: {
            userId,
          },
        });
        ReactGA.pageview(window.location.pathname + window.location.search);

        // Facebook Pixel
        if (cookie.marketing) {
          ReactPixel.init(process.env.REACT_APP_FB_PIXEL);
          ReactPixel.pageView();
        }
        /*
        }
        */
      }
    }
  };
};

// Register when an item is put into the cart
export const registerInCart = (collection, title, variant) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // Facebook Pixel
    ReactPixel.track("AddToCart");

    // Google Analytics
    ReactGA.event({
      category: "Shop",
      action: "Item put in cart",
      label: `${collection} ${title} ${variant}`,
    });
  };
};

// Register a checkout
export const registerCheckout = (lineItems) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // Facebook Pixel
    ReactPixel.track("InitiateCheckout");

    // Get cart configuration
    const cart = lineItems.map((item, i) => {
      return {
        quantity: item.node.quantity,
        title: item.node.title,
        variant: item.node.variant.title,
        price:
          "EUR " +
          formatter.format(
            parseFloat(item.node.quantity) * parseFloat(item.node.price)
          ),
      };
    });

    // Google Analytics
    ReactGA.event({
      category: "Shop",
      action: "Checkout started",
      label: JSON.stringify(cart),
    });
  };
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
