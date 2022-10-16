import React, { useEffect, Fragment, useMemo } from "react";
import defaultClasses from "./miniCart.css";
import { mergeClasses } from "helper/mergeClasses";
import Button from "components/Button";
import { useMiniCart } from "talons/MiniCart/useMiniCart";
import Product from "./product";
import Loading from "components/Loading";
import { GET_CART } from "api/query";
import {
  REMOVE_FROM_CART,
  APPLY_COUPON_TO_CART,
  REMOVE_COUPON,
} from "api/mutation";
import FilteredProducts from "components/FilteredProducts/index";
import Typo from "components/UI/Typo/index";
import get from "lodash/get";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "actions/checkoutNew";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useTranslation from 'talons/useTranslation';
import Modal from 'components/Modal';
import ServiceShutDownModal from 'components/Algolia/ProductList/ServiceShutDownModal';
import { codeSplitter } from 'components/Link/link';
dayjs.extend(utc);
dayjs.extend(timezone);

// const currentDate = dayjs()  
//   .tz("America/Los_Angeles")
const MiniCart = (props) => {
  const { inCheckout } = props;
  const {
    removeItem,
    removeItemLoad,
    cartData,
    customerData,
    noActiveCartError,
    isActiveCart,
    serviceOff,
    isOpenServiceoff,
    openServiceOffModal,
    closeServiceOffModal,
    instants,
    others,
    virtuals,
    message,
    setMessage
  } = useMiniCart({
    getCart: GET_CART,
    removeFromCart: REMOVE_FROM_CART,
    applyCouponCode: APPLY_COUPON_TO_CART,
    removeCouponCode: REMOVE_COUPON,
    inCheckout,
  });

  const history = useHistory();
  const dispatch = useDispatch();
  const localeId = useSelector(state => state.language.currentLanguage);
  const __ = useTranslation();
  useEffect(() => {
    let timer;
    if (inCheckout && !isEmpty(cartData) && !cartData.items.length) {
      timer = setTimeout(() => {
        dispatch(setCurrentStep(0));
        localStorage.removeItem("stepData");
        localeId === "default" ? history.replace("/") : history.replace(codeSplitter(localeId));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cartData, localeId]);

  const showLastViewed = useMemo(() => {
    if(typeof window !== "undefined") {
      const lastViewed = localStorage.getItem('lastViewed');
      const lastViewedIds = lastViewed && JSON.parse(lastViewed) || []
      return lastViewedIds.length ? true : false;
    }
  }, []);

  const classes = mergeClasses(defaultClasses, props.classes);
  return (
    <div>
      {!isActiveCart ? (
        <div className={classes.isEmptyMessage}>
          <Typo as="h1" variant="h1">
            {__(noActiveCartError)}
          </Typo>
        </div>
      ) : (!isEmpty(cartData) && cartData.items.length === 0) ||
        isEmpty(cartData) ? (
        <div className={classes.isEmptyMessage}>
          <Typo as="h1" variant="h1">
            {__("Your shopping cart is empty.")}
          </Typo>
        </div>
      ) : (
        <div className={classes.root} id="miniCart">
          <div className={classes.products}>
            <div className={classes.titleLoaderDiv}>
              {inCheckout ? (
                 ""
              ) : (
                <Typo as={"h2"} variant="h2">
                  {__("SHOPPING CART")}
                </Typo>
              )}
            </div>
            {removeItemLoad ? (
              inCheckout ? (
                <div className={classes.loaderWrapperInCheckout}>
                  {" "}
                  <Loading />{" "}
                </div>
              ) : (
                <div className={classes.loaderWrapper}>
                  <Loading />
                </div>
              )
            ) : (
              !isEmpty(cartData) &&
              <Fragment>
                {instants.length ? 
                  <Fragment>
                    <Typo as="h3" variant="h3" className={classes.productTypeTitle}>{__("INSTANT DELIVERY")}</Typo>
                      {instants.map((product) => {
                        return <Product
                          key={product.itemId}
                          product={product}
                          quantity={product.qty}
                          removeItem={removeItem}
                          cartToken={cartData.cartToken}
                          customerToken={customerData.customerToken}
                        />
                    })}
                  </Fragment>
                  :
                  null
                }
                {others.length ? 
                  <Fragment>
                    {instants.length ? <Typo as="h3" variant="h3" className={classes.productTypeTitle}>{__("OTHERS")}</Typo> : null}
                    {others.map((product) => {
                      return <Product
                        key={product.itemId}
                        product={product}
                        removeItem={removeItem}
                        cartToken={cartData.cartToken}
                        customerToken={customerData.customerToken}
                        quantity={product.qty}
                      />
                    })}
                  </Fragment>
                  :
                  null
                }
                {virtuals.length ?
                  <Fragment>
                    {virtuals.map((product) => {
                      return <Product
                        key={product.itemId}
                        product={product}
                        removeItem={removeItem}
                        cartToken={cartData.cartToken}
                        customerToken={customerData.customerToken}
                        quantity={product.qty}
                      />
                    })}
                  </Fragment>
                  :
                  null
                }
              </Fragment>
            )}
          </div>
          {!inCheckout && (
            <div className={classes.right}>
              <div className={classes.checkoutBox}>
                <div className={classes.grandTotalWrapper}>
                  <Typo as={"h3"} variant={"h3"}>
                   {__("Total")}
                  </Typo>
                  <Typo as={"h3"} variant={"h3"}>
                    {!isEmpty(cartData) && get(cartData, ["totals", "subtotal"], "") &&
                      `$${get(cartData, ["totals", "subtotal"], "").toFixed(2)}`}
                  </Typo>
                </div>
                  <div className={classes.buttonCheckout}>
                    <Button label={__("GO TO CHECKOUT")} onClick={() => { 
                      const ids = cartData.items.map(item => { return item.itemId } )
                        if (typeof window !== "undefined") {
                            if (window.fbq != null) {
                              window.fbq('track', 'Initiate Checkout', {
                                productIds: ids,
                                value: cartData.totals.subtotal,
                                currency: 'USD'
                              });
                            }
                          }
                          if(serviceOff === 'true') {
                            openServiceOffModal(true);
                            window.scrollTo(0, 0);
                            return;
                          }
                          if(virtuals.length) {
                            if(!others.length && !instants.length) {
                              if(message) {
                                setMessage("");
                              }
                              const data = JSON.parse(localStorage.getItem("courierData"));
                              const type = data.type || {};
                              delete data.type;
                              if(localeId === "default") {
                                history.replace("/courier_checkout", {
                                  state: { 
                                    data: JSON.stringify(data),
                                    type: type
                                  }
                                });
                              }
                              else {
                                history.replace(`/courier_checkout${codeSplitter(localeId)}`, {
                                  state: { 
                                    data: JSON.stringify(data),
                                    type: type
                                  }
                                });
                              }
                            }
                            else {
                              setMessage("You can’t checkout delivery service and product order at the same time. Please leave one kind of items in your shopping cart and try again.")
                            }
                          }
                          else {
                            if(message) {
                              setMessage("");
                            }
                            if(localeId === "default") {
                              history.replace("/checkout-new");
                            }
                            else {
                              history.replace(`/checkout-new${codeSplitter(localeId)}`);
                            }
                          }
                        }} />
                  </div>
                  {message ? <Typo as="p" variant="px" color="error" font="regular">{message}</Typo> : null}
              </div>
            </div>
          )}
        </div>
      )}
      {!inCheckout && showLastViewed && <FilteredProducts isLastViewed={true} />}
      <Modal
        isShown={isOpenServiceoff}
        onClose={closeServiceOffModal}
        className={classes.declineDialog}
      >
        <ServiceShutDownModal />
      </Modal>
    </div>

    // </div>
  );
};

export default MiniCart;
