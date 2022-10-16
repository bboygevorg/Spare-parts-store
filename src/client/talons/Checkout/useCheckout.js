import { useSelector, useDispatch } from "react-redux";
import { checkoutActions } from "actions/checkout";
import { useCallback, useEffect, useState } from "react";
import { months } from "../Account/useOrders";
// import { useLazyQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { setCurrentStep } from "actions/checkoutNew";
export const useCheckout = () => {
//   const { getCustomerDefaultBilling } = props;
  const [with3dSecure, setWith3dSecure] = useState(false);
  const checkout = useSelector((state) => state.checkout);
  const signin = useSelector((state) => state.signin);
  const { isAuth } = signin;
  const { shipmentType, step } = checkout;
  const cartData = useSelector((state) => state.signin.cartData);
  const currentStep = useSelector((state) => state.checkoutNew.currentStep);
  // const billingAddress = useSelector((state) => state.checkoutNew.billingAddress)
  // const hasBillingAddress = billingAddress.id || null
  const dispatch = useDispatch();
  const setType = useCallback((type) =>
    dispatch(checkoutActions.setShipmentType(type))
  );
  const setStep = useCallback(
    (step) => dispatch(checkoutActions.setStep(step)),
    [checkoutActions.setStep, step]
  );
//   const [getDefaultBilling, { data: defaultBilling }] = useLazyQuery(
//     getCustomerDefaultBilling
//   );
  useEffect(() => {
    if(!with3dSecure) {
      if (!isAuth) {
        setStep("signIn");
      } else {
        setStep("delType");
      }
    }
  }, [isAuth]);

  // useEffect(() => {
  //     if(customerData.customerToken && data && data.getCustomerAddressBook.length) {
  //         setDefaultBilling({ variables: {
  //             customerToken: customerData.customerToken,
  //             addressId: data.getCustomerAddressBook[0].id
  //         }})
  //     }
  // }, [addresses])
//   useEffect(() => {
//     if (customerData) {
//       getDefaultBilling({
//         variables: { customerToken: customerData.customerToken },
//       });
//     }
//   }, [customerData]);

  const nextStep = () => {
    // if (currentStep === 1 && hasBillingAddress) {
    //   dispatch(setCurrentStep(currentStep + 2));
    // } else {
      dispatch(setCurrentStep(currentStep + 1));
    // }
    
  };

  const getEstimatedDelivery = useCallback((fDate) => {
    const dateNow = new Date();
    const month = months[dateNow.getMonth()];
    const day = dateNow.getDate();
    const year = dateNow.getFullYear();
    const now = `${month}. ${day}, ${year}`;
    const newDate = day + 7;
    dateNow.setDate(newDate);
    const newMonth = months[fDate.getMonth()];
    const newDay = fDate.getDate();
    const newYear = fDate.getFullYear();
    const futureDate = `${newMonth}. ${newDay}, ${newYear}`;
    return {
      now,
      futureDate,
    };
  });

  return {
    checkout,
    setType,
    setStep,
    deliveryType: shipmentType,
    totals: get(cartData, "totals", {}),
    getEstimatedDelivery,
    // defaultBilling: get(defaultBilling, "getCustomerDefaultBilling", {}),
    nextStep,
    with3dSecure,
    setWith3dSecure
  };
};
