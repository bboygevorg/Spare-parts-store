import React from "react";
import classes from "./serviceShutDownModal.css";
import Typo from "components/UI/Typo";
import useTranslation from 'talons/useTranslation';

const ServiceShutDownModal = () => {
    const __ = useTranslation();
    return (
        <div className={classes.root}>
          <div className={classes.rootItem}>
              <Typo variant="h3" font={"regular"}>
                {__("Service Off")}
              </Typo>
          </div>
          <div className={classes.rootItem}>
              <Typo variant="p" font={"regular"}>
                {__("We are sorry, but for the moment we are fully booked today. Please try later.")}
              </Typo>
          </div>
        </div>
    );
};

export default ServiceShutDownModal;