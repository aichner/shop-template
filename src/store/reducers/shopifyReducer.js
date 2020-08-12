// Have initial state for when state is not ready to be passed
const initState = {
  products: [],
  checkout: null,
  error: undefined,
};

const shopifyReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload?.data,
        error: false,
      };
    case "GET_PRODUCTS_FAIL":
      console.error("Failed to fetch shopify products", action.payload.error);

      return {
        ...state,
        products: [],
        error: action.payload.error,
      };
    case "CREATECHECKOUT_SUCCESS":
      return {
        ...state,
        checkout: action.payload.data,
        error: false,
      };
    case "ADDVARIANT_SUCCESS":
      return {
        ...state,
        checkout: action.payload.data,
        error: false,
      };
    case "UPDATELINEITEM_SUCCESS":
      return {
        ...state,
        checkout: action.payload.data,
        error: false,
      };
    case "REMOVELINEITEM_SUCCESS":
      return {
        ...state,
        checkout: action.payload.data,
        error: false,
      };
    default:
      return state;
  }
};

export default shopifyReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
