import { checkoutAction } from "conf/actionKeys";
// import { useAwaitQuery } from "talons/useAwaitQuery";
// import { GET_CUSTOMER_DEFAULT_BILLING } from "api/query";
// import { storage } from "helper/utils";

export const startFetching = () => ({
  type: checkoutAction.CHECKOUT_START_FETCHING,
});

export const saveInfo = (payload) => ({
  type: checkoutAction.CHECKOUT_INFO_SAVE,
  payload
});

export const endFetching = () => ({
  type: checkoutAction.CHECKOUT_END_FETCHING,
});

export const setCurrentStep = (payload) => ({
  type: checkoutAction.SET_CURRENT_STEP,
  payload,
});

const setStepDetailFullfield = (payload) => ({
  type: checkoutAction.SET_STEP_DETAIL,
  payload,
});

const setCourierStepDetailFullfield = (payload) => ({
  type: checkoutAction.SET_COURIER_STEP_DETAIL,
  payload
})

export const setStepDetail = (data) => {
  return (dispatch, getState) => {
    const buffSteps = [...getState().checkoutNew.steps];
    const index = buffSteps.findIndex((el) => el.id === data.id);
    let buffstep = buffSteps.find((el) => el.id === data.id);
    buffstep = {
      ...buffstep,
      ...data,
    };
    buffSteps[index] = buffstep;
    dispatch(setStepDetailFullfield(buffSteps));
  };
};

export const setStepDetailCourier = (data) => {
  return (dispatch, getState) => {
    const buffSteps = [...getState().checkoutCourier.courierSteps];
    const index = buffSteps.findIndex((el) => el.id === data.id);
    let buffstep = buffSteps.find((el) => el.id === data.id);
    buffstep = {
      ...buffstep,
      ...data,
    };
    buffSteps[index] = buffstep;
    dispatch(setCourierStepDetailFullfield(buffSteps));
  };
};

export const setBillingAddress = (payload) => ({
  type: checkoutAction.SET_BILLING_ADDRESS,
  payload,
});

// export const getBillingAddress = () => {
//   const getDefaultBilling = useAwaitQuery(GET_CUSTOMER_DEFAULT_BILLING);
//   return (dispatch) => {
//     dispatch(startFetching());
//     getDefaultBilling({
//       variables: {
//         customerToken: storage("customerToken"),
//       },
//     })
//       .then((res) => {
//         dispatch(setBillingAddress(res));
//         dispatch(endFetching());
//       })
//       .catch(() => {
//         dispatch(setBillingAddress({}));
//         dispatch(endFetching());
//       });
//   };
// };


export const getAddressesFullfield = (payload) => ({
  type: checkoutAction.SET_ADDRESSES,
  payload
})