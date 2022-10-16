import React from "react";
import classes from "./helpModal.css";
import Typo from "components/UI/Typo";
import Button from "components/Button";

const CardError = ({ action, message }) => {
    return (
      <div className={classes.root}>
        <Typo variant="h3">{message ? message : "Your card was declined"}</Typo>
        <div className={classes.btnWrapper}>
          <Button onClick={action} label="OK" />
        </div>
      </div>
    );
}

export default CardError