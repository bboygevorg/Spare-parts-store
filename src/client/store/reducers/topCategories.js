import { actions } from '../actions/topCategories';
import { handleActions } from 'redux-actions'

const initialState = {
    hits: [],
    filters: [],
    settingFilterFrom: "",
    facets: {}
};

const reducerMap = {
    [actions.setHits]: (state, { payload }) => {
        return {
            ...state,
            hits: payload
        }
    },
    [actions.setFilters]: (state, { payload }) => {
        return {
            ...state,
            filters: payload
        }
    },
    [actions.setFiltersFromList]: (state, { payload }) => {
        return {
            ...state,
            settingFilterFrom: payload
        }
    },
    [actions.setFacets]: (state, { payload }) => {
        return {
            ...state,
            facets: payload
        }
    }
};

export default handleActions(reducerMap, initialState);