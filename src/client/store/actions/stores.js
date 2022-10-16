import { storesActions} from "conf/actionKeys";
import {storage} from "helper/utils";
import {storageKeys} from "conf/consts";
import {getCategoriesAlgolia} from "../algoliaQueries";

const startFetching = () => ({
    type: storesActions.START_FETCHING
})

const endFetching = () => ({
    type: storesActions.END_FETCHING
})

const getStoresFullfilled = (payload) => ({
    type: storesActions.GET_STORES,
    payload,
})

export const getStores = () => {
    return async (dispatch) => {
        dispatch(startFetching())
        await getCategoriesAlgolia()
        storage(storageKeys.STORES).then(res => {
            dispatch(getStoresFullfilled(res))
            dispatch(endFetching())
        })
    };
};
