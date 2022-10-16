import React from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './checkBox.css';
import {mergeClasses} from 'helper/mergeClasses';


const CheckBox = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={`${classes.root} ${props.inCheckout || props.inSignUp || props.inProfile ? classes.inCheckoutRoot : ''}`}>
            <label className={`${props.isCheckout ? classes.labelForCheckout : classes.checkBox_label} ${props.inSignUp || props.inProfile ? classes.inSignUp_label : ''}`}>
                <input type="checkbox" name="color" value={props.value} onChange={props.onChange} checked={props.value}/>
                <div className={props.isCheckout ? classes.checkboxCircleForCheckout : classes.checkboxCircle}>{props.isCheckout ? <img src="images/check.png"/> : <span></span> }</div>
                <span>{props.label}</span>
            </label>
        </div>
    );
};

export default CheckBox;

CheckBox.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};
