import React, { useEffect, useState } from "react";
import classes from "./summary.css";
import Typo from "ui/Typo";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "actions/checkoutNew";
import get from "lodash/get";
import { addressKeys } from "../DeliveryAddress";
import visa from "icons/visa.svg";
import mastercard from "icons/mastercard.svg";
import americanExpress from "icons/american-express-logo.svg";
import MiniCart from "components/MiniCart/index";
import { useCheckout } from "talons/Checkout/useCheckout";
import OrderSummary from "components/Checkout/orderSummary";
import { isCourierCheckout } from "pages/Checkout/courierCheckout";
import { useHistory } from "react-router-dom";
import Loading from "components/Loading";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { ESTIMATE_DELIVERY_TIME } from "api/query";
import useTranslation from 'talons/useTranslation';

const icons = {
  visa,
  mastercard,
  amex: americanExpress,
};

const Summary = ({ values, fields, setFormValues, setIsOrderPlacing }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { getEstimatedDelivery, totals, setWith3dSecure } = useCheckout();
  const deliveryAddressObj = addressKeys(get(values, "shippingAddressId", {}));

  const [deliveryTime, setDeliveryTime] = useState(0);
  const getDeliveryTIme = useAwaitQuery(ESTIMATE_DELIVERY_TIME);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [recoverCartLoading, setRecoverCartLoading] = useState(false);
  const __ = useTranslation();
	
	useEffect(() => {
		const disableZoneList = new Event('disableZoneList');
		const enableZoneList = new Event('enableZoneList');
		document.dispatchEvent(disableZoneList);
		
		return () => {
			document.dispatchEvent(enableZoneList);
		}
	}, [])
  
  useEffect(() => {
    setFormValues({ [fields]: true });
    fetchDeliveryTime()
  }, []);
  const fetchDeliveryTime = () => {
    const zipCode = get(values, "shippingAddressId.postcode", "");
    if (zipCode) {
      getDeliveryTIme({
        variables: {
          zipCode,
        },
        fetchPolicy: "no-cache",
      })
        .then((res) => {
          setDeliveryTime(res.data.estimateDeliveryTimeByAddress);
        })
        .catch(() => {
          setDeliveryTime(0);
        });
    }
  };
  useEffect(() => {}, [values.shippingAddressId]);  

  if(isCourierCheckout(history.location.pathname)) {
    return (
      <div className={classes.courierService}>
         <div
          style={{ display: placeOrderLoading || recoverCartLoading ? "block" : "none" }}
          className={classes.loadingWrapper}
        >
          {" "}
          <Loading />{" "}
        </div>
        <div className={placeOrderLoading ? classes.rootHidden : ""}>
          <Typo as="h2" variant="h2" className={classes.title}>{__("Summary")}</Typo>
          <OrderSummary
            cardValue={values.cardId}
            totals={totals}
            // hasAddressError={!!addressError}
            date={deliveryTime}
            getPlaceOrderLoading={(loading) => setPlaceOrderLoading(loading)}
            setIsOrderPlacing={setIsOrderPlacing}
            zipcode={get(values, "shippingAddressId.postcode", "")}
            estimateDay={get(values, "deliveryTime", "")}
            setFormValues={setFormValues}
            values={values}
            setRecoverCartLoading={setRecoverCartLoading}
            setWith3dSecure={setWith3dSecure}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ display: placeOrderLoading || recoverCartLoading ? "block" : "none" }}
        className={classes.loadingWrapper}
      >
        {" "}
        <Loading />{" "}
      </div>
      <div
        className={`${classes.root} ${
          placeOrderLoading ? classes.rootHidden : ""
        }`}
        id="summaryContainer"
      >
        <div className={classes.stepInfoWrapper}>
          <div className={classes.steps}>
            <Typo variant={"h2"} font="bold">
              {__("REVIEW YOUR ORDER")}
            </Typo>
            <div>
              <div className={classes.stepLeftBlock}>
                <div className={classes.stepsItem}>
                  <div className={classes.stepHeader}>
                    <Typo font="bold"> {__("Delivery type")}</Typo>
                    <Typo
                      font="bold"
                      className={classes.stepChange}
                      onClick={() => {
                        dispatch(setCurrentStep(2));
                      }}
                    >
                       {__("CHANGE")}
                    </Typo>
                  </div>
                  <Typo font="regular" className={classes.stepTitles}>
                    {__(get(values, "estimatedSizeCode.title", ""))}
                  </Typo>
                </div>
                <div className={classes.stepsItem}>
                  <div className={classes.stepHeader}>
                    <Typo font="bold"> {__("Delivery address")}</Typo>
                    <Typo
                      font="bold"
                      className={classes.stepChange}
                      onClick={() => {
                        dispatch(setCurrentStep(1));
                      }}
                    >
                       {__("CHANGE")}
                    </Typo>
                  </div>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(deliveryAddressObj, "country", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(deliveryAddressObj, "city", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(deliveryAddressObj, "region", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(deliveryAddressObj, "street", "")}
                  </Typo>
                </div>
              </div>
              <div>
                <div className={classes.stepsItem}>
                  <div className={classes.stepHeader}>
                    <Typo font="bold"> {__("Billing address")}</Typo>
                    <Typo
                      font="bold"
                      className={classes.stepChange}
                      onClick={() => {
                        dispatch(setCurrentStep(3));
                      }}
                    >
                       {__("CHANGE")}
                    </Typo>
                  </div>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(values, "billingAddressId.country", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(values, "billingAddressId.city", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(values, "billingAddressId.region", "")}
                  </Typo>
                  <Typo font="regular" className={classes.stepTitles}>
                    {get(values, "billingAddressId.street", "")}
                  </Typo>
                </div>
                <div className={classes.stepsItem}>
                  <div className={classes.stepHeader}>
                    <Typo font="bold"> {__("Payment method")}</Typo>
                    <Typo
                      font="bold"
                      className={classes.stepChange}
                      onClick={() => {
                        dispatch(setCurrentStep(4));
                      }}
                    >
                       {__("CHANGE")}
                    </Typo>
                  </div>
                  {values.payment === "stripe" ?
                    <div className={classes.cardBrand}>
                      <Typo font="regular" className={classes.stepTitles}>
                        <img
                          src={
                            icons[
                              get(values, "cardId.brand", "visa").toLowerCase()
                            ]
                          }
                          alt="card brand"
                        />
                        {get(values, "cardId.label", "")}
                      </Typo>
                    </div>
                  :
                    <Typo font="regular">{__("Invoice payment")}</Typo>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={classes.cartWrapper}>
            <div className={classes.miniCart}>
              <MiniCart
                inCheckout={true}
                date={deliveryTime}
                getEstimatedDelivery={getEstimatedDelivery}
              />
            </div>
          </div>
        </div>
        <div className={classes.orderTotals}>
          <OrderSummary
            cardValue={values.cardId}
            totals={totals}
            // hasAddressError={!!addressError}
            date={deliveryTime}
            getPlaceOrderLoading={(loading) => setPlaceOrderLoading(loading)}
            setIsOrderPlacing={setIsOrderPlacing}
            zipcode={get(values, "shippingAddressId.postcode", "")}
            estimateDay={get(values, "deliveryTime", "")}
            setFormValues={setFormValues}
            values={values}
            setRecoverCartLoading={setRecoverCartLoading}
            setWith3dSecure={setWith3dSecure}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
