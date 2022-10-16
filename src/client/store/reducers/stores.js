import { storesActions } from "conf/actionKeys";

const initial = {
    isFetching: false,
    data: []
};

export function stores(state = initial, action) {
    switch (action.type) {
        case storesActions.START_FETCHING: {
            return {
                ...state,
                isFetching: true
            }
        }
        case storesActions.END_FETCHING: {
            return {
                ...state,
                isFetching: false
            }
        }
        case storesActions.GET_STORES: {
            return {
                ...state,
                data: action.payload
            };
        }
        default:
            return state;
    }
}
