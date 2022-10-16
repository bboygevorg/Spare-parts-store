import { actions } from '../actions/language';
import { handleActions } from 'redux-actions';

const initialState = {
    currentLanguage: '',
    data: [],
};

const reducerMap = {
    [actions.setCurrentLanguage]: (state, {payload}) => {
        return {
            ...state,
            currentLanguage: payload
        }
    },
    [actions.setTranslation]: (state, {payload}) => {
        return {
            ...state,
            data: payload
        }
    }
};

export default handleActions(reducerMap, initialState);