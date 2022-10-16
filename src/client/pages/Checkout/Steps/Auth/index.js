import React from "react"; 
import classes from "./auth.css"
import AuthWrapper from "components/AuthWrapper";
const Auth = () => {
  return (
    <div className={classes.authWrapper}>
        <AuthWrapper isFromCheckout />
      {/* <SignIn inCheckout={true} /> */}
    </div>
  );
};

export default Auth;
