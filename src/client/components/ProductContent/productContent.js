import React, { useState, useEffect, useCallback } from "react";
import { useProductPage } from "talons/ProductPage/useProductPage";
import defaultClasses from "./productContent.css";
import {
  CarouselProvider,
  Slider,
  ButtonBack,
  ButtonNext,
  DotGroup,
  Dot,
} from "pure-react-carousel";
import { connectSearchBox } from "react-instantsearch-dom";
import QuantityInput from "components/QuantityInput";
import Button from "components/Button";
import ReadMore from "components/ReadMore";
import ContentSlide from "./contentSlide";
import { mergeClasses } from "helper/mergeClasses";
import { Link } from "react-scroll";
import { useMutation } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "store/actions/signIn";
import FilteredProducts from "components/FilteredProducts";
import Loading from "components/Loading";
import { ADD_TO_CART, REMOVE_ITEM_FROM_WISHLIST } from "api/mutation";
import AppWrapper from "components/UI/AppWrapper";
import Typo from "ui/Typo";
import { STORES, MOBILE_SIZE, SERVICE_OFF_KEY } from "conf/consts";
import isEmpty from "lodash/isEmpty";
import useWindowDimensions from "talons/useWindowDimensions";
import Head from "components/Head";
import CurrentNavigation from "components/Navigation";
import {
  valueHandler,
  valueSplited,
} from "components/Algolia/ProductCategories/wrapper";
import { withRouter } from "react-router-dom";
import useTranslation from 'talons/useTranslation';
import get from "lodash/get";
import useCurrentLanguage from 'talons/useCurrentLanguage';
import Modal from "components/Modal/modal";
import LicenseModal from 'components/Algolia/ProductList/LicenseModal';
import DeclineAddToCartModal from 'components/Algolia/ProductList/DeclineAddToCartModal';
import ServiceShutDownModal from 'components/Algolia/ProductList/ServiceShutDownModal';
import config from "../../../config";
import { getDeliveryTime, pageTitle } from 'helper/utils';
import Tooltip from 'components/Tooltip';
import ZipcodeVerificationModal from 'components/Algolia/ProductList/ZipcodeVerificationModal';
import { useHistory } from "react-router-dom";
import { codeSplitter } from 'components/Link/link';
import SelectWishList from 'components/WishList/selectWishList';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { GET_ALL_WISHLIST_ITEMS } from 'api/query';
import { actions as wishListActions } from 'actions/wishList';
import { searchClient } from 'conf/main';
import aa from 'search-insights';
import getZoneCode from "../../../helper/getZoneCode";
import {getPriceByZip} from "../../../helper/utils";

function arrayOfCategories(obj) {
  return Object.values(obj).map((el) => valueHandler(valueSplited(el), true));
}

function getUrlFromProduct(prod) {
  const vendorCode = STORES.find((el) => el.vendorcode === prod.vendorcode);
    if(vendorCode) {
    const storeName = valueHandler(
      vendorCode.label.toLowerCase(),
      true
    );
    const categories = arrayOfCategories(prod.categories).join("/");
    const url = `/categories/${storeName}/${categories}/${prod.name.replace(
      /\//g,
      "⧸"
    )}`;

    return url;
  }
  else {
    console.log('hii')
    return ''
  }
}

const Productcontent = (props) => {
  const { product: prodObj } = useProductPage();
  const { id } = props;
  const [isOpenLicense, setIsOpenLicense] = useState(false);
  const [licenseData, setLicenseData] = useState([]);
  const [isOpenDecline, setIsOpenDecline] = useState(false);
  const [declineText, setDeclineText] = useState('');
  const [isOpenServiceoff, setIsOpenServiceOff] = useState(false);
  const [isOpenZipcode, setIsOpenZipcode] = useState(false);
  const [isOpenWishList, setIsOpenWishList] = useState(false);
  const [product, setProduct] = useState({});
  const [inWishList, setInWishList] = useState(false);
  const customerData = useSelector((state) => state.signin.customerData);
  const cartToken = useSelector((state) => state.signin.cartToken);
  const isAuth = useSelector((state) => state.signin.isAuth);
  const firebaseValues = useSelector(state => state.firebase.config);
  const localeId = useSelector(state => state.language.currentLanguage);
  const allWishlistItems = useSelector(state => state.wishList.allItems);
  const __ = useTranslation();
  const { currentLanguageName } = useCurrentLanguage();
  const serviceOff = firebaseValues && firebaseValues[SERVICE_OFF_KEY];
  const dispatch = useDispatch();
  const history = useHistory();
  const [
    addToCart,
    { error: addToCartError, loading: addItemLoader },
  ] = useMutation(ADD_TO_CART);
  const getAllWishlistItems = useAwaitQuery(GET_ALL_WISHLIST_ITEMS);
  const [removeItemFromWishlist] = useMutation(REMOVE_ITEM_FROM_WISHLIST);
  const [count, setCount] = useState(1);
  const width = useWindowDimensions().width;
  const [graphqlError, setGraphqlError] = useState("");
  const [readMoreHeight, setReadMoreHeight] = useState(0);

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

  const handleSetCount = (e, value) => {
    e.preventDefault();
    setCount(value);
  }

  const getCartToken = async () => {
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
        getCartToken();
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
        getCartToken();
      }
  }
  }, [product, isAuth, customerData, count, serviceOff, cartToken]);

  const checkDestination = () => {
    setIsOpenZipcode(true);
    window.scrollTo(0, 0);
  }

  const createDeliveryTime = () => {
    let text = '';
    if(product) {
      if(product.delivery_option === 0) {
        text = __("Same day");
      }
      else {
        text = getDeliveryTime(product.delivery_option);
      }
    }
    return text;
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
    if (product) {
      if (typeof window !== "undefined") {
        if (window.fbq != null) {
          window.fbq('track', 'View Content', {
            productId: product.product_id,
            value: product.price,
            currency: 'USD'
          });
        }
      }
    }
  }, [product]);
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

  const classes = mergeClasses(defaultClasses, props.classes);
  if (isEmpty(product) || product.objectID !== id) {
    return (
      <div className={classes.loadingWrapper}>
        {" "}
        <Loading />{" "}
      </div>
    );
  }
  const desc = get(product, `description_${currentLanguageName}`) || product.description;
  const newDesc =  desc ? desc.replace(/{bs}/g, "<li>").replace(/{be}/g, "</li>") : ""; 

  return (
    <div>
      <Head isProduct={true}>{pageTitle(product)}</Head>
      <AppWrapper>
        {width > MOBILE_SIZE && (
          <div style={{display: 'none'}}>
            <CurrentNavigation url={getUrlFromProduct(product)} />
          </div>
        )}
        <div className={classes.main} itemScope itemType="http://schema.org/Product">
          <CarouselProvider
            className={classes.productCarousel}
            totalSlides={product.images.length}
            naturalSlideHeight={802}
            naturalSlideWidth={742}
            orientation="horizontal"
            dragStep={1}
            infinite={true}
          >
            <DotGroup
              className={classes.thumbnails}
              renderDots={() =>
                product.images.map((image, index) => (
                  <Dot key={index} slide={index} className={classes.thumbnail}>
                    <img src={image.imageURL} alt={pageTitle(product)}/>
                  </Dot>
                ))
              }
            />
            <div className={classes.mainSlider}>
              <div className={classes.wishlist}>
                <span
                  className={`${
                    isAuth && inWishList ? classes.inWishList : classes.hitRating
                  }`}
                  onClick={(e) => handleAddToWishList(e)}
                ></span>
              </div>
              <Slider className={classes.slider}>
                {product.images.length &&
                  product.images.map((image, index) => (
                    <div key={index} className={classes.currentSlide}>
                      <ContentSlide image={image.imageURL} index={index} product={product}/>
                    </div>
                  ))}
              </Slider>
              <div className={classes.buttons}>
                <ButtonBack className={classes.backBtn}>
                  <span className={classes.leftIcon}></span>
                </ButtonBack>
                <ButtonNext className={classes.nextBtn}>
                  <span className={classes.rightIcon}></span>
                </ButtonNext>
              </div>
              { product.delivery_option === 0 ?
                <Tooltip
                  content={__(`Products with this "Instant" badge can be delivered with in 1 hour`)} 
                  direction="top"
                >
                  <div className={classes.instant}>
                    <img
                      className={classes.instantImg}
                      src={require(`../../assets/icons/instant-product.svg`)}
                    />
                  </div>
                </Tooltip>
                :
                null
              }
            </div>
          </CarouselProvider>
          <div className={classes.description} id={"product-description"}>
            <span className={classes.hiddenLink} itemProp="brand" itemScope itemType="http://schema.org/Organization">
              <span itemProp="name">{product.brand}</span>
            </span>
            <p className={classes.hiddenLink} itemProp="description">{desc.replace(/{bs}/g, "").replace(/{be}/g, "")}</p>
            <span itemProp="sku" content={product.sku}/>
            <Typo
              as="h3"
              variant="h3"
              font="condensed"
              color="primary"
              className={classes.descTitle}
              itemProp="name"
            >
              {get(product, `name_${currentLanguageName}`) || product.name }
            </Typo>
            <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
              <a href={`${config.BASE_URL}product/${product.objectID}`} className={classes.hiddenLink} itemProp="url">{`${config.BASE_URL}product/${product.objectID}`}</a>
              {product.in_stock ? 
                <link itemProp="availability" href="https://schema.org/InStock" />
              : 
                <link itemProp="availability" href="https://schema.org/OutOfStock" />
              }
              <Typo
                as="p"
                variant="px"
                font="regular"
                color="code"
                className={classes.codeTitle}
              >{`${__("Code")}: `}</Typo>
              <Typo
                as="p"
                variant="px"
                font="regular"
                color="code"
                className={classes.code}
                itemProp="sku"
              >{product.msku}</Typo>
              <Typo
                as="h2"
                variant="h2"
                font="condensed"
                color="primary"
                className={classes.cost}
                itemProp="priceCurrency"
                content="USD"
              >$</Typo>
              <Typo
                as="h2"
                variant="h2"
                font="condensed"
                color="primary"
                className={classes.cost}
                itemProp="price"
              >{getPriceByZip(product)}</Typo>
            </span>
            <div className={classes.addToCard}>
              <div className={classes.button_Input_Div}>
                <Typo
                  as="p"
                  variant="p"
                  font="regular"
                  color="primary"
                  className={classes.qty}
                >
                  {width >= 784 ? __("Qty:") : __("Quantity")}
                </Typo>
                <QuantityInput
                  className={classes.quantityInput}
                  value={count}
                  setValue={handleSetCount}
                />
              </div>
              {product.in_stock && product.prices && product.prices[getZoneCode()] ? (
                <Button
                  classes={{ button_primary: classes.button_component }}
                  label={__("ADD TO CART")}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      if (window.fbq != null) {
                        window.fbq('track', 'AddToCart', {
                          productId: product.product_id,
                          value: product.price,
                          currency: 'USD'
                        });
                      }
                    }
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
                  isSubmitting={addItemLoader}
                  disabled={addItemLoader}
                />
              ) : (
                <Button
                  classes={{ button_primary: classes.button_component }}
                  label={__("CALL FOR STOCK")}
                  onClick={() => {
                    return false;
                  }}
                  isSubmitting={false}
                  disabled={true}
                />
              )}
            </div>
            {graphqlError && (
              <span className={classes.errorMessage}>{graphqlError}</span>
            )}
            <Typo as="p" font='bold'>{__("Currently only delivering to Los Angeles County, California")}</Typo>
            {product.description ? (
              <div>
                <Typo
                  as="h3"
                  variant="h3"
                  font="condensed"
                  color="primary"
                  className={classes.descTitle}
                >
                  {__("Product description")}
                </Typo>
                <div>
                  <Typo
                    as="p"
                    variant="px"
                    font="regular"
                    color="primary"
                    className={classes.desc}
                    dangerouslySetInnerHTML={{
                      __html: newDesc,
                    }}
                  ></Typo>
                </div>
                <div
                  ref={(el) => {
                    if (el) {
                      setReadMoreHeight(el.getBoundingClientRect().height);
                    }
                  }}
                  id="desc"
                  className={classes.hiddenDesc}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: newDesc,
                    }}
                  ></p>
                </div>
              </div>
            ) : null}
            {Object.entries(product.features).length || readMoreHeight > 240 ? (
              <Link to="readmore" smooth={true}>
                <Typo
                  as="p"
                  variant="p"
                  font="condensed"
                  color="primary"
                  className={classes.readmore}
                >
                  {__("READ MORE")}
                </Typo>
              </Link>
            ) : null}
            <div className={classes.estimateDelivery}>
              <Typo as="h3" variant="h3">{__("Estimated Delivery")}</Typo>
              <Typo variant="px" font="regular">{createDeliveryTime()}</Typo>
            </div>
          </div>
        </div>
        {Object.entries(product.features).length || readMoreHeight > 240 ? (
          <ReadMore
            id="readmore"
            product={product}
            descriptionHeight={readMoreHeight}
            currentLanguageName={currentLanguageName}
          />
        ) : null}
      </AppWrapper>
      <div className={classes.carousel}>
        <FilteredProducts isLastViewed={true} />
      </div>
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
          add={getCartToken}
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
    </div>
  );
};

export default connectSearchBox(withRouter(Productcontent));
