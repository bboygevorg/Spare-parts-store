import React, { useState } from "react";
import authComponents from "./wrapper";

const authTypes = [
  {
    value: "signin",
    component: "SignIn",
  },
  {
    value: "signup",
    component: "SignUp",
  },
];
const AuthWrapper = ({ isFromCheckout }) => {
  const [authType, setAuthType] = useState(authTypes[1].value); // should be "signin" or "signup"

  const renderComponent = () => {
    const name = authTypes.find((el) => el.value === authType).component;
    const Component = authComponents[name];

    return <Component isFromCheckout={isFromCheckout} changeType={setAuthType} />;
  };
return <div>{renderComponent()}</div>;
};

export default AuthWrapper;
