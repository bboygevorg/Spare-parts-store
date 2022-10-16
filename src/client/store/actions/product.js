import { createActions } from "redux-actions";
import { algoliaIndex } from "conf/main";
import { STORE_PATHS, decodeMask, ATTRIBUTES } from 'conf/consts';
import {replaceId} from "../../../helper/replaceId";

export const actions = createActions({
    SET_PRODUCT_DATA: null,
});

export const fetchProduct = (productId, currentLanguageName) => {
    const decodedId = `${STORE_PATHS[productId.split("_")[0]]}${decodeMask(replaceId(productId), 1)}`;
    return dispatch => {
       algoliaIndex.getObject(decodedId, {
        attributesToRetrieve: currentLanguageName ? [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`] : ATTRIBUTES
       })
        .then((res) => dispatch(actions.setProductData(res)))
        .catch(err => {
            if(err.status === 404) {
                dispatch(actions.setProductData({message: "No such product"}));
            }
        })
    }
}