import React, { useState, useEffect, Fragment, useCallback } from "react";
// import {algoliaIndex} from "config/main";
import defaultClasses from "./productCard.css";
import { mergeClasses } from "helper/mergeClasses";
// import Favorite from '../../../../public/icons/favorites.svg';
import Button from "components/Button";
import Link from "components/Link";
import { SERVICE_OFF_KEY, createMask } from "conf/consts";
import { searchClient } from 'conf/main';
import { useSelector, useDispatch } from "react-redux";
import { actions } from "store/actions/signIn";
import { ADD_TO_CART, REMOVE_ITEM_FROM_WISHLIST } from "api/mutation";
import { useMutation } from "@apollo/react-hooks";
import Typo from "components/UI/Typo/index";
import Favorite from "icons/Favorite";
import Close from "icons/Close";
import get from 'lodash/get'
import useWindowDimensions from "talons/useWindowDimensions"; 
import useTranslation from 'talons/useTranslation';
import useCurrentLanguage from 'talons/useCurrentLanguage';
import Modal from "components/Modal/modal";
import LicenseModal from 'components/Algolia/ProductList/LicenseModal';
import DeclineAddToCartModal from 'components/Algolia/ProductList/DeclineAddToCartModal';
import ServiceShutDownModal from 'components/Algolia/ProductList/ServiceShutDownModal';
import ZipcodeVerificationModal from 'components/Algolia/ProductList/ZipcodeVerificationModal';
import { useHistory } from "react-router-dom";
import { codeSplitter } from 'components/Link/link';
import SelectWishList from 'components/WishList/selectWishList';
import QuantityInput from "components/QuantityInput";
import isEmpty from 'lodash/isEmpty';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { GET_ALL_WISHLIST_ITEMS } from 'api/query';
import { actions as wishListActions } from 'actions/wishList';
import aa from 'search-insights';
import { pageTitle } from "helper/utils";
import {replaceId} from "../../../helper/replaceId";
import getZoneCode from "../../../helper/getZoneCode";
import {getPriceByZip} from "helper/utils";

// function getImgSize(imgSrc) {
//   let newImg = new Image();
//   let size  = {
//     width: 0,
//     height: 0
//   }
//   newImg.onload = function () {
//     var height = newImg.height;
//     var width = newImg.width;
//     alert("The image size is " + width + "*" + height);
//   };

//   newImg.src = imgSrc; // this must be done AFTER setting onload
// }
const ProductCard = ({ product: prodObj, large, isFavorites, isLastViewed, onClickHelpButton, searchRef, fromCategory, isFeatured, removeItem, classes: parentClasses }) => {
  // const [hits, setHits] = useState();
  // useEffect(() => {
  //     fetchHits();
  // }, []);
  // const fetchHits = useCallback(async () => {
  //     const {hits} = await algoliaIndex.search("Form");
  //     setHits(hits);
  // }, [setHits]); 
  const [product, setProduct] = useState({});
  const [inWishList, setInWishList] = useState(false);
  const [isOpenLicense, setIsOpenLicense] = useState(false);
  const [licenseData, setLicenseData] = useState([]);
  const [isOpenDecline, setIsOpenDecline] = useState(false);
  const [declineText, setDeclineText] = useState('');
  const [isOpenZipcode, setIsOpenZipcode] = useState(false);
  const [isOpenServiceoff, setIsOpenServiceOff] = useState(false);
  const [isOpenWishList, setIsOpenWishList] = useState(false);
  const [count, setCount] = useState(1);
  const customerData = useSelector((state) => state.signin.customerData);
  const cartToken = useSelector((state) => state.signin.cartToken);
  const isAuth = useSelector((state) => state.signin.isAuth);
  const allWishlistItems = useSelector(state => state.wishList.allItems);
  const __ = useTranslation();
  const { width } = useWindowDimensions();
  const { currentLanguageName } = useCurrentLanguage();
  const firebaseValues = useSelector(state => state.firebase.config);
  const localeId = useSelector(state => state.language.currentLanguage);
  const serviceOff = firebaseValues && firebaseValues[SERVICE_OFF_KEY]
  const [
    addToCart,
    { loading: addItemLoader, error: addToCartError },
  ] = useMutation(ADD_TO_CART);
  const [removeItemFromWishlist] = useMutation(REMOVE_ITEM_FROM_WISHLIST);
  const getAllWishlistItems = useAwaitQuery(GET_ALL_WISHLIST_ITEMS);
  const [graphqlError, setGraphqlError] = useState("");
  // const vendorCode = useMemo(
  //   () => product && product.vendorcode ? STORES.find((brand) => brand.vendorcode === product.vendorcode) : {},
  //   [product]
  // );
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSetCount = (e, value) => {
    e.preventDefault();
    e.stopPropagation();
    setCount(value);
  };

  const handleAddToWishList = async (event) => {
    event.preventDefault();
    if(!isAuth) {
      if(localeId === "default") {
        history.push('/signin', { state: { previousPath: history.location.pathname }});
      }
      else {
        history.push(`signin${codeSplitter(localeId)}`, { state: { previousPath: history.location.pathname }});
      }
    }
    else
    if(inWishList && !isEmpty(product) && product.wishList && product.wishList.length) {
      if(product.wishList.length === 1) {
        const res = await removeItemFromWishlist({
          variables: {
            customerToken: customerData.customerToken,
            wishlistItemIds: [product.wishList[0].itemId]

          },
          fetchPolicy: "no-cache"
        });
        if(res && res.data && res.data.removeItemsFromWishlist) {
          const allItems = await getAllWishlistItems({
            variables: {
              customerToken: customerData.customerToken,
            },
            fetchPolicy: "no-cache"
          });
          if(allItems && allItems.data && allItems.data.getAllWishlistItems && !allItems.data.getAllWishlistItems.length) {
            localStorage.removeItem("allWishListItems")
          }
          dispatch(wishListActions.setAllItems(allItems.data.getAllWishlistItems));
          setInWishList(false);
        }
      }
      else {
        setIsOpenWishList(true);
        window.scrollTo(0, 0);
      }
    }
    else {
      setIsOpenWishList(true);
      window.scrollTo(0, 0);
    }
  };

  const classes = mergeClasses(defaultClasses, parentClasses);
  const addProductToCart = async () => {
    const response = await addToCart({
      variables: {
        item: {
          sku: product.objectID,
          qty: count,
        },
        customerToken: customerData.customerToken
          ? customerData.customerToken
          : "",
        cartToken: cartToken ? cartToken : "",
				zoneCode: getZoneCode()
      },
    });
    setCount(1);
    dispatch(actions.addCartToken(response.data.addToCart.cartToken));
    dispatch(actions.addCart(response.data.addToCart));
    dispatch(actions.setIsActiveCart(true));
  };

  const checkLicenses = useCallback(() => {
    const hv = product.hvac_license_required;
    const ep = product.epa_certification_required;
    if(!isAuth) {
      if(hv && ep) {
        setDeclineText('HVAC License and EPA Certification are');
        setIsOpenDecline(true);
      }
      else
      if(hv) {
        setDeclineText('HVAC License');
        setIsOpenDecline(true);
      }
      else
      if(ep) {
        setDeclineText('EPA Certification');
        setIsOpenDecline(true);
      }
      else {
        addProductToCart();
      }
    }
    else {
      if(hv && ep && !customerData.hvacLicense && !customerData.epaCertification) {
        setLicenseData([{
          title: 'hvac',
          placeholder: 'HVAC License',
        },
        {
          title: 'epa',
          placeholder: 'EPA Certification',
        }])
        setIsOpenLicense(true);
        window.scrollTo(0, 0);
      }
      else
      if(hv && !customerData.hvacLicense) {
        setLicenseData([{  
          title: 'hvac', 
          placeholder: 'HVAC License', 
        }])
          setIsOpenLicense(true);
          window.scrollTo(0, 0);
      }
      else
      if(ep && !customerData.epaCertification) {
        setLicenseData([{
          title: 'epa',
          placeholder: 'EPA Certification',
        }])
          setIsOpenLicense(true);
          window.scrollTo(0, 0);
      }
      else {
        addProductToCart();
      }
    }
  }, [product, customerData, isAuth, serviceOff, count, cartToken]);

  const checkDestination = () => {
    setIsOpenZipcode(true);
    window.scrollTo(0, 0);
  }

  const handleIsInWishList = useCallback(() => {
    if(isAuth) {
      if(!isEmpty(prodObj)) {
        if(allWishlistItems && allWishlistItems.length) {
          const inWishlistArr = allWishlistItems.filter(item => item.sku === prodObj.objectID);
          if(inWishlistArr && inWishlistArr.length) {
            const updatedObj = {...prodObj, wishList: inWishlistArr }
            setProduct(updatedObj);
            setInWishList(true)
          }
          else {
            setProduct(prodObj);
          }
        }
        else {
          setProduct(prodObj);
        }
      }
    }
    else {
      setProduct(prodObj);
    }
  }, [isAuth, prodObj, allWishlistItems]);

  useEffect(() => {
    handleIsInWishList();
	}, [isAuth, prodObj, allWishlistItems]);

  useEffect(() => {
    if (addToCartError) {
      const parseError = JSON.parse(JSON.stringify(addToCartError));
      const code = parseError.graphQLErrors[0].code;
      if (code === 31) {
	      dispatch(actions.clearCart());
        window.scrollTo(0, 0);
      } else {
        setGraphqlError("Unexpected server error. Please try again.");
      }
    }
  }, [addToCartError]);

  if (isEmpty(product)) {
    return null;
  }

  if(product.is_action) {
    return (
      <div
        className={`${classes.helpProductWrapper} ${
          large ? classes.cardWrapperLarge : ""
        }`}
        onClick={() => {
          onClickHelpButton();
        }}
      >
        <div className={classes.productBox} key={product.product_id}>
          {/* asdf */}
          <div className={`${classes.productImg} ${classes.helpProduct} ${large ? classes.helpProductLargeImage : ""}`}>
            <img src={product.action_icon_url} alt="help icon" />
          </div>
          <div className={classes.productContent}>
            <Typo
              font="regular"
              variant="p"
              className={classes.helpProductTitle}
            >
              {product.action_info_text}
            </Typo>

            <Typo variant="p" className={`${classes.helpProductText} ${large ? classes.helpProductTextLarge : ""}`}>
              {width > 784 ? product.action_additional_text : product.action_text}
            </Typo>
            <Button
              label={product.action_text}
              type="bordered"
              classes={{ button_bordered: defaultClasses.buttonStock }}
              onClick={(e) => {
                e.preventDefault();
                onClickHelpButton()
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Link
      to={{
        pathname: `/product/bc${product.vendorcode}_${createMask(replaceId(product.objectID), 1)}`,
        state: { searchRef, fromCategory, isFavorites }
      }}
        className={`${classes.cardWrapper} ${
          large ? classes.cardWrapperLarge : ""
        } ${isFavorites ? classes.wrapperFavorites : ''}`}
        onClick={() => {
          if(product.__queryID) {
            aa('clickedObjectIDsAfterSearch', {
              index: process.env.ALGOLIA_INDEX,
              eventName: 'Click item',
              queryID: product.__queryID,
              objectIDs: [product.objectID],
              positions: [product.__position],
              userToken: searchClient.transporter.headers['X-Algolia-UserToken']
            });
          }
        }}
      >
        <div className={isFavorites || isLastViewed ? classes.positionedProductBox : classes.productBox} key={product.product_id}>
          {product.delivery_option === 0 ?
              <img
                className={classes.positionedInstantImg}
                src={require(`../../assets/icons/instant.svg`)}
            />
          :
            null
          }
          {!large && (
            <div className={classes.brand}>
              {/* {!isEmpty(vendorCode) && vendorCode.brandIcon && (
                <img
                  src={require(`../../assets/images/brands/${vendorCode.brandIcon}`)}
                />
              )} */}
              {isFavorites  ? <div  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(product.itemId)}}><Close /></div> :      <div
                  className={inWishList && isFeatured ? classes.inWishListWrapper : classes.favoriteWrapper}
                  onClick={(e) => { e.stopPropagation(); handleAddToWishList(e)}}
                >
                  {isAuth && inWishList ? (
                    <span
                      className={classes.inWishList}
                      // onClick={(e) => handleAddToWishList(e, product.objectID)}
                    ></span>
                  ) : (
                    <Favorite
                    // className={`${
                    //   inWishList ? classes.filledFavoriteIcon : classes.favoriteIcon
                    // }`}
                    />
                  )}
                </div> 
              //   <span
              //   className={`${
              //     inWishList
              //       ? classes.inWishListSmall
              //       : classes.wishlistTriggerSmall
              //   }`}
              //   onClick={(e) => handleAddToWishList(e, product.objectID)}
              // ></span>
              }
        
            </div>
          )}
          <div className={classes.productImg}>
            <img src={product.images[0].imageURL} alt={pageTitle(product)} />
          </div>
          <div className={classes.productContent}>
            {large && (
              <div className={classes.brandLarge}>
                {/* {!isEmpty(vendorCode) && vendorCode.brandIcon && (
                  <img
                    src={require(`../../assets/images/brands/${vendorCode.brandIcon}`)}
                  />
                )} */}
                {/* <div className={classes.brandWrapper}>
                  <Typo
                    font="regular"
                    variant="p"
                    className={classes.productBrand}
                  >
                    {__("By")}
                  </Typo>
                  <Typo variant="p" className={classes.productNameLarge}>&nbsp;{__(get(vendorCode, 'label', ''))}</Typo>
                </div> */}
                {/* <span
                  className={`${
                    inWishList ? classes.inWishList : classes.wishlistTrigger
                  }`}
                  onClick={(e) => handleAddToWishList(e, product.objectID)}
                ></span> */}
                <div
                  className={classes.favoriteWrapperLarge}
                  onClick={(e) => handleAddToWishList(e)}
                >
                  {inWishList ? (
                    <span
                      className={classes.inWishList}
                      // onClick={(e) => handleAddToWishList(e, product.objectID)}
                    ></span>
                  ) : (
                    <Favorite
                    // className={`${
                    //   inWishList ? classes.filledFavoriteIcon : classes.favoriteIcon
                    // }`}
                    />
                  )}
                </div>
              </div>
            )}
            <Typo font="regular" variant="p" className={classes.productName}>
              {get(product, `name_${currentLanguageName}`) || product.name}
            </Typo>
            {/* {!large && (
              <div className={classes.brandWrapper}>
                <Typo font="regular" variant="p" className={classes.productBrand}>
                  {__("By")}
                </Typo>
                <Typo variant="p" className={classes.brandName}>&nbsp;{__(get(vendorCode, 'label', ''))}</Typo>
              </div>
            )} */}

            <Typo
              variant="h3"
              className={classes.productCost}
            >{`$${getPriceByZip(product)}`}</Typo>

            {large && (get(product, `description_${currentLanguageName}`) || product.description) ? (
              <div className={classes.desc}>
                <Typo font="regular" className={classes.description}>
                  {get(product, `description_${currentLanguageName}`) || product.description}
                </Typo>
                <p className={classes.readMore}>{__("READ MORE")}</p>
              </div>
            ) : null}
              <div className={classes.add_Button_div}>
                {graphqlError && (
                  <Typo variant="px" color="error" font="regular">
                    {graphqlError}
                  </Typo>
                )}
                {product.in_stock && product.prices && product.prices[getZoneCode()] ?
                  <div className={classes.qtyAddButtons}>
                    <QuantityInput
                      className={classes.quantityInput}
                      value={count}
                      setValue={handleSetCount}
                    />
                    <Button
                      label={__("ADD TO CART")}
                      type="bordered"
                      classes={{ button_bordered: defaultClasses.buttonComponent, submittingBtn: classes.submitButton, checkedBtn: classes.checkedBtn }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.fbq('track', 'AddToCart', {
                          productId: product.product_id,
                          value: product.price,
                          currency: 'USD'
                        });
                        aa('convertedObjectIDs', {
                          index: process.env.ALGOLIA_INDEX,
                          eventName: 'Add to basket',
                          objectIDs: [product.objectID],
                          userToken: searchClient.transporter.headers['X-Algolia-UserToken']
                        });
                        if(serviceOff === 'true') {
                          setIsOpenServiceOff(true);
                          window.scrollTo(0, 0);
                          return;
                        }
                        checkLicenses();
                        if(!localStorage.getItem('askedforzipcode')) {
                          checkDestination();
                        }
                      }}
                      disabled={addItemLoader}
                      isSubmitting={addItemLoader}
                    />
                  </div>
                :
                <Button
                  type="bordered"
                  classes={{ button_bordered: defaultClasses.buttonStock }}
                  label={__("CALL FOR STOCK")}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }}
                  isSubmitting={false}
                  disabled={true}
                />
              }
              </div>
          </div>
        </div>
      </Link>
      <Modal
        isShown={isOpenLicense}
        onClose={() => {
          setIsOpenLicense(false);
        }}
        className={classes.dialog}
      >
        <LicenseModal
          licenses={licenseData}
          cancel={() => setIsOpenLicense(false)}
          add={addProductToCart}
        />
      </Modal>
      <Modal
        isShown={isOpenDecline}
        onClose={() => {
          setIsOpenDecline(false);
        }}
        className={classes.declineDialog}
      >
        <DeclineAddToCartModal text={declineText}/>
      </Modal>
      <Modal
        isShown={isOpenServiceoff}
        onClose={() => setIsOpenServiceOff(false)}
        className={classes.declineDialog}
      >
        <ServiceShutDownModal />
      </Modal>
      <Modal
        isShown={isOpenZipcode}
        onClose={() => { setIsOpenZipcode(false); localStorage.setItem('askedforzipcode', true)}}
        className={classes.zipcodeModal}
      >
        <ZipcodeVerificationModal onClose={() => setIsOpenZipcode(false)} checkLicenses={checkLicenses}/>
      </Modal>
      <Modal
        isShown={isOpenWishList}
        onClose={() => setIsOpenWishList(false)}
        className={classes.wishListModal}
      >
        <SelectWishList
          product={product}
          onClose={() => setIsOpenWishList(false)}
          setInWishList={setInWishList}
          type={inWishList ? 'remove' : 'add'}
        />
      </Modal>
    </Fragment>
  );
};

export default ProductCard;
