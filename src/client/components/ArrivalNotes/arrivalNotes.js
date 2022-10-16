import React, { Fragment } from 'react';
import classes from './arrivalNotes.css';
import Typo from "ui/Typo";
import Button from "components/Button";
import useTranslation from 'talons/useTranslation';
import { isCourierCheckout } from 'pages/Checkout/courierCheckout';
import { useHistory } from 'react-router';

const checkoutNotes = ["Checkout.confirmation.standard.text.1", "Checkout.confirmation.standard.text.2", "Checkout.confirmation.standard.text.3", "Checkout.confirmation.standard.text.4", "Checkout.confirmation.standard.text.5", "Checkout.confirmation.standard.text.6", "Checkout.confirmation.standard.text.7"];
const checkoutServiceNotes = ["Checkout.confirmation.service.text.1", "Checkout.confirmation.service.text.2", "Checkout.confirmation.service.text.3", "Checkout.confirmation.service.text.4", "Checkout.confirmation.service.text.5", "Checkout.confirmation.service.text.6", "Checkout.confirmation.service.text.7"];

const ArrivalNotes = ({ accept, cancel, estimateDay }) => {
    const history = useHistory();
    const __ = useTranslation();

    const handleEstimateDay = () => {
      if(typeof estimateDay === 'string') {
        return (
          <Typo as="h3" variant="h3">
            {estimateDay}
          </Typo>
        );
      }
      else {
        return (
          <Fragment>
            <Typo as="h3" variant="h3">
              {`${__("Instant delivery at")} - ${estimateDay.estimateDayForInstants}`}
            </Typo>
            <Typo as="h3" variant="h3">
              {`${__("Other delivery")} - ${estimateDay.deliveryDaysForOthers}`}
            </Typo>
          </Fragment>
        )
      }
    }
    return (
      <div className={classes.root}>
        <Typo as="h2" variant="h2" className={classes.title}>
          {__("Legal notes")}
        </Typo>
        {!isCourierCheckout(history.location.pathname) ? 
          <div className={classes.arrivalTime}>
            <Typo as="h3" variant="h3">
              {__("Estimated Arrival Time")}
            </Typo>
            {estimateDay && handleEstimateDay()}
          </div>
        : null}
        <div className={classes.text}>
          {!isCourierCheckout(history.location.pathname) ?
           checkoutNotes.map((el, idx) => (
            <Typo as="p" variant="px" font="regular" key={idx}>{__(el)}</Typo>
          ))
          :
          checkoutServiceNotes.map((el, idx) => (
            <Typo as="p" variant="px" font="regular" key={idx}>{__(el)}</Typo>
          ))
        }
        </div>
        <div className={classes.buttons}>
          <Button
            label={__("Accept")}
            classes={{ button_primary: classes.acceptButton }}
            onClick={accept}
          />
          <Button
            label={__("Cancel")}
            type="bordered"
            classes={{ button_bordered: classes.cancelButton }}
            onClick={cancel}
          />
        </div>
      </div>
    );
};

export default ArrivalNotes;    