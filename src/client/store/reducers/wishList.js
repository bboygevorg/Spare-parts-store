import { actions } from '../actions/wishList';
import { handleActions } from 'redux-actions';

const initialState = {
    categories: [],
    items: [],
    allItems: []
};

const reducerMap = {
    [actions.setWishlists]: (state, { payload }) => {
        if(payload.length) {
            localStorage.setItem("wishList", JSON.stringify(payload));
        }
        return {
            ...state,
            categories: payload
        }
    },
    [actions.setItems]: (state, { payload }) => {
        return {
            ...state,
            items: payload
        }
    },
    [actions.setAllItems]: (state, { payload }) => {
        if(payload.length) {
            localStorage.setItem("allWishListItems", JSON.stringify(payload));
        }
        return {
            ...state,
            allItems: payload
        }
    }
};

export default handleActions(reducerMap, initialState);