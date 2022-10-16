import { actions } from '../actions/product';
import { handleActions } from 'redux-actions';

const initialState = {
    data: {},
};

const reducerMap = {
    [actions.setProductData]: (state, { payload }) => {
        return {
            ...state,
            data: payload
        }
    }
};

export default handleActions(reducerMap, initialState);