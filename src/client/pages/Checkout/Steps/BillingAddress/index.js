import React, {useEffect, useState} from "react";
import Typo from "components/UI/Typo";
import classes from "./billingAddress.css";

// import CheckBox from "components/CheckBox";
import Button from "components/Button";
// import EditJobAddresses from "components/JobAddresses/editJobAddresses";
import {useBillingAddressStep} from "talons/Checkout/useBillingAddressStep";
import Loading from "components/Loading";
import isEmpty from "lodash/isEmpty";
import AddressForm from "components/AddressForm/index";
import useTranslation from 'talons/useTranslation';
import {useDispatch, useSelector} from "react-redux";
import {SET_CART_BILLING_INFO} from 'api/mutation';
import Attention from 'icons/attention.svg';
import {useMutation} from "@apollo/react-hooks";
import {storage} from "helper/utils";
import {getArrivalDate, isToday, getDeliveryTime as handleDeliveryTime} from 'helper/utils';
import get from "lodash/get";
import {isCourierCheckout} from "../../courierCheckout";
import { actions } from "store/actions/signIn";
import {useHistory} from "react-router";
import {
  SET_CART_SHIPPING_INFO,
  SET_DELIVERY_TIME,
  UPDATE_CART
} from "../../../../graphql/mutation";
import {useAddressStep} from "talons/Checkout/useAddressStep";
import Modal from "components/Modal";
import Radio from "components/Radio";
import {addressKeys} from "../DeliveryAddress";
import CheckBox from "components/CheckBox";
import { setCurrentStep } from "actions/checkoutNew";
import {setBillingAddress} from "../../../../store/actions/checkoutNew";
import getZoneCode from "../../../../../helper/getZoneCode";

const BillingAddress = ({title, nextStep, setFormValues, values}) => {
  const billingHook = useBillingAddressStep();
  const {
    // billingAddressInform,
    // addAddress,
    // customerToken,
    // setBillingAddress,
    fetchAddresses,
    addBillingAddress,
    getBillingAddress,
    addresses,
    isOpen,
    setIsOpen,
    toggleOpen,
    isLoading,
    billingAddress,
  } = billingHook;

  const {
    instants,
    others,
    maxDelivery
  } = useAddressStep();

  const __ = useTranslation();
  const dispatch = useDispatch();
  const selectBillingAddress = useSelector(
    (state) => state.checkoutNew.billingAddress
  );
  const checkoutInfo = useSelector(state => state.checkoutInfo);
  const cartData = useSelector(state => state.signin.cartData)
  const customerData = useSelector(state => state.signin.customerData);
  const [setCartShippingInfo] = useMutation(SET_CART_SHIPPING_INFO);
  const [setOrderDeliveryTime] = useMutation(SET_DELIVERY_TIME);
  const [updateCart] = useMutation(UPDATE_CART);
  const history = useHistory();
  const [setCartBillingInfo] = useMutation(SET_CART_BILLING_INFO);
  const cartToken = useSelector((state) => state.signin.cartToken);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [changeBillingAddress, setChangeBillingAddress] = useState(null);
  //
  // useEffect(() => {
  //     console.log(billingAddress);
  //     if (!isEmpty(addresses)) {
  //         setFormValues({ billingAddressId: addresses.find((el) => el.defaultBilling) });
  //     }
  // }, [addresses]);

  useEffect(() => {
    if (!isEmpty(billingAddress)) {
      setFormValues({billingAddressId: billingAddress});
      setChangeBillingAddress(selectBillingAddress)
      // nextStep();
    }
  }, [billingAddress, addresses]);

  const handleOrderDeliveryTime = () => {
    setOrderDeliveryTime({
      variables: {
        cartToken,
        customerToken: storage("customerToken"),
        deliveryTime: checkoutInfo.deliveryTime
      }
    })
  }

  const renderAddresses = () => {
    const elems = addresses.map((el) => {
      const buffEl = addressKeys(el);
      return {
        ...el,
        value: el.id,
        label: `${`${buffEl.street}, ${buffEl.city}, ${buffEl.region}, ${buffEl.country}, ${buffEl.postcode}`}`,
      };
    });
    return (
      <Radio
        elements={elems}
        inDeliveryAddress={true}
        inCheckout={true}
        value={isOpen ? null : get(changeBillingAddress, "id", {})}
        name={"stores"}
        onChange={(val) => {
          const address = elems.find((el) => el.id === val);
          setChangeBillingAddress(address)
          if (isOpen) {
            setIsOpen(false)
          }
        }}
      />
    );
  };

  const setShippingInfo = () => {
    setIsShippingLoading(true);
    setCartShippingInfo({
      variables: {
        customerToken: storage("customerToken"),
        cartToken,
        shippingInfo: {
          billingAddressId: get(changeBillingAddress, ["id"]) ?
            get(changeBillingAddress, ["id"]):
            get(values, ["billingAddressId", "id"], ""),
          shippingAddressId: get(values, ["shippingAddressId", "id"], ""),
          estimatedSizeCode: get(values, ["estimatedSizeCode", "code"], ""),
        },
				zoneCode: getZoneCode()
      },
    })
      .then(() => {
        if (values.shippingAddressId && values.shippingAddressId.postcode) {
          if (checkoutInfo.deliveryTime && (!others.length && !checkoutInfo.checked)) {
            const estimateDay = `${isToday(checkoutInfo.deliveryDate) ? __('Today') : getArrivalDate(checkoutInfo.deliveryDate)}${checkoutInfo.timeToShow ? `, ${checkoutInfo.timeToShow}` : ''}`;
            setFormValues({
              deliveryTime: estimateDay,
              timeToSend: checkoutInfo.deliveryTime
            });
            handleOrderDeliveryTime()
          } else if ((instants.length && others.length && !checkoutInfo.checked) || !instants.length) {
            const deliveryDays = handleDeliveryTime(maxDelivery);
            setFormValues({
              deliveryTime: deliveryDays
            });
          } else if (checkoutInfo.checked) {
            const estimateDayForInstants = `${isToday(checkoutInfo.deliveryDate) ? __('Today') : getArrivalDate(checkoutInfo.deliveryDate)}${checkoutInfo.timeToShow ? `, ${checkoutInfo.timeToShow}` : ''}`;
            const deliveryDaysForOthers = handleDeliveryTime(maxDelivery);
            setFormValues({
              deliveryTime: {
                estimateDayForInstants,
                deliveryDaysForOthers
              },
              timeToSend: checkoutInfo.deliveryTime
            });
            handleOrderDeliveryTime()
          }
        }
        setIsShippingLoading(false);
        updateCart({
          variables: {
            cartToken: cartToken,
            customerToken: customerData.customerToken,
            item: {
              itemId: cartData && cartData.items && cartData.items[0] && cartData.items[0].itemId,
              qty: cartData && cartData.items && cartData.items[0] && cartData.items[0].qty
            }
          }
        });
        nextStep();
      })
      .catch((err) => {
        setIsShippingLoading(false);
        const parseError = JSON.parse(JSON.stringify(err));
        const code = parseError.graphQLErrors[0].code;
        setFormValues({
          billingAddressId: "",
        });
        if (code === 70) {
          setError("Address validation failed. Please make sure that zip code and state in delivery address is correct.");
          setModalIsOpen(!isOpen);
          window.scrollTo(0, 0);
        } else if (code === 31) {
	        dispatch(actions.clearCart());
          window.scrollTo(0, 0);
        } else if (code === 82) {
					setError("Your selected delivery location doesn't match with selected store. Please change store or fix delivery address and try again.");
					setModalIsOpen(!isOpen);
					window.scrollTo(0, 0);
				}
      });
  };

  const setBillingAddressOnCart = async () => {
    await setCartBillingInfo({
      variables: {
        customerToken: storage("customerToken"),
        cartToken,
        billingInfo: {
          billingAddressId: get(values, ["billingAddressId", "id"], ""),
        },
      },
    });
  }

  if (isShippingLoading) {
    return (
      <div className={classes.loadingWrapper}>
        {" "}
        <Loading/>{" "}
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typo as="h2" variant="h2">
          {isChanging || isEmpty(billingAddress) ?'SELECT BILLING ADDRESS OR ADD NEW ONE' :  __(title)}
        </Typo>
      </div>
      {isLoading ? (
        <div className={classes.loadingWrapper}>
          <Loading/>
        </div>
      ) : (
          <div className={classes.addresses}>
            {!isChanging && !isEmpty(billingAddress) ? (
              <div className={classes.checkbox}>
                <CheckBox
                  label={`${billingAddress.street}, ${billingAddress.city}, ${billingAddress.region}, ${billingAddress.country}, ${billingAddress.zipCode}`}
                  value={true}
                  onChange={() => {
                  }}
                  inCheckout={true}
                />
              </div>
            ) : renderAddresses()}

            {!isChanging && !isEmpty(billingAddress) && (
              <div className={classes.addNew}>
                <div
                  className={classes.addNewContent}
                  onClick={() => {
                    getBillingAddress();
                    setIsChanging(!isChanging);
                  }}>
                  <Typo as="p" variant="p">
                    {__("CHANGE BILLING ADDRESS")}
                  </Typo>
                </div>
              </div>
            )}
          </div>
      )}
      {isOpen ? (
        <div className={classes.addNewAddress}>
          <AddressForm
            billing={true}
            onSubmit={() => {
              setIsChanging(false)
              getBillingAddress();
              fetchAddresses();
              toggleOpen();
              // window.scrollTo(0, 0);
            }}
            title="BILLING ADDRESS"
          />
          {/* <EditJobAddresses
            inCheckout={true}
            title={`ADD NEW BILLING ADDRESS`}
            request={addAddress}
            // customerToken={customerToken}
            initialValues={null}
            addresses={[]}
            // setAddresses={setBillingAddress}
            isBillingAddress={true}
            billingAddress={{}}
            setStep={() => {}}
            onAfterSubmit={() => {nextStep();}}
          /> */}
        </div>
      ) : isEmpty(billingAddress) || isChanging ? (
        <div className={classes.addNew}>
          <div className={classes.addNewContent} onClick={() => toggleOpen()}>
            <span>+</span>
            <Typo as="p" variant="p">
              {__("ADD NEW BILLING ADDRESS")}
            </Typo>
          </div>
        </div>
      ) : (
        ""
      )}
      {!isOpen && !isChanging && changeBillingAddress && (
        <div className={classes.button}>
          <Button label={__("CONFIRM")} disabled={isLoading} onClick={() => {
            dispatch(setBillingAddress(changeBillingAddress))
            if (isCourierCheckout(history.location.pathname)) {
              setBillingAddressOnCart();
              nextStep()
            } else {
							setShippingInfo()
							addBillingAddress(changeBillingAddress)
						}
          }}
          />
        </div>
      )}
      <Modal
        isShown={isModalOpen}
        onClose={() => {
          setModalIsOpen(!isModalOpen);
          setError("");
        }}
        className={classes.dialog}
      >
        <div>
            <div className={classes.errorContent}>
              <img src={Attention} />
              <Typo as="p" variant="p" color="primary" font="regular" className={classes.error}>{__(error)}</Typo>
            </div>
          <Button
            label={__("OK")}
            onClick={() => {
              dispatch(setCurrentStep(1));
              setModalIsOpen(!isModalOpen);
              setError("");
            }}
            classes={{button_primary: classes.buttonComponent}}
          />
        </div>
      </Modal>
      {isChanging && !isOpen  && (
        <div className={classes.buttons}>
          <div className={classes.buttonChange}>
            <Button
              label={__("CHANGE")}
              disabled={!changeBillingAddress}
              onClick={() => {
                if (changeBillingAddress) {
                  addBillingAddress(changeBillingAddress)
                  setIsChanging(false)
                  window.scrollTo(0, 0);
                }
              }}
            />
          </div>
          <div className={classes.buttonChange}>
            <Button
              label={__("CANCEL")}
              onClick={() => {
                setIsChanging(false);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;
