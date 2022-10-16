import React, { useState, useEffect, useMemo } from "react";
import AppWrapper from "components/UI/AppWrapper/index";
import classes from "./checkout.css";

import { initial } from "reducers/checkoutNew";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentStep, setStepDetail } from "actions/checkoutNew";
import icons from "icons/checkout";

import { stepsComponent } from "./Steps";
import { form } from "../../wrappers/Formik";
import meta from "./meta";
import { useCheckout } from "talons/Checkout/useCheckout";
import { storage } from "helper/utils";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { STORAGE_STEP_DATA_KEY, STATIC_DESCRIPTION } from "conf/consts";
import Head from "components/Head";
import useTranslation from 'talons/useTranslation';

const Checkout = ({ values, setFormValues, changeInitialValues, errors }) => {
  const dispatch = useDispatch();
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const currentStep = useSelector((state) => state.checkoutNew.currentStep);
  const steps = useSelector((state) => state.checkoutNew.steps);
  const isAuth = useSelector((state) => state.signin.isAuth);
  const __ = useTranslation();
  const { nextStep } = useCheckout();
  const dataToSet = typeof window !== "undefined" && storage(STORAGE_STEP_DATA_KEY).toString();
  const parsed = dataToSet ? JSON.parse(dataToSet) : "";
  const title = useMemo(() => initial.steps.find(step => step.id === currentStep), [currentStep]);
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
  const renderTabs = () => {
    return (
      <div className={classes.stepstab} id="checkoutStepsTab">
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
                            ${
                              el.component == "DeliveryType" && i == 0
                                ? classes.delTypeItem
                                : ""
                            }
                           `}
                onClick={() => {
                  // const isFieldEmpty = !values[el.fields];  
                  // console.log(
                  //   !get(values, ["estimatedSizeCode", "code"], ""),
                  //   "element elemnt element "
                  // );
                  // const prevElement = steps.find(
                  //   (stepEl) => stepEl.id === el.id - 1
                  // )
                  // const fieldName = get(prevElement, "fields", "");
                  //   // const isEmptyNecessaryFields = el.i  
                  // const prevEmpty = get(values, fieldName, false); 
                  //   if (!prevEmpty) {
                  //     return false;
                  //   }
                      const isEmptyNecessaryFields =
                        (el.id === 5 ||
                          el.id === 4 ||
                          el.id === 2 ||
                          el.id === 3) &&
                        (!get(values, ["billingAddressId", "id"]) ||
                          !get(values, ["shippingAddressId", "id"], "") ||
                          !get(values, ["estimatedSizeCode", "code"], ""));

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
  const renderContent = () => {
    const current = initial.steps.find((el) => el.id === currentStep);
    const Component = stepsComponent[current.component];
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

  useEffect( () => {
    if (isAuth && storage("customerToken")) { 
      if (isEmpty(parsed)) {
        dispatch(setCurrentStep(1));
      }
      dispatch(setStepDetail({ id: 0, hide: true }));
    } else { 
        dispatch(setStepDetail({ id: 0, hide: false })); 
       dispatch(setCurrentStep(0));
 
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
      dispatch(setStepDetail({ id: 0, hide: false }));
      storage(STORAGE_STEP_DATA_KEY, {});
      localStorage.removeItem(STORAGE_STEP_DATA_KEY);
    }
    setFormValues({ payment: "stripe" });
    return () => { 
      dispatch(setCurrentStep(0)); 
      dispatch(setStepDetail({ id: 0, hide: false })); 
      localStorage.removeItem(STORAGE_STEP_DATA_KEY);
    }
  }, []);

  useEffect(() => {
    if (currentStep !== 0 && isAuth) {
      saveSteps();
    }

    if (
      !get(values, ["billingAddressId", "id"]) ||
      !get(values, ["shippingAddressId", "id"], "") ||
      !get(values, ["estimatedSizeCode", "code"], "")
    ) {
      setFormValues({ summary: false });
    }
  }, [values, currentStep]);

  console.log(values, "Checkout page, values");
  return (
    <div>
      <Head description={STATIC_DESCRIPTION}>
        {title.title}
      </Head>
      <div className={classes.root}>
        <AppWrapper>
          <div className={classes.tabWrapper}>{!placeOrderLoading && renderTabs()}</div>
          <div className={classes.contentWrapper}> {renderContent()}</div>
        </AppWrapper>
      </div>
    </div>
  );
};

export default form({
  fields: meta,
})(Checkout);
