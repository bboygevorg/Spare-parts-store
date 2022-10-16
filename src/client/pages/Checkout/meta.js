// import { validateRules } from "config/consts";

export default {
  auth: {
    name: "estimatedSizeCode",
    rules: [],
    type: "boolean",
    default: "",
  },
  estimatedSizeCode: {
    name: "estimatedSizeCode",
    rules: [],
    type: "object",
    default: "",
  },
  shippingAddressId: {
    name: "shippingAddressId",
    rules: [],
    type: "object",
    default: "",
  },
  billingAddressId: {
    name: "billingAddressId",
    rules: [],
    type: "object",
    default: "",
  },
  cardId: {
    name: "cardId",
    rules: [],
    type: "object",
    default: "",
  },
  summary: {
    name: "",
    type: "boolean",
  },
  deliveryTime: {
    name: "deliveryTime",
    type: "object"
  },
  timeToSend: {
    name: "timeToSend",
    type: "string"
  },
  courierData: {
    name: "courierData",
    type: "string"
  },
  type: {
    name: "type",
    type: "object"
  },
  payment: {
    name: "payment",
    type: "string"
  }
};
