import React from 'react';
import defaultClasses from './coupon.css'
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Button from 'components/Button';
import Input from 'components/Input';
import useTranslation from 'talons/useTranslation';
import { mergeClasses } from "helper/mergeClasses";

const Coupon = (props) => {
    const { couponCode, onChange, graphqlError, applyCoupon, applyCouponLoad, removeCoupon, removeCouponLoad } = props;
    const cartData = useSelector(state => state.signin.cartData);
    const __ = useTranslation();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.useCoupon}>
            <h3>{__("Use Coupon Code")}</h3>
            {!isEmpty(cartData) &&
            get(cartData, ["totals", "couponCode"], null) === null ? (
                <div className={classes.enterCouponCode}>
                    <div className={classes.inputError}>
                        <Input
                            id="couponcode"
                            name="couponcode"
                            value={couponCode}
                            onChange={(e) => onChange(e.target.value)}
                            classes={{
                                input: graphqlError
                                ? classes.errorInputComponent
                                : classes.inputComponent,
                            }}
                            placeholder={__("Enter coupon code")}
                        />
                    </div>
                    <Button
                        type="bordered"
                        label={__("APPLY")}
                        classes={{ button_bordered: defaultClasses.buttonApply }}
                        onClick={applyCoupon}
                        disabled={applyCouponLoad}
                    />
                </div>
            ) : !isEmpty(cartData) &&
                get(cartData, ["totals", "couponCode"], null) !== null ? (
                    <div className={classes.removeCouponCode}>
                        <Button
                            label={__("REMOVE COUPON")}
                            classes={{ button_primary: defaultClasses.buttonRemove }}
                            onClick={removeCoupon}
                            disabled={removeCouponLoad}
                        />
                    </div>
            ) : null}
            {graphqlError && (
                <div className={classes.errorDiv}>
                    <span className={classes.errorMessage}>{__(graphqlError)}</span>
                    <img
                        className={classes.errorIcon}
                        src={"/icons/error.svg"}
                    />
                </div>
            )}
        </div>
    );
};

export default Coupon;