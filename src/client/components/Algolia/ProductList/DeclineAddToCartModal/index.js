import React from "react";
import classes from "./declineAddToCartModal.css";
import Typo from "components/UI/Typo";
import useTranslation from 'talons/useTranslation';

const DeclineAddToCartModal = (props) => {
    const { text } = props;
    const __ = useTranslation();
    return (
        <div className={classes.root}>
          <div className={classes.rootItem}>
              <Typo variant="p" font={"regular"}>
                {text === "EPA Certification" ? __(`${text} is required to purchase this product.`) : __(`${text} required to purchase this product.`)}
              </Typo>
          </div>
          <div className={classes.rootItem}>
              <Typo variant="p" font={"regular"}>
                {__("Please login and try again.")}
              </Typo>
          </div>
        </div>
    );
};

export default DeclineAddToCartModal;