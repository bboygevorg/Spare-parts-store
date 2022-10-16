import React, { useCallback } from 'react';
import Button from 'components/Button';
import classes from './courierDelivery.css';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link';

const CourierDelivery = () => {
    const history = useHistory();
    const __ = useTranslation();
    const localeId = useSelector(state => state.language.currentLanguage);
  

    const handleClick = useCallback(() => {
        if(localeId === "default") {
            history.replace("/order_courier/?type=courier_service_van");
        }
        else {
            history.replace(`/order_courier/?type=courier_service_van${codeSplitter(localeId)}`);
        }
    }, [localeId]);

    return (
        <div className={classes.root}>
            <Button
                classes={{button_primary: classes.orderCourierButton}} 
                label={__("ORDER COURIER VAN")}
                onClick={handleClick}
            />
        </div>
    );
};

export default CourierDelivery;