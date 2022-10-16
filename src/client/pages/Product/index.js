import React from "react";
import { withRouter } from "react-router";
import classes from "./productPage.css";
import ProductContent from 'components/ProductContent';
import { useParams } from "react-router-dom";
import { fetchProduct } from 'store/actions/product';
import { STORE_PATHS, decodeMask } from 'conf/consts';
import {replaceId} from "../../../helper/replaceId";

const ProductPage = () => {
  const { productId } = useParams();
  
  return (
    <div className={classes.root}>
        <ProductContent id={`${STORE_PATHS[productId.split("_")[0]]}${decodeMask(replaceId(productId), 1)}`}/>
    </div>
  );
};

export const loadData = (store, req) => {
  const slug = req.path.split("/");
  if (slug && slug.length > 1) {
    const productId = slug && slug[2];
    return store.dispatch(fetchProduct(productId));
  }
};

export default {
  component: withRouter(ProductPage),
  loadData
};
