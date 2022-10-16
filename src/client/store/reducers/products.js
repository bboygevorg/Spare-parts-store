import { productActions } from '../actions/products'
import { handleActions } from 'redux-actions'

const initialState = {
    wishList: []
}

const reducerMap = {
    [productActions.toggleAddToWishList]: (state, {payload}) => {
        if(state.wishList.includes(payload)) {
            const filteredWishList = state.wishList.filter(id => id !== payload)
            localStorage.setItem("wishlist",JSON.stringify(filteredWishList))
            return { ...state, wishList: filteredWishList }

        } else if(state.wishList.length < 20) { 
            const newWishList = [...state.wishList, payload]
            localStorage.setItem("wishlist",JSON.stringify(newWishList))
            return {...state, wishList: [...state.wishList, payload] }
            
        }
    },
    [productActions.setWishlist]: (state, { payload }) => {
        return {
            ...state,
            wishList: payload
        }
    }
}


export default handleActions(reducerMap, initialState)