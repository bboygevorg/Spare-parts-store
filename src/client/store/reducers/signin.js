import { actions } from '../actions/signIn';
import { handleActions } from 'redux-actions';
import { userActions } from '../actions/user'
import { clearStorage } from 'helper/utils';
import { STORAGE_STEP_DATA_KEY } from 'conf/consts';
import {STORAGE_DONT_SHOW_AGAIN} from "../../conf/consts";

const initialState = {
    customerData: {},
    isAuth: false,
    cartData: {},
    cartToken: '',
    isExpired: false,
    dontShowCartExpiresModal: false,
    isActiveCart: true,
    customerCards: [],
    pendingOrderCount: null
};

const reducerMap = {
    [userActions.addCustomerCards]: (state, {payload}) => {
        return {
            ...state,
            customerCards: payload
        }
    },
    [userActions.addCustomerData]: (state, {payload})=> {
        return {
            ...state,
            customerData: payload
        }
    },
    [userActions.setCustomerToken]: (state, {payload}) => {
        return {
            ...state,
            customerData: {
                ...state.customerData,
                customerToken: payload
            }
        }
    },
    [actions.signIn]: (state, { payload }) => {
        localStorage.setItem('customerToken', payload.customerToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        return {
            ...state,
            customerData: payload,
            isAuth: true
        }
    },
    [actions.signOut]: state => {
        clearStorage('customerToken');
        clearStorage('refreshToken');
        clearStorage(STORAGE_STEP_DATA_KEY)
        if(localStorage.getItem('cartToken')){
            clearStorage('cartToken');
        }
        if(localStorage.getItem('cartData')){
            clearStorage('cartData');
        }
        if(localStorage.getItem('dontShow')) {
            clearStorage('dontShow');
        }
        if(localStorage.getItem('wishList')) {
            clearStorage('wishList');
        }
        if(localStorage.getItem('allWishListItems')) {
            clearStorage('allWishListItems')
        }
        if(localStorage.getItem('lastViewed')) {
            clearStorage('lastViewed');
        }
        if(localStorage.getItem('searchHistory')) {
            clearStorage('searchHistory');
        }
        if(localStorage.getItem('lastSend')) {
            clearStorage('lastSend');
        }
        if(localStorage.getItem('askedforzipcode')){
            clearStorage('askedforzipcode');
        }
        if(localStorage.getItem('listView')) {
            clearStorage('listView');
        }
        if(localStorage.getItem('courierData')) {
            clearStorage('courierData');
        }
        if(localStorage.getItem('driveFileIds')) {
            clearStorage("driveFileIds");
        }
        return {
            ...state,
            customerData: {},
            isAuth: false,
            cartToken: '',
            cartData: {},
            dontShow: 0,
            customerCards: [],
            pendingOrderCount: null
        }
    },
    [actions.autoLogin]: (state, { payload }) => {
        return {
            ...state,
            customerData: payload,
            isAuth: true
        }
    },
    [actions.addCartToken]: (state, { payload }) => {
            localStorage.setItem('cartToken', payload);
        return {
            ...state,
            cartToken: payload,
        }
    },
    [actions.addCart]: (state, { payload }) => {
        localStorage.setItem('cartData', JSON.stringify(payload));
        localStorage.setItem('cartToken', payload.cartToken);
        return {
            ...state,
            cartData: payload,
            cartToken: payload.cartToken
        }
    },
    [actions.addExpired]: (state, { payload }) => {
        return {
            ...state,
            isExpired: payload
        }
    },
    [actions.addDontShow]: (state, { payload }) => {
        return {
            ...state,
            dontShowCartExpiresModal: payload
        }
    },
    [actions.setIsActiveCart]: (state, { payload }) => {
        return {
            ...state,
            isActiveCart: payload
        }
    },
    [actions.deleteCartData]: state => (
        {   
            ...state,
            cartData: {},
            cartToken: '',
        }
    ),
    [actions.clearCart]: state => {
        if(localStorage.getItem('cartToken')){
            clearStorage('cartToken');
        }
        if(localStorage.getItem('cartData')){
            clearStorage('cartData');
        }
        if(localStorage.getItem(STORAGE_DONT_SHOW_AGAIN)){
            clearStorage(STORAGE_DONT_SHOW_AGAIN);
        }
        return {
            ...state,
            cartData: {},
            cartToken: ''
        }
    },
    [actions.setPendingOrderCount]: (state, { payload }) => {
        return {
            ...state,
            pendingOrderCount: payload
        }
    }
};

export default handleActions(reducerMap, initialState);