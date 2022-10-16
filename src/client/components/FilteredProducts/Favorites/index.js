import React, { useState } from "react";
import classes from "./favorites.css";
import QuantityInput from "components/QuantityInput";
import Button from "components/Button";
import { useItem } from "talons/Gallery/useItem";
import { ADD_TO_CART } from "api/mutation";
import Typo from "components/UI/Typo/index";
import { useDispatch } from "react-redux";
import { productActions } from "actions/products";
import useTranslation from 'talons/useTranslation';

export default function Favorites({ hit }) {
  const dispatch = useDispatch();
  const __ = useTranslation();
  const [qty, setQty] = useState(1)
  const { handleAddToCart, isSubmitting } = useItem({
    item: hit,
    addToCartMutation: ADD_TO_CART,
  });

  const handleAddToWishList = (event, id) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    dispatch(productActions.toggleAddToWishList(id));
  };
  return (
    <div className={classes.favoriteItemWrapper}>
      <div
        className={classes.closeIcon}
        onClick={(e) => handleAddToWishList(e, hit.objectID)}
      >
        <span className={classes.closeImg}></span>
      </div>
      <div className={classes.favoriteItemImage}>
        <img src={hit.images[0].imageURL} alt={hit.name} />
      </div>
      <div className={classes.favoriteItemDesc}>
        {/* <div className={classes.favoriteItemTitle}> */}
        <Typo className={classes.favoriteItemTitle}>
          8 ft. L x 2 ft. 1.5 in. D x 1 in. T Butcher Block Countertop in Oiled
          Acacia with Organic White Wood Stain Finish {hit.name}
        </Typo>
        {/* </div> */}
        <div className={classes.favoriteItemBtnWrapper}>
          <QuantityInput
            value={qty}
            setValue={setQty}
            className={classes.quantityInput}
            // classes={{ decr }}
          />
          <Button
            label={__("ADD TO CART")}
            type="primary"
            classes={{ button_primary: classes.favoriteButton }}
            onClick={async (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              await handleAddToCart({ quantity: qty });
              setQty(1);
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
