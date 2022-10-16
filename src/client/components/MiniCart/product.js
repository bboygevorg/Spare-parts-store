import React, { useState, useEffect, useCallback } from "react";
import defaultClasses from "./product.css";
import { mergeClasses } from "helper/mergeClasses";
import QuantityInput from "components/QuantityInput";
import { useMutation } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";
import { actions } from "store/actions/signIn";
import { UPDATE_CART } from "api/mutation";
import Typo from "components/UI/Typo/index";
import Link from 'components/Link';
import useTranslation from 'talons/useTranslation';
import useCurrentLanguage from 'talons/useCurrentLanguage';
import get from 'lodash/get';
import { getDeliveryTime } from 'helper/utils';
import { createMask, VENDORS } from 'conf/consts';
import Button from 'components/Button';
import {replaceId} from "../../../helper/replaceId";
import {getPriceByZip} from "../../../helper/utils";

const Product = (props) => {
  const { product, removeItem, cartToken, customerToken, quantity: qty } = props;
  const dispatch = useDispatch();
  const __ = useTranslation();
  const { currentLanguageName } = useCurrentLanguage();
  const [quantity, setQuantity] = useState();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [updateFromInput, setUpdateFromInput] = useState(false);
  const [updateCart, { loading }] = useMutation(UPDATE_CART);
  const classes = mergeClasses(defaultClasses, props.classes);

  useEffect(() => {
    if (qty) {
      setQuantity(qty);
    }
  }, [qty]);

  useEffect(() => {
    if (shouldUpdate && quantity) {
      updateQuantity();
    }
  }, [shouldUpdate]);

  const updateQuantity = useCallback(async () => {
    const response = await updateCart({
      variables: {
        cartToken: cartToken,
        customerToken: customerToken,
        item: { itemId: product.itemId, qty: quantity },
      },
      fetchPolicy: "no-cache",
    });
    setShouldUpdate(false);
    setUpdateFromInput(false);
    dispatch(actions.addCart(response.data.updateCart));
  }, [product, quantity, cartToken, customerToken ]);

  const createDeliveryTime = () => {
    let text = '';
    if(product) {
      if(product.deliveryOption === 0) {
        text = __("Same day");
      }
      else {
        text = getDeliveryTime(product.deliveryOption);
      }
    }
    return text;
  }

  const handleSetCount = (e, value) => {
    e.preventDefault();
    setQuantity(value);
  }

  return (
    <div key={product.itemId} className={classes.product}>
      {product.deliveryOption === 0 && !product.sku.includes("service") ? 
        <img
          className={classes.positionedInstantImg}
          src={require(`../../assets/icons/instant.svg`)}
        /> 
        : null
      }
      <div className={classes.close}>
        <span
          className={classes.closeImg}
          onClick={() => removeItem(product.itemId)}
        ></span>
      </div>
      <div className={classes.productInfo}>
        <div className={classes.imageDiv}>
          <img className={classes.productImg} src={product.imageUrl} />
        </div>
        <div className={classes.about}>
          {product.sku.includes("service") ?
            <h3>{get(product, `name_${currentLanguageName}`) || product.name}</h3>
          :
            <Link to={`/product/${VENDORS[product.sku.split("_")[0]]}_${createMask(replaceId(product.sku), 1)}`}>
              <h3>{get(product, `name_${currentLanguageName}`) || product.name}</h3>
            </Link>
          }
          <div className={classes.info}>
            <div className={classes.titles}>
              {!product.sku.includes("service") ?
                <Typo as="p" variant="p">
                  {__("Estimated Delivery")}
                </Typo>
              :
                null
              }
	            {product.msku &&
		            <Typo as="p" variant="p">
			            {__("Code")}
		            </Typo>
	            }
              <Typo as="p" variant="p">
                {__("Price")}{product.sku.includes("service") ? ":" : ""}
              </Typo>
              {!product.sku.includes("service") ?
                <Typo as="p" variant="p">
                  {__("Quantity")}
                </Typo>
              :
                null
              }
            </div>
            <div className={classes.values}>
              {!product.sku.includes("service") ? <Typo className={classes.deliveryTime}>
	              <p>{createDeliveryTime()}</p>
              </Typo> : null}
	            <Typo
		            as="p"
		            variant="px"
		            font="regular"
		            color="code"
		            className={classes.code}
		            itemProp="sku"
	            >{product.msku}</Typo>
	            
              <Typo as="p" variant="p">
	              {`$${getPriceByZip(product)}`}
              </Typo>
              
              {!product.sku.includes("service") ?
                <QuantityInput
                  isFromCart={true}
                  className={defaultClasses.quantityInput}
                  value={quantity}
                  setValue={handleSetCount}
                  isSubmitting={shouldUpdate}
                  setShouldUpdate={setShouldUpdate}
                  setUpdateFromInput={setUpdateFromInput}
                  updateFromInput={updateFromInput}
                />
              :
                null
              }
              {updateFromInput &&
                <Button
                  label={__("Update quantity")}
                  onClick={() => updateQuantity()}
                  classes={{button_primary: classes.button}}
                  isSubmitting={loading}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
