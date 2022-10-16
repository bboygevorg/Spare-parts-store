import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from 'store/actions/product';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';
import useCurrentLanguage from "talons/useCurrentLanguage";

export const useProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const product = useSelector(state => state.product.data);
  const { currentLanguageName } = useCurrentLanguage();

  useEffect(() => {
    if(!isEmpty(product)) {
      if(product.message) {
        history.push(`${history.location.pathname}/notfound`);
      }
      const lastViewed = localStorage.getItem('lastViewed')
      const lastViewedIds = lastViewed && JSON.parse(lastViewed)
      if (!lastViewedIds) {
          localStorage.setItem("lastViewed", JSON.stringify([product.objectID]))
      }
      if (lastViewedIds && !lastViewedIds.includes(product.objectID) && lastViewedIds.length <= 20) {
          lastViewedIds.push(product.objectID)
          localStorage.setItem('lastViewed', JSON.stringify(lastViewedIds))
      }
    }
  }, [product])

  useEffect(() => {
    if(productId) {
      dispatch(fetchProduct(productId, currentLanguageName))
    }
  }, [productId]);

  return {
    product
  };
};
