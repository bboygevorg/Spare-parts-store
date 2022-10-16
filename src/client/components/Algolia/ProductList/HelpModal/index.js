import React from "react";
import classes from "./helpModal.css";
import Typo from "components/UI/Typo";
import Call from "icons/Call";
import Text from "icons/Text";
import useFirebaseInfo from 'talons/useFirebaseInfo';
import useTranslation from 'talons/useTranslation';
const INFO = {
  tel: "+12135134242",
  mail: "info@buildclub.com",
};

const HelpModal = () => {
  const {phone} = useFirebaseInfo();
  const __ = useTranslation();
    return (
      <div className={classes.root}>
        <Typo variant="h3">{__("Contact us")}</Typo>
        <div className={classes.rootItem}>
          <Call />{" "}
          <a href={`tel:${INFO.tel}`}>
            <Typo variant="p" font={"regular"}>
              {phone}
            </Typo>
          </a>
        </div>
        <div className={classes.rootItem}>
          <Text />{" "}
          <a href={`mailto:${INFO.mail}`}>
            <Typo variant="p" font={"regular"}>
              {INFO.mail}
            </Typo>
          </a>
        </div>
      </div>
    );
}

export default HelpModal