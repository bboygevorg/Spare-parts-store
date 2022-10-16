import React, { useState, Fragment } from "react";
import classes from "./zipcodeVerificationModal.css";
import Typo from "components/UI/Typo";
import useTranslation from 'talons/useTranslation';
import Input from 'components/Input';
import Button from 'components/Button';
import { ESTIMATE_SHIPPING } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { toNumber } from 'lodash';
import { getMessage } from 'helper/errors';
import { VALID_KEY } from 'conf/consts';
import find from 'lodash/find';

const ZipcodeVerificationModal = (props) => {
    const __ = useTranslation();
    const [zipCode, setZipCode] = useState("");
    const [data, setData] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [graphqlError, setGraphqlError] = useState("");
    const [error, setError] = useState("");
    const getEstimatedCharge = useAwaitQuery(ESTIMATE_SHIPPING);
    const resObj = data && find(data.estimateShippingByZipAndType, { carrierCode : VALID_KEY });  
    const handleChangeValue = value => {
        if(!value) {
            setError("Zipcode is a required value.");
            setZipCode(value);
        }
        else 
        if(/.*[a-zA-Z].*/.test(value)){
            setError('Type only numbers.');
            setZipCode(value);
        }
        else
        if(value.length !== 5) {
            setError('Wrong Zip Code, allowed format: XXXXX');
            setZipCode(value);
        }
        else {
            setError("")
            setZipCode(value)
        }
    };
    const handleContinue = () => {
        props.onClose();
    }
    const verifyZipCode = () => {
        setIsSubmitting(true);
        getEstimatedCharge({
            variables: {
                zipCode: toNumber(zipCode),
                shipmentType: 1
            }
        }).then(res => {
                setIsSubmitting(false)  
                setData(res.data)
                localStorage.setItem('askedforzipcode', true);
            }).catch(err => {
                setIsSubmitting(false)
                const parseError = JSON.parse(JSON.stringify(err));
                const code = parseError.graphQLErrors[0].code;
                const message = getMessage(code);
                setGraphqlError(message);
                localStorage.setItem('askedforzipcode', true);
            })
    }

    let content;
    if(!data && !graphqlError) {
        content = <Fragment>
            <Input 
                type="text"
                placeholder={__("Enter a ZIP Code to your detination")}
                classes={{input: classes.inputComponent}}
                value={zipCode}
                onChange={(e) => handleChangeValue(e.target.value)}
            />
            {error ? 
                <div className={classes.error}>
                    <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(error)}
                    </Typo>
                    <img className={classes.errorIcon} src="/icons/error.svg" />
                </div>
                : 
                null
            }
            <Button
                label={__("Verify now")}
                onClick={verifyZipCode}
                classes={{ button_primary: classes.buttonPrimary }}
                disabled={!zipCode || error}
                isSubmitting={isSubmitting}
            />
            {graphqlError && <Typo as="p" variant="p">{graphqlError}</Typo>}
            <Button
                label={__("Cancel")}
                onClick={() => { props.onClose(); localStorage.setItem('askedforzipcode', true)}}
                type="bordered"
                classes={{ button_bordered: classes.buttonBordered }}
            />
        </Fragment>
    }
    else
    if(!resObj) {
        content = <Fragment>
            <Typo className={classes.title} font="regular">{__("Unfortunately we currently don't operate in your selected location.")}</Typo>
                <Button
                    label={__("Ok")}
                    onClick={props.onClose}
                    classes={{ button_primary: classes.buttonPrimary }}
                />
        </Fragment>
        
    }
    else {
        content = <Fragment>
            <Typo className={classes.title} font="regular">{__("Good news! We have express delivery to your destination.")}</Typo>
            <Button
                    label={__("Continue shopping")}
                    onClick={handleContinue}
                    classes={{ button_primary: classes.buttonPrimary }}
                />
            </Fragment>
    }
    
    return (
        <div className={classes.root}>
            <Typo as="h3" variant="h3" font="bold" className={classes.title}>{__("Check if we deliver to your destination")}</Typo>
            {content}
        </div>
    );
};

export default ZipcodeVerificationModal;