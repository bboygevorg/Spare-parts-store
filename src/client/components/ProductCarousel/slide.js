import React, { useMemo } from 'react'
import defaultClasses from './slide.css';
import { mergeClasses } from 'helper/mergeClasses';
import Link from 'components/Link';
import { useSelector, useDispatch } from 'react-redux'
import { productActions } from 'store/actions/products'
import { STORES, createMask } from 'conf/consts';
import isEmpty from 'lodash/isEmpty';
import useCurrentLanguage from 'talons/useCurrentLanguage';
import get from 'lodash/get';
import { pageTitle } from 'helper/utils';
import {replaceId} from "../../../helper/replaceId";
import {getPriceByZip} from "../../../helper/utils";

const Slide = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { product, isInLastViewed } = props
    if(!product) {
        return <div></div>
    }
    const wishList = useSelector(state => state.products.wishList)
    const dispatch = useDispatch()
    const { currentLanguageName } = useCurrentLanguage();
    const handleAddToWishList = (event, id) => { event.preventDefault(); dispatch(productActions.toggleAddToWishList(id))}
    const inWishList = wishList.includes(product.objectID);
    const vendorCode = useMemo(
      () => STORES.find((brand) => brand.vendorcode === product.vendorcode),
      [product.vendorcode]
    );
    return (
      <Link to={`/product/bc${product.vendorcode}_${createMask(replaceId(product.objectID), 1)}`}>
        <div className={classes.miniSlideCard}>
          <div className={classes.header}>
            <div className={classes.brand}>
              {!isEmpty(vendorCode) && vendorCode.brandIcon && (
                <img
                  src={require(`../../assets/images/brands/${vendorCode.brandIcon}`)}
                />
              )}
            </div>
            <div className={classes.wishlist}>
              <span
                className={`${
                  inWishList ? classes.inWishList : classes.wishlistTrigger
                }`}
                onClick={(e) => handleAddToWishList(e, product.objectID)}
              ></span>
            </div>
          </div>
          <div className={classes.miniSlideCardContent}>
            <div className={classes.productImg}>
              <img src={product.images.length && product.images[0].imageURL} alt={pageTitle(product)}/>
            </div>
            <p
              className={`${classes.productName} ${
                isInLastViewed && classes.inLastViewedName
              }`}
            >
              {get(product, `name_${currentLanguageName}`) || product.name}
            </p>
            <span
              className={`${classes.costSpan} ${
                isInLastViewed && classes.inLastViewedPrice
              }`}
            >{`$${getPriceByZip(product)}`}</span>
          </div>
        </div>
      </Link>
    );
}

export default Slide
