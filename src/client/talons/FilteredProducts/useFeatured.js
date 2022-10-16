import { useEffect, useState } from 'react';
import { algoliaIndex } from "conf/main";
import { ATTRIBUTES } from 'conf/consts';
import useCurrentLanguage from 'talons/useCurrentLanguage';

export const useFeatured = () => {
  const [products, setProducts] = useState([])
  const { currentLanguageName } = useCurrentLanguage();

  const getPpeProducts = async () => {
    const products = await algoliaIndex
    .search("", {
      attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`],
      facetFilters: [
        'vendorcode:8',
        'featured:true',
        'in_stock:true'
      ],
      hitsPerPage: 20
    })
    if(products && products.hits.length) {
      setProducts(products.hits);
    }
  }
  useEffect(() => {
      getPpeProducts();
  },[])

  return {
      products: products || []
  }
}