import { checkoutAction } from "conf/actionKeys";

export const initial = {
  isLoading: false,
  currentStep: 0,
  steps: [
    {
      id: 0,
      icons: "",
      title: "Sign In",
      component: "Auth",
      fields: "auth",
      disabled: false,
    },
    {
      id: 1,
      icons: "",
      title: "Delivery address",
      component: "DeliveryAddress",
      fields: "shippingAddressId",
      disabled: false,
    },
    {
      id: 2,
      icons: "",
      title: "Delivery type",
      component: "DeliveryType",
      fields: "estimatedSizeCode",
      disabled: false,
    },
    {
      id: 3,
      icons: "",
      title: "Billing address",
      component: "BillingAddress",
      fields: "billingAddressId",
      disabled: false,
    },
    {
      id: 4,
      icons: "",
      title: "Payment",
      component: "Payment",
      fields: "cardId",
      disabled: false,
    },
    {
      id: 5,
      icons: "",
      title: "Summary",
      component: "Summary",
      fields:"summary",
      disabled: false,
    },
  ],
  billingAddress: {},
  addresses: [],
};

export const courierInitial = {
  isLoading: false,
  currentStep: 0,
  courierSteps: [
    {
      id: 0,
      icons: "",
      title: "Sign In",
      component: "Auth",
      fields: "auth",
      disabled: false,
    },
    {
      id: 1,
      icons: "",
      title: "Billing address",
      component: "BillingAddress",
      fields: "billingAddressId",
      disabled: false,
    },
    {
      id: 2,
      icons: "",
      title: "Payment",
      component: "Payment",
      fields: "cardId",
      disabled: false,
    },
    {
      id: 3,
      icons: "",
      title: "Summary",
      component: "Summary",
      fields:"summary",
      disabled: false,
    },
  ],
  billingAddress: {},
  addresses: [],
};

export const infoInitial = {
  deliveryTime: null,
  isShippingLoading: false,
  checked: false,
  deliveryDate: null,
  timeToShow: null,
}

export function checkoutInfo(state = infoInitial, action) {
  switch (action.type) {
    case checkoutAction.CHECKOUT_INFO_SAVE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export function checkoutNew(state = initial, action) {
  switch (action.type) {
    case checkoutAction.START_FETCHING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case checkoutAction.END_FETCHING: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case checkoutAction.SET_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.payload,
      };
    }
    case checkoutAction.SET_STEP_DETAIL: {
      return {
        ...state,
        steps: action.payload,
      };
    }

    case checkoutAction.SET_BILLING_ADDRESS: {
      return {
        ...state,
        billingAddress: action.payload,
      };
    }
    case checkoutAction.SET_ADDRESSES: {
      return {
        ...state,
        addresses: action.payload
      };
    }
    default:
      return state;
  }
}

export function checkoutCourier(state = courierInitial, action) {
  switch (action.type) {
    case checkoutAction.START_FETCHING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case checkoutAction.END_FETCHING: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case checkoutAction.SET_CURRENT_STEP: {
      return {
        ...state,
        currentStep: action.payload,
      };
    }
    case checkoutAction.SET_COURIER_STEP_DETAIL: {
      return {
        ...state,
        courierSteps: action.payload,
      };
    }

    case checkoutAction.SET_BILLING_ADDRESS: {
      return {
        ...state,
        billingAddress: action.payload,
      };
    }
    case checkoutAction.SET_ADDRESSES: {
      return {
        ...state,
        addresses: action.payload
      };
    }
    default:
      return state;
  }
}