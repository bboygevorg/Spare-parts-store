import { createActions } from "redux-actions";
import { storage } from "helper/utils";
import { STORAGE_REFRESH_TOKEN } from "conf/consts";
import { userActions } from "./user";
import { searchClient } from "conf/main";
import aa from 'search-insights';

export const actions = createActions({
  SIGN_IN: null,
  SIGN_OUT: null,
  AUTO_LOGIN: null,
  ADD_CART_TOKEN: null,
  ADD_CART: null,
  ADD_EXPIRED: null,
  ADD_DONT_SHOW: null,
  SET_IS_ACTIVE_CART: null,
  DELETE_CART_DATA: null,
  CLEAR_CART: null,
  SET_PENDING_ORDER_COUNT: null
});

export const autoLogin = ( getCustomer ) => {
    return dispatch => {
      aa('init', {
        appId: process.env.APPLICATION_ID,
        apiKey: process.env.ADMIN_API_KEY,
      });
      if(localStorage.getItem('customerToken')) {
        aa('getUserToken', null, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          const userToken = localStorage.getItem('customerToken');
          searchClient.transporter.headers['X-Algolia-UserToken'] = userToken
        });
          getCustomer({variables: {
                          customerToken: localStorage.getItem('customerToken')
                      }
              }).then(res => {
                              dispatch(actions.autoLogin(res.data.getCustomerInfo));
                              if(localStorage.getItem('cartToken')) {
                                  dispatch(actions.addCartToken(localStorage.getItem('cartToken')));
                              }
                              if(localStorage.getItem('cartData')){
                                  dispatch(actions.addCart(JSON.parse(localStorage.getItem('cartData'))));
                              }
              })
              .catch(err => {
	              console.log(err);
	              localStorage.removeItem('customerToken')
              });
      }
      else
      if(localStorage.getItem('cartData') && localStorage.getItem('cartToken')) {
          dispatch(actions.addCart(JSON.parse(localStorage.getItem('cartData'))));
          aa('getUserToken', null, (err, userToken) => {
            if (err) {
              console.error(err);
              return;
            }
            searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
          });
      }
      else {
        aa('getUserToken', null, (err, userToken) => {
          if (err) {
            console.error(err);
            return;
          }
          searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
        });
      }
    };
};

export const refreshCustomer = (refreshMutation) => {
  return (dispatch) => {
    const refreshToken = storage(STORAGE_REFRESH_TOKEN);
    refreshMutation({
      variables: {
        refreshToken,
      },
    })
      .then((res) => {
        const custToken =
          res.data.refreshCustomerToken.customerToken ||
          storage("customerToken");
        storage("customerToken", custToken); 
        dispatch(userActions.setCustomerToken(custToken));
      })
      .catch((err) => {
	      localStorage.removeItem('customerToken');
	      console.log(JSON.parse(JSON.stringify(err)), "with error");
      });
  };
};
export const addCartData = (getCartData, isNotActive, refreshMutation) => {
  return (dispatch) => {
    getCartData({
      variables: {
        cartToken: localStorage.getItem("cartToken")
          ? localStorage.getItem("cartToken")
          : "",
        customerToken: localStorage.getItem("customerToken")
          ? localStorage.getItem("customerToken")
          : "",
      },
      fetchPolicy: "no-cache",
    })
      .then((res) => dispatch(actions.addCart(res.data.getCart)))
      .catch((err) => {
        const parseError = JSON.parse(JSON.stringify(err));
        const code = parseError.graphQLErrors[0].code;
        if (code === 31) {
	        dispatch(actions.clearCart());
          if (isNotActive) {
            dispatch(actions.setIsActiveCart(false));
          }
        }
        if (code === 0) {
          dispatch(refreshCustomer(refreshMutation));
        }
      });
  };
};
