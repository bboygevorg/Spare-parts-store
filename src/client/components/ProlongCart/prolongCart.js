import React from "react";
import classes from "./prolongCart.css";
import Button from "components/Button";
import Radio from "components/Radio";
import { storage } from "helper/utils";
import { STORAGE_DONT_SHOW_AGAIN } from "conf/consts";
import useTranslation from 'talons/useTranslation';

const ProlongCart = (props) => {
  const { expired, onClose, extend, dontShow } = props;
  const __ = useTranslation();
  return (
    <div className={classes.modalRoot}>
      <span className={classes.busketIcon}></span>
      <span className={classes.expiresTime}>{expired}</span>
      <h3 className={classes.title}>{__("Your cart is about to expire")}</h3>
      <p className={classes.text}>
        {__("The cart will be expired in 15 mins, would you like still to keep it?")}
      </p>
      <div className={classes.modalButtons}>
        <Button
          type="bordered"
          label={__("OK")}
          classes={{ button_bordered: classes.okButton }}
          onClick={onClose}
        />
        <Button
          label={__("EXTEND")}
          classes={{ button_primary: classes.extendButton }}
          onClick={extend}
        />
      </div>
      <div className={classes.radioComponent}>
        <Radio
          elements={[{ label: __(`Don't show again`), value: true }]}
          value={dontShow}
          onChange={() => {
            storage(STORAGE_DONT_SHOW_AGAIN, true);
            onClose();
          }}
          classes={{ radioLabel: classes.radioLabel }}
        />
      </div>
    </div>
  );
};

export default ProlongCart;
