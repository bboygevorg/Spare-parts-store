import { useState, useEffect } from 'react'
import { algoliaIndex } from "conf/main";
import { ATTRIBUTES } from 'conf/consts';
import useCurrentLanguage from 'talons/useCurrentLanguage';

export const useLastViewed = () => {
    const [products, setProducts] = useState([]);
    const { currentLanguageName } = useCurrentLanguage();

    const getProducts = async (productIds) => {
        const filtered = productIds.filter(el => {
            return el !== null;
        });
        const response = await algoliaIndex.getObjects(filtered, {
            attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]
        });
        if(response && response.results) {
            const filteredResults = response.results.filter(el => {
                return el !== null;
            })
            setProducts(filteredResults);
        }
    }

    useEffect(() => {
        const lastViewed = localStorage.getItem('lastViewed');
        const lastViewedIds = lastViewed && JSON.parse(lastViewed) || [];
        getProducts(lastViewedIds);
    }, []);

    return {
        products: products || []
    }
}