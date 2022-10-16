import { validateRules } from "conf/consts";

export default {
  email: {
    name: "email",
    rules: [validateRules.required],
    type: "string",
    default: "",
  },
  phone: {
    name: "phone",
    rules: [validateRules.required],
    type: "string",
    default: "",
  },
};
