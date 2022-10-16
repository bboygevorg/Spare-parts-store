import {storage} from "../../helper/utils";
import algoliasearch from "algoliasearch/index";
import uniqWith from "lodash/uniqWith"
import isEqual from "lodash/isEqual"
import isObject from "lodash/isObject"
import get from "lodash/get"
import config from "../../config"
import images from "./categoriesImages.json"
import {storageKeys} from "conf/consts";
import { ATTRIBUTES } from "conf/consts";

const searchClient = algoliasearch(
    process.env.APPLICATION_ID,
    process.env.ADMIN_API_KEY
);
const algoliaIndex = searchClient.initIndex(process.env.ALGOLIA_INDEX);

export const foo = () => {
    algoliaIndex.setSettings({
        attributesForFaceting: [
            'author',
            'filterOnly(category)',
            'searchable(publisher)'
        ]
    }).then(res => console.log(res))
}

function setImageUrl(key) {
    return images[key] ? `${config.BASE_URL}${get(images, key)}` : ""
}

function setSubs(arr) {
    let obj = {}
    const split = arr[0].split("|")
    const name = split[split.length - 1]
    if (arr.length < 2) {
        return {
            [arr[0]]: {
                img: setImageUrl(arr[0]),
                name,
            }
        }
    } else {
        obj = {
            [arr[0]]: {
                img: setImageUrl(arr[0]),
                name,
                subs: setSubs(arr.slice(1))
            }
        }
        return obj
    }
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export const getCategoriesAlgolia = () => {
    return new Promise((resolve, reject) => {
        algoliaIndex.search('Form', {
            attributesToRetrieve: ATTRIBUTES,
            hitsPerPage: 2000
        }).then((res) => {
            console.log(res.hits)
            const categories = res.hits.map(hit => ({
                [hit.stores[0].store_id]: setSubs(Object.keys(hit.categories).map(key => hit.categories[key]))
            }))
            const categoriesWithSubs = uniqWith(categories, isEqual)
            const mergedObjects = mergeDeep({}, ...categoriesWithSubs)
            storage(storageKeys.CATEGORIES, mergedObjects)
            const stores = res.hits.map(hit => hit.stores[0])
            storage(storageKeys.STORES, uniqWith(stores, isEqual))
            resolve()
        }).catch(err => reject(err));
    })
}
