//#region > Imports
//> GraphQL Queries
import {
  GET_PRODUCTS,
  checkoutLineItemsAdd,
  createCheckout,
  checkoutLineItemsUpdate,
  checkoutLineItemsRemove,
} from "../../queries";
//#endregion

//#region > Exports
export const getShopifyProducts = (productCount, variantCount) => {
  return (dispatch, getState, { clientShopify }) => {
    clientShopify
      .query({
        query: GET_PRODUCTS,
        variables: {
          productCount: productCount ? productCount : 10,
          variantCount: variantCount ? variantCount : 10,
        },
      })
      .then(({ data }) => {
        dispatch({
          type: "GET_PRODUCTS_SUCCESS",
          payload: {
            data,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: "GET_PRODUCTS_FAIL",
          payload: {
            errorCode: 680,
            message: "Failed to fetch products ",
            error: err,
          },
        });
      });
  };
};

//#region > Checkout functions
// Initializes Shopify checkout
export const initShopify = (getNew) => {
  return (dispatch, getState, { clientShopify }) => {
    // Get saved checkout in local storage
    const checkout = JSON.parse(localStorage.getItem("checkout"));

    if (!checkout || getNew) {
      // Create Shopify checkout
      clientShopify
        .mutate({
          mutation: createCheckout,
          variables: {
            input: {},
          },
        })
        .then((res) => {
          saveCheckout(res.data.checkoutCreate.checkout);

          dispatch({
            type: "CREATECHECKOUT_SUCCESS",
            payload: { data: res.data.checkoutCreate.checkout },
          });
        });
    } else {
      dispatch({
        type: "CREATECHECKOUT_SUCCESS",
        payload: { data: checkout },
      });
    }
  };
};

// Adds amount of a variant to a checkout
export const addVariantToCart = (variantId, quantity, checkoutId) => {
  return (dispatch, getState, { clientShopify }) => {
    clientShopify
      .mutate({
        mutation: checkoutLineItemsAdd,
        variables: {
          checkoutId: checkoutId,
          lineItems: [
            {
              variantId,
              quantity: parseInt(quantity, 10),
            },
          ],
        },
      })
      .then((res) => {
        const checkout = res.data.checkoutLineItemsAdd.checkout;

        saveCheckout(checkout);

        dispatch({
          type: "ADDVARIANT_SUCCESS",
          payload: { data: checkout },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

// Adds multiple line items to cart
export const addMultipleToCart = (checkoutId, lineItems) => {
  return (dispatch, getState, { clientShopify }) => {
    clientShopify
      .mutate({
        mutation: checkoutLineItemsAdd,
        variables: {
          checkoutId: checkoutId,
          lineItems,
        },
      })
      .then((res) => {
        const checkout = res.data.checkoutLineItemsAdd.checkout;

        saveCheckout(checkout);

        dispatch({
          type: "ADDVARIANT_SUCCESS",
          payload: { data: checkout },
        });
      });
  };
};

// Updates amount of a specific line item in the checkout
export const updateLineItemInCart = (lineItemId, quantity, checkoutId) => {
  return (dispatch, getState, { clientShopify }) => {
    clientShopify
      .mutate({
        mutation: checkoutLineItemsUpdate,
        variables: {
          checkoutId: checkoutId,
          lineItems: [
            {
              id: lineItemId,
              quantity: parseInt(quantity, 10),
            },
          ],
        },
      })
      .then((res) => {
        const checkout = res.data.checkoutLineItemsUpdate.checkout;

        saveCheckout(checkout);

        dispatch({
          type: "UPDATELINEITEM_SUCCESS",
          payload: { data: checkout },
        });
      });
  };
};

// Removes lineItem from checkout
export const removeLineItemInCart = (lineItemId, checkoutId) => {
  return (dispatch, getState, { clientShopify }) => {
    clientShopify
      .mutate({
        mutation: checkoutLineItemsRemove,
        variables: {
          checkoutId: checkoutId,
          lineItemIds: [lineItemId],
        },
      })
      .then((res) => {
        const checkout = res.data.checkoutLineItemsRemove.checkout;

        saveCheckout(checkout);

        dispatch({
          type: "REMOVELINEITEM_SUCCESS",
          payload: { data: checkout },
        });
      });
  };
};

// Stores checkout data in local storage
function saveCheckout(checkout) {
  checkout
    ? localStorage.setItem("checkout", JSON.stringify(checkout))
    : localStorage.removeItem("checkout");
}
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2020 Werbeagentur Christian Aichner
 */
