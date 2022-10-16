import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { courierSteps } from './Steps';
import classes from "./checkout.css";
import get from 'lodash/get';
import { setCurrentStep, setStepDetailCourier } from "actions/checkoutNew";
import icons from "icons/checkout";
import Head from 'components/Head';
import AppWrapper from 'ui/AppWrapper';
import { form } from "../../wrappers/Formik";
import meta from "./meta";
import { courierInitial } from "reducers/checkoutNew";
import useTranslation from 'talons/useTranslation';
import { useCheckout } from "talons/Checkout/useCheckout";
import { storage } from "helper/utils";
import isEmpty from 'lodash/isEmpty';
import { STORAGE_STEP_DATA_KEY } from "conf/consts";

export const isCourierCheckout = pathname => {
    return pathname.includes('courier_checkout');
}

const CourierCheckout = (props) => {
    const data = get(props, "location.state.state.data", "");
    const type = get(props, "location.state.state.type", "");
    const { values, setFormValues, changeInitialValues, errors } = props;
    const dispatch = useDispatch();
    const __ = useTranslation();
    const { nextStep, with3dSecure } = useCheckout();
    const steps = useSelector((state) => state.checkoutCourier.courierSteps);
    const currentStep = useSelector((state) => state.checkoutCourier.currentStep);
    const title = useMemo(() => courierInitial.courierSteps.find(step => step.id === currentStep), [currentStep]);
    const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
    const isAuth = useSelector((state) => state.signin.isAuth);
    const dataToSet = typeof window !== "undefined" && storage(STORAGE_STEP_DATA_KEY).toString();
    const parsed = dataToSet ? JSON.parse(dataToSet) : "";

    const getWidhts = (arr) =>
    arr
      .filter((el) => !el.hide)
      .map(
        (e) =>
          document
            .getElementById(`checkout_tab_${e.id}`)
            .getBoundingClientRect().width
      );

    useEffect(() => {
      if (currentStep >= 2) {
        const checkoutStepTab = document.getElementById("checkoutStepsTab");
        checkoutStepTab.scrollLeft = getWidhts(steps)
          .slice(0, currentStep - 2)
          .reduce((a, b) => a + b, 0);
      }
    }, [currentStep]);
  
    useEffect( () => {
      if(!with3dSecure) {
        if (isAuth && storage("customerToken")) { 
          if (isEmpty(parsed)) {
            dispatch(setCurrentStep(1));
          }
          dispatch(setStepDetailCourier({ id: 0, hide: true }));
        } else { 
          dispatch(setStepDetailCourier({ id: 0, hide: false })); 
          dispatch(setCurrentStep(0));
        }
      }
    }, [isAuth]);

    const saveSteps = () => {
        const dataToSave = {
          values,
          currentStep,
        };
        storage(STORAGE_STEP_DATA_KEY, dataToSave);
    };

    useEffect(() => {
        if (!isEmpty(parsed)) {
            changeInitialValues(parsed.values);
            dispatch(setCurrentStep(parsed.currentStep));
        }
        if(!storage("customerToken")) {
            dispatch(setCurrentStep(0));
            dispatch(setStepDetailCourier({ id: 0, hide: false }));
            storage(STORAGE_STEP_DATA_KEY, {});
            localStorage.removeItem(STORAGE_STEP_DATA_KEY); 
        }
        if(data && type) {
          setFormValues({courierData: data});
          setFormValues({type: type});
        }
        setFormValues({ payment: "stripe" });
        return () => { 
            dispatch(setCurrentStep(0)); 
            dispatch(setStepDetailCourier({ id: 0, hide: false })); 
            localStorage.removeItem(STORAGE_STEP_DATA_KEY);
        }
      }, []);
    
    useEffect(() => {
        if (currentStep !== 0 && isAuth) {
            saveSteps();
            }
        if (!get(values, ["billingAddressId", "id"])) {
            setFormValues({ summary: false });
        }
    }, [values, currentStep]);
    
    const renderContent = () => {
        const current = courierInitial.courierSteps.find((el) => el.id === currentStep);
        const Component = courierSteps[current.component];
        return (
          <div className={classes.tabContent}>
            <Component
              title={current.title}
              changeInitialValues={changeInitialValues}
              setFormValues={setFormValues}
              fields={current.fields}
              values={{ ...values }}
              errors={errors}
              nextStep={nextStep}
              setIsOrderPlacing={setPlaceOrderLoading}
            />
          </div>
        );
      };

    const renderTabs = () => {
        return (
          <div className={`${classes.stepstab} ${classes.courierStepsTab}`} id="checkoutStepsTab">
            {steps
              .filter((el) => !el.hide)
              .map((el, i) => (
                <div
                  className={classes.item}
                  key={el.id}
                  id={`checkout_tab_${el.id}`}
                >
                  <div
                    className={`${classes.stepstabItem} 
                                ${currentStep === el.id ? classes.stepActive : ""}
                                ${classes[`${el.component}Item`]}
                                ${!i && el.component !== "Auth" && classes.firstItem}
                                ${
                                  el.component == "DeliveryType" && i == 0
                                    ? classes.delTypeItem
                                    : ""
                                }
                               `}
                    onClick={() => {
                          const isEmptyNecessaryFields =
                            (el.id === 5 ||
                              el.id === 4 ||
                              el.id === 2 ||
                              el.id === 3) &&
                              !get(values, ["billingAddressId", "id"]);
    
                      if (isEmptyNecessaryFields) {
                        return false;
                      }
                      if (el.id === 5 && !get(values, ["cardId", "id"])) {
                        return false;
                      }
                      if (isAuth) {
                        dispatch(setCurrentStep(el.id));
                      }
                    }}
                  >
                    <span className={classes.stepTitle}>{__(el.title)}</span>
                    <div className={classes.stepstabItemIcon}>
                      {icons[el.component]}
                    </div>
                  </div>
                  {el.component !== "Summary" && (
                    <div
                      className={`${classes.line} ${
                        currentStep === el.id && classes.lineSelected
                      }`}
                    ></div>
                  )}
                </div>
              ))}
          </div>
        );
    };

    return (
        <div>
            <Head>
                {title.title}
            </Head>
            <div className={classes.root}>
                <AppWrapper>
                    <div className={classes.tabWrapper}>
                        {!placeOrderLoading && renderTabs()}
                    </div>
                    <div className={classes.contentWrapper}> {renderContent()}</div>
                </AppWrapper>
            </div>
        </div>
    )
}

export default form({
  fields: meta,
})(CourierCheckout);