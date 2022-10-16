import React, {useEffect, useMemo, useState} from "react";
import classes from "./deliveryAddress.css";
import Typo from "components/UI/Typo";
import {useAddressStep} from "talons/Checkout/useAddressStep";
import Radio from "components/Radio/radio";
import get from "lodash/get";
import Loading from "components/Loading";
import AddressForm from "components/AddressForm";
import Button from "components/Button";
import {useDispatch, useSelector} from "react-redux";
import {getDeliveryTime as handleDeliveryTime, isToday, storage} from "helper/utils";
import Modal from "components/Modal";
import useTranslation from 'talons/useTranslation';
import SelectDeliveryTime from 'components/SelectDeliveryTime';
import {GET_DELIVERY_TIME} from 'api/query';
import {useAwaitQuery} from 'talons/useAwaitQuery';
import CheckBox from 'components/CheckBox';
import {saveInfo} from "../../../../store/actions/checkoutNew";

export const addressKeys = (el) => ({
  country: get(el, ["country", "name"], ""),
  id: get(el, ["id"], ""),
  city: get(el, ["city"], ""),
  region: get(el, ["region", "name"], ""),
  street: get(el, ["street"], []).join(","),
  postcode: get(el, "postcode", "")
});
const DeliveryAddress = ({values, nextStep, setFormValues, fields}) => {
  const dispatch = useDispatch();
  const customerData = useSelector(state => state.signin.customerData);
  const [isShippingLoading] = useState(false);
  const getDeliveryTime = useAwaitQuery(GET_DELIVERY_TIME);
  const __ = useTranslation();
  const [showSelect, setShowSelect] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [dateData, setDateData] = useState([]);
  const [timeToShow, setTimeToShow] = useState('');
  const [range, setRange] = useState();
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const {
    addresses,
    isLoading,
    toggleOpen,
    isOpen,
    fetchAddresses,
    setIsOpen,
    instants,
    others,
    maxDelivery
  } = useAddressStep();
  useEffect(() => {
    fetchAddresses();
  }, []);
  useEffect(() => {
    if (values.shippingAddressId && values.shippingAddressId.postcode) {
      getDeliveryDates(values.shippingAddressId.postcode);
    }
  }, [values.shippingAddressId])

  useEffect(() => {
    if (range && dateData.length && !isOpen && values.shippingAddressId && values.shippingAddressId.postcode) {
      setShowSelect(true)
    } else {
      setShowSelect(false);
    }
  }, [range, dateData, isOpen, values.shippingAddressId])

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
        value={isOpen ? null : get(values, "shippingAddressId.value", {})}
        name={"stores"}
        onChange={(val) => {
          setFormValues({
            shippingAddressId: elems.find((el) => el.value === val),
          });
          if (isOpen) {
            setIsOpen(false)
          }
        }}
      />
    );
  };

  const addressTitle = useMemo(() => addresses.length > 1 ? "DELIVERY TIME & DELIVERY ADDRESSES" : addresses.length === 0 ? "" : `DELIVERY TIME & DELIVERY ADDRESS`, [addresses.length])

  const getDeliveryDates = async (zipcode) => {
    const response = await getDeliveryTime({
      variables: {
        customerToken: customerData.customerToken ? customerData.customerToken : storage("customerToken"),
        zipCode: zipcode
      },
      fetchPolicy: "no-cache",
    });
    if (response) {
      setRange(response.data.getDeliveryDatesByZipCodeByCustomerGroup.range)
      setDateData(response.data.getDeliveryDatesByZipCodeByCustomerGroup.dates)
    }
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
          {__(addressTitle)}
        </Typo>
      </div>
      {isLoading ? (
        <div className={classes.loadingWrapper}>
          <Loading/>
        </div>
      ) : (
        <div>
          <div>{renderAddresses()}</div>
          {!isOpen ? (
            <div className={classes.addNew}>
              <div
                className={classes.addNewContent}
                onClick={() => {
                  setFormValues({[fields]: undefined});
                  toggleOpen();
                }}
              >
                <span>+</span>
                <Typo as="p" variant="p">
                  {__("ADD NEW DELIVERY ADDRESS")}
                </Typo>
              </div>
            </div>
          ) : (
            <div>
              <AddressForm
                key={"delivery"}
                title="DELIVERY ADDRESS"
                onSubmit={() => {
                  toggleOpen();
                  fetchAddresses();
                  window.scrollTo(0, 0);
                }}
              />
            </div>
          )}
          {showSelect || !instants.length || instants.length && !checked && others.length ?
            <div className={classes.deliveryTimeContent}>
              <div className={classes.titleWrapper}>
                <Typo as="h2" variant="h2" className={classes.deliveryTitle}>{__("DELIVERY TIME")}</Typo>
                {others.length && maxDelivery ? <Typo as="p" variant="px"
                                                      font="bold">{`${__("Estimated delivery time for you products")} ${handleDeliveryTime(maxDelivery)}`}</Typo> : null}
              </div>
              {instants.length && others.length ?
                <div className={classes.checkToSeparate}>
                  <CheckBox
                    label={__("I want separate delivery for items with Instant delivery")}
                    value={checked}
                    onChange={() => {
                      if (showSelect) {
                        dispatch(saveInfo({checked: !checked}))
                        setChecked(!checked)
                      }
                    }}
                    isCheckout={true}
                  />
                </div>
                :
                null
              }
              {!others.length && !checked || checked ?
                <div className={checked ? classes.deliveryTimeDivChecked : classes.deliveryTimeDiv}>
                  <SelectDeliveryTime
                    date={deliveryDate}
                    setDate={(data) => {
                      setDeliveryDate(data);
                      dispatch(saveInfo({deliveryDate: data}))
                    }}
                    setTime={(time) => {
                      dispatch(saveInfo({deliveryTime: time}))
                    }}
                    items={dateData}
                    isToday={isToday}
                    timeToShow={timeToShow}
                    setTimeToShow={(timeToShow) => {
                      dispatch(saveInfo({timeToShow: timeToShow}))
                      setTimeToShow(timeToShow)
                    }}
                    range={range}
                  />
                </div>
                :
                null
              }
            </div>
            :
            null
          }
        </div>
      )}

      {values[fields] && !isOpen && (
        <div className={classes.button}>
          <Button
            label={__("CONFIRM")}
            onClick={() => {
              nextStep();
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
          <Typo as="h3" font="regular" className={classes.error}>
            {__(error)}
          </Typo>
          <Button
            label={__("OK")}
            onClick={() => {
              setModalIsOpen(!isModalOpen);
              setError("");
            }}
            classes={{button_primary: classes.buttonComponent}}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DeliveryAddress;
