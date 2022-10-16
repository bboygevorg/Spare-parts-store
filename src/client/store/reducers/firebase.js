import { actions } from '../actions/firebase'
import { handleActions } from 'redux-actions'

const initialState = {
    config: {},
    isGoogleBot: false
}

const reducerMap = {
    [actions.setFirebaseConfig]: (state, { payload }) => {
        return {
            ...state,
            config: payload
        }
    },
    [actions.setIsGoogleBot]: (state, { payload }) => {
        return {
            ...state,
            isGoogleBot: payload
        }
    }
}


export default handleActions(reducerMap, initialState)