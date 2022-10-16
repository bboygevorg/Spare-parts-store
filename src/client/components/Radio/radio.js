import React from 'react';
import { mergeClasses } from 'helper/mergeClasses';
import defaultClasses from './radio.css';

const Radio = ({elements, onChange, name, value, classes: classObj, inCheckout, inPayment, inDeliveryAddress}) => {
    const onChangeHandler = ( item) => {
        onChange(item.value);
    };
    const classes = mergeClasses(defaultClasses, classObj);
    return (
        <div>
            {
                elements.map((item, index) => {
                    return (
                        <label className={`${classes.radio} ${inCheckout && classes.inCheckoutRadio} ${inPayment && classes.inPaymentRadio}`} key={`radio_item-${item.value}-${index}`}>
                            <input name={name}
                                   value={item.value}
                                   type={"radio"}
                                   onChange={() => onChangeHandler( item)}
                                   checked={item.value === value}/>
                                   <div className={`${classes.checkmarkWrapper} 
                                                    ${inCheckout && classes.inCheckoutCheckmark} 
                                                    ${inDeliveryAddress && classes.inDeliveryCheckmark}
                                                    ${inPayment && classes.inPaymentCheckmark}
                                                    `}>
                                       <span className={classes.checkmark}></span>
                                   </div>
                            <span className={`${classes.radioLabel} ${inCheckout && classes.inCheckoutLabel}`}>{item.label}</span>
                        </label>
                    )
                })
            }

        </div>
    );
};

export default Radio;
