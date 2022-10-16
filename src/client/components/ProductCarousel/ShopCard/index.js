import React from "react";
import classes from "./shopCard.css";
import Link from "components/Link";
import { useDispatch } from "react-redux";
import { refineStore, setCurrentStores } from "actions/categories";
import { valueHandler } from "components/Algolia/ProductCategories/wrapper";
import Typo from "ui/Typo";
import useTranslation from 'talons/useTranslation';

const ShopCard = ({ item }) => {
  const dispatch = useDispatch();
  const __ = useTranslation();
  return (
    <Link
      to={{
        pathname: `/categories/${valueHandler(item.label, true).toLowerCase()}`,
        state: { storeCats: { store: item.value } },
      }}
      onClick={() => {
        dispatch(
          refineStore({
            value: item.vendorcode,
            label: item.vendorcode,
          })
        );
        dispatch(setCurrentStores([item.vendorcode]))
      }}
    >
      <div className={classes.root}>
        <div className={classes.imgWrapper}>
          <img src={item.finalImage} alt={item.label} />
        </div>
        <Typo as="h3" variant="h3" font="condensed">
          {__(item.label)}
        </Typo>
      </div>
    </Link>
  );
};
export default ShopCard;
