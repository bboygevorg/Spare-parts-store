import React from "react";
import ProductCategoriesPage from "algolia/ProductCategoriesPage";
import Head from "components/Head";
import { STATIC_DESCRIPTION } from 'conf/consts';

const ProductCategories = () => {
  return (
    <div>
      <Head canonical="/product-categories/" description={STATIC_DESCRIPTION}>
        Product categories
      </Head>
      <ProductCategoriesPage
        attributes={["categories.lvl0", "categories.lvl1"]}
        limit={12}
      />
    </div>
  );
};

export default ProductCategories;
