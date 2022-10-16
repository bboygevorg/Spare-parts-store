import React, { useState, useEffect } from "react";
import classes from "./deliveryType.css";
import Button from "components/Button";
import Typo from "components/UI/Typo/index";
import get from "lodash/get";
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';
import Van from 'icons/Van';
import Track from 'icons/FedexTrack';
import { ESTIMATE_SHIPPING } from 'api/query';
import {useAwaitQuery} from "talons/useAwaitQuery";
import {toNumber} from "lodash";
import Loading from "components/Loading";

export const deliveryTypes = [
  {
    title: "Car",
    code: 1,
    icon: classes.carIcon,
    desc: "Backseat or trunk of a car",
    price: ''
  },
  {
    title: "SUV",
    code: 3,
    icon: classes.suvIcon,
    desc: "Backseat or trunk of SUV",
    price: ''
  },
  {
    title: "Pickup truck",
    code: 2,
    icon: classes.pickUpIcon,
    desc: "Pipe, large appliance, single pallet",
    price: ''
  },
  {
    title: "flatbed",
    code: 4,
    icon: classes.flatBedIcon,
    desc: "checkout_order_size_flatbed_description",
    price: ''
  },
  {
    title: "Custom",
    code: 99,
    icon: "",
    desc: "Prearranged with BuildClub",
    price: ''
  }
];

const mainText = 'Please select the type of vehicle that is most fitting to deliver your items. If your items will fit in the passenger seat or the trunk of a car, select Car. If your item is long, heavy or bulky, select truck/Van. Don\'t worry, if you get it wrong, our customer service team will contact you and offer further guidance.';
const noDeliveryText = 'Unfortunately we currently don\'t operate in your selected location. Only for prearranged deliveries choose “custom” and move forward.'

const DeliveryType = ({
  title,
  setFormValues,
  values,
  nextStep,
  fields,
}) => {
  const [type, setType] = useState(null);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const __ = useTranslation();
  const supportedCodes = useSelector(state => state.firebase.config.supported_size_codes);
  const disabledCodes = useSelector(state => state.firebase.config.disabled_size_codes);
  const getEstimatedCharge = useAwaitQuery(ESTIMATE_SHIPPING)
  const [getChargeLoader, setChargerLoader] = useState(false)
  const [TEXT, setText] = useState(mainText)

  const getEstimatedChargeHandler = async (values, type) => {
    return await getEstimatedCharge({
      variables: {
        zipCode: toNumber(values),
        shipmentType: type
      },
      fetchPolicy: "no-cache"
    });
  };

  const getPrices = (supportedTypes) => {
    if (supportedTypes.length > 0) {
      setChargerLoader(true);
      let newSupportedTypes = [...supportedTypes];
      let emptyPrice = 0
      Promise.all(newSupportedTypes.map(
        item => getEstimatedChargeHandler(get(values, "shippingAddressId.postcode", null), item.code)))
        .then((resolvedValues) => {
          resolvedValues.forEach((value, index) => {
            let getPrice = value.data.estimateShippingByZipAndType || [];
            const price = getPrice.length > 0 ? getPrice[0].price : null;
              if (price === null) {
                  newSupportedTypes[index].price = '-';
                  newSupportedTypes[index].disabled = true
              } else if(newSupportedTypes[index].title !== 'Custom'){
                  newSupportedTypes[index].price = price ? `$${price}` : 'Free Shipping';
              } else newSupportedTypes[index].price = '-';
            if (!price) {
              emptyPrice += 1;
            }
          });
          if (emptyPrice === newSupportedTypes.length) {
            setText(noDeliveryText)
          }
          setSupportedTypes(newSupportedTypes);
          setChargerLoader(false)
        });
    }
  }

  const handleVisibleTypes = () => {
    const types = [];
    JSON.parse(supportedCodes).map((el) => {
      const x =  deliveryTypes.filter(e => e.code == el)
      types.push(x[0]);
    });
    const finalTypes =  types.map(el => {
      if(disabledCodes.includes(el.code)) {
        return {
          ...el,
          disabled: true
        }
      }
      else {
        return {...el, disabled: false};
      }
    });
    getPrices(finalTypes)
  }

  useEffect(() => {
    handleVisibleTypes();
  }, [supportedCodes]);

  useEffect(() => {
    handleVisibleTypes()
  },[]);

  useEffect(() => {
    setFormValues({
      estimatedSizeCode: deliveryTypes.find((el) => el.code === type),
    });
  }, [type]);

  if (getChargeLoader) {
    return (
      <div className={classes.loadingWrapper}>
        {" "}
        <Loading />{" "}
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <h1>{__(title)}</h1>
        <Typo font="regular" as="p" variant="p">{__(TEXT)}</Typo>
      </div>
      <div className={classes.shipmentTypes}>
        {supportedTypes.map((el) => (
          <div
            key={el.code}
            className={
              `${classes.type}
               ${type === el.code && classes.clickedType}
               ${el.disabled ? classes.commingSoonType : ""}`
            }
            onClick={() => {
              if (el.disabled) {
                return false;
              }
              setType(el.code);
            }}
          >
            <div className={`${classes.cardTypeHeader}`}>
              <p className={`${classes.image_title} ${el.disabled && classes.image_title_cs}`}>{__(el.title)}</p>
              <p className={`${classes.image_title} ${el.disabled && classes.image_title_cs}`}>{el.price}</p>
            </div>
            <div className={classes.text}>
              <Typo variant={"pxs"} font="condensed" className={`${classes.desc} ${el.disabled && classes.commingSoonText}`}>
                {type === el.code ? __(el.desc) : ''}
              </Typo>
            </div>
            {el.title === "Custom" ?
              <span>
                  <Track className={type === el.code ? classes.clickedCustom : classes.customIcon} clicked={type === el.code}/>
                </span>
              :
              el.title === "Pickup truck"
                ?
                <Van className={`${type === el.code ? classes.clickedCustom : classes.customIcon} ${el.disabled && classes.commingSoonText}`} clicked={type === el.code}/>
                :
                <span className={`${classes.icon} ${el.icon}`}></span>
            }
          </div>
        ))}
      </div>
      {values[fields] && (
        <div className={classes.button}>
          <Button
            label={__("CONFIRM")}
            onClick={() => {
              nextStep();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryType;
