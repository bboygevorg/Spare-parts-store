//children for Modal component
//props
//orderPlaced = true || false
//message = string (about fail)
import React from 'react';
import classes from './orderModal.css';
import Typo from 'ui/Typo';
import Button from 'components/Button';
import useTranslation from 'talons/useTranslation';

const OrderModal = ( props ) => {
  const { orderPlaced, message , action, shopperMessage } = props;
  const __ = useTranslation();

  if(shopperMessage) {
    return (
      <div className={classes.shopperRoot}>
        <Typo variant="p" font="light" className={classes.about}>
          {__(shopperMessage) || __("Something went wrong.")}
        </Typo>
        <Button onClick={action} label={__("OK")} classes={{button_primary: classes.okBtn}}/>
      </div>
    );
  }

  return !orderPlaced ? (
    <div className={classes.failed}>
      <Typo as="h2" variant="h2" font="condensed" className={classes.title}>
        {__("Oops!")}
      </Typo>
      <Typo variant="p" font="regular" className={classes.about}>
        {message ? __(message) : __("Something went wrong.")}
      </Typo>
      <img
        className={classes.crossIcon}
        src={require(`../../assets/icons/cross.svg`)}
      />
      <Button onClick={action} label={__("OK")} />
    </div>
  ) : (
    <div className={classes.succeed}>
      <Typo as="h2" variant="h2" font="condensed" className={classes.title}>
        {__("Congratulations!")}
      </Typo>
      <Typo variant="p" font="regular" className={classes.about}>
        {__("Your order is on the way!")}
      </Typo>
      <img
        className={classes.truckIcon}
        src={require(`../../assets/icons/truck.svg`)}
      />
      <div className={classes.btnWrapper}>
        <Button onClick={action} label={__("OK")} />
      </div>
    </div>
  );
};

export default OrderModal;