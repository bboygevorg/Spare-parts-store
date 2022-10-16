import React, { useState, useEffect } from 'react'
import defaultClasses from './deliveryPrice.css';
import { mergeClasses } from 'helper/mergeClasses';
import Input from 'components/Input';
import Button from 'components/Button'; 
import { toNumber } from 'lodash';
import { ESTIMATE_SHIPPING } from 'api/query';
import { getMessage } from 'helper/errors';
import { useFormik } from 'formik';
import Typo from 'ui/Typo';
import Modal from 'components/Modal';
import EstimateDeliveryTime from './estimateDeliveryTime';
import { deliveryTypes } from 'pages/Checkout/Steps/DeliveryType';
import { useHistory } from 'react-router-dom';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link'
import Custom from 'icons/Custom';
import Van from 'icons/Van';

const validate = (values) => {
    const errors = {};
    if(!values.zipCode) {
        errors.zipCode = "Zipcode is a required value."
    }
    else 
    if(/.*[a-zA-Z].*/.test(values.zipCode)){
        errors.zipCode = 'Type only numbers.';
    }
    else
    if(values.zipCode.length !==5) {
        errors.zipCode = 'Wrong Zip Code, allowed format: XXXXX';
    }
    return errors;
};


const DeliveryPrice = (props) => {
    const [type, setType] = useState(null);
    const [supportedTypes, setSupportedTypes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory()
    const [data, setData] = useState({})
    const [getChargeLoader, setChargerLoader] = useState(false)
    const getEstimatedCharge = useAwaitQuery(ESTIMATE_SHIPPING)
    const [graphqlError, setGraphqlError] = useState('');
    const __ = useTranslation();
    const localeId = useSelector(state => state.language.currentLanguage);
    const supportedCodes = useSelector(state => state.firebase.config.supported_size_codes);
    const disabledCodes = useSelector(state => state.firebase.config.disabled_size_codes);

    const formik = useFormik({
        initialValues: {
            zipCode: props.zipCode,
        },
        validate,
        onSubmit: values => { 
            if(!type) {
                return false
            }
            getEstimatedChargeHandler(values);
        }
    });

    const getEstimatedChargeHandler = (values) => { 
        setChargerLoader(true)
        getEstimatedCharge({
        variables: {
            zipCode: toNumber(values.zipCode),
            shipmentType: type
        }
        }).then(res => {
            setChargerLoader(false)  
            setData(res.data)
            setIsOpen(true);
            window.scrollTo(0,0);

        }).catch(err => {
            setChargerLoader(false)
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError.graphQLErrors[0].code;
            const message = getMessage(code);
            setGraphqlError(message);
        })
    };
    const onClose = () => {
        setIsOpen(!isOpen);
    };
    const classes = mergeClasses(defaultClasses, props.classes);
    const iconsClasses = [
        classes.carIcon, classes.pickUpIcon,classes.flatBedIcon
    ]

    const clearFields = (isShopping) => {
        formik.setFieldValue("zipCode", "");
        setType(null);
        onClose();
        
        setTimeout(() => { 
          if(localeId === "default") {
            history.replace({
                pathname: isShopping ? "/": history.location.pathname,
                state: {}
            })
          }
          else 
          if(isShopping) {
            history.replace(codeSplitter(localeId));
          }
          else {
            history.replace(`${history.location.pathname.slice(-1)}${codeSplitter(localeId)}`)
          }
        }, 100);
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
          return el;
        }
      });
      setSupportedTypes(finalTypes);
    };

    useEffect(() => {
      handleVisibleTypes();
    }, [supportedCodes]);
  
    useEffect(() => {
      handleVisibleTypes();
    },[]);
  
    return (
      <div>
        <div className={classes.root}>
          <Typo as="h2" variant="h2" className={classes.title}>
            {__("GET YOUR DELIVERY PRICE")}
          </Typo>
          <div className={classes.addressWrapper}>
            <Typo as="p" className={classes.address}>
              {__("Los Angeles County addresses only")}
            </Typo>
          </div>
          <div className={classes.zipCodeWrapper}>
            <Typo as="p" className={classes.zipCodeTitle}>
              {__("ENTER ZIP CODE FOR INSTANT DELIVERY QUOTE")}
            </Typo>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div
              className={`${classes.inputComponent} ${
                formik.touched.zipCode &&
                formik.errors.zipCode &&
                classes.inputErrComponent
              }`}
            >
              <Input
                id="zipCode"
                name="zipCode"
                value={formik.values.zipCode}
                onChange={(e) => {
                  if (e.target.value.length > 5) {
                    return false;
                  } else {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    document.activeElement.blur();
                  }
                }}
              />
            </div>
            {formik.touched.zipCode && formik.errors.zipCode && (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {__(formik.errors.zipCode)}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            )}
            <h3 className={classes.shipmentTitle}>
              {__("WHERE WILL YOUR STUFF FIT?")}
            </h3>
            <div className={classes.shipmentTypes}>
              {supportedTypes.map((el, index) => {
                if(el.code !== 99) {
                  return ( 
                    <div
                      key={index}
                      className={`${classes.type} ${
                        type === el.code ? classes.clickedType : ""
                      } ${el.disabled ? classes.disabledType : ""}`}
                      onClick={() => {
                        if (el.disabled) {
                          return false;
                        }
                        setType(el.code);
                      }}
                    >
                      <p className={`${classes.image_title} ${el.disabled && classes.image_title_cs}`}>
                        {__(el.title)}
                      </p>
                      <Typo variant={"pxs"} className={classes.customTypoDesc}>
                        {type === el.code ? __(el.desc) : ""}
                      </Typo>
                      {el.title === "Custom"
                        ?
                          <Custom className={type === el.code ? classes.clickedCustom : classes.customIcon} clicked={type === el.code}/>
                        :
                          el.title === "Pickup truck"
                        ?
                          <Van className={type === el.code ? classes.clickedCustom : classes.customIcon} clicked={type === el.code}/>
                        :
                          <span
                            className={`${iconsClasses[index]} ${
                              type === el.code ? classes.clickedElement : ""
                            }`}
                          ></span>
                      }
                    </div>
                  )
                }
              })}
            </div>
            <div className={classes.buttonLoaderDiv}>
              <Button
                label={__("GET DELIVERY PRICE")}
                disabled={!formik.values.zipCode || getChargeLoader || !type}
                isSubmitting={getChargeLoader}
                Type="submit"
              />
              {graphqlError && (
                <span className={classes.errorMessage}>{graphqlError}</span>
              )}
            </div>
          </form>
        </div>

        <Modal isShown={isOpen} onClose={onClose} className={classes.dialog}>
        
          <EstimateDeliveryTime
            data={data}
            startShopping={() => clearFields(true)}
            clearFields={() => clearFields()}
          />
        </Modal>
      </div>
    );
};

export default DeliveryPrice;
