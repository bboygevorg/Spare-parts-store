import React, { useCallback } from 'react';
import Button from 'components/Button';
import classes from './flatbedButton.css';
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link';
import { useHistory } from 'react-router';

const FlatbedButton = () => {
    const history = useHistory();
    const __ = useTranslation();
    const localeId = useSelector(state => state.language.currentLanguage);

    const handleClick = useCallback(() => {
        if(localeId === "default") {
            history.replace("/order_courier/?type=courier_service_flatbed");
        }
        else {
            history.replace(`/order_courier/?type=courier_service_flatbed${codeSplitter(localeId)}`);
        }
    }, [localeId]);

    return (
        <Button
            label={__("ORDER COURIER FLATBED")}
            classes={{button_primary: classes.flatbedDelivery}}
            onClick={handleClick}
        />
    );
};

export default FlatbedButton;