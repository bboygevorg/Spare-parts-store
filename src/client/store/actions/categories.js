import {categoriesActions} from "conf/actionKeys";
import {storage} from "helper/utils";
// import {getCategoriesAlgolia} from "../algoliaQueries";
import {storageKeys} from "conf/consts";
// import {getStores} from "./stores";

export const startFetching = () => ({
    type: categoriesActions.START_FETCHING
})

export const endFetching = () => ({
    type: categoriesActions.END_FETCHING
})

const getCategoriesFullfilled = (payload) => ({
    type: categoriesActions.GET_CATEGORIES,
    payload,
})

export const getCategories = () => {
    return async (dispatch) => {
        dispatch(startFetching())
        storage(storageKeys.CATEGORIES).then(res => {
            dispatch(getCategoriesFullfilled(res))
            dispatch(endFetching())
            // dispatch(getStores())
        })
    };
};

const addSubsFullfilled = (payload) => ({
    type: categoriesActions.ADD_SUBS,
    payload,
})

// export const addSubs = (payload) => ({
//     type: categoriesActions.ADD_SUBS,
//     payload,
// })

export  const addSubs = (payload) => {
    return dispatch => {
        dispatch(addSubsFullfilled(payload))
        // dispatch(endFetching())
    }
}

export const setCurrentRefinements = payload =>  ({
    type: categoriesActions.SET_CURRENT_REFINEMENTS,
    payload
})

export const setCurrentStores = payload =>  ({
    type: categoriesActions.SET_CURRENT_STORES,
    payload
})

export const refineValue = (payload) => ({
    type: categoriesActions.REFINE_VALUE,
    payload,
})

export const refineStore = payload => ({
    type: categoriesActions.REFINE_STORE,
    payload
})

export const setMainCategories = payload => ({
    type: categoriesActions.SET_MAIN_CATEGORIES,
    payload
})
export  const setSearchRefinement = payload => ({
    type: categoriesActions.SET_SEARCH_REFINEMENT,
    payload
})
export const setIsSearching = payload =>  ({
    type: categoriesActions.SET_IS_SEARCHING,
    payload
})

export const setPaginationData = payload => ({
    type: categoriesActions.SET_PAGINATION_DATA,
    payload
})

export const setHitsPerPage = payload => ({
    type: categoriesActions.SET_HITS_PER_PAGE,
    payload
})

export const setInstantChecked = payload => ({
    type: categoriesActions.SET_INSTANT_CHECKED,
    payload
})

export const setCatalogChecked = payload => ({
    type: categoriesActions.SET_CATALOG_CHECKED,
    payload
})