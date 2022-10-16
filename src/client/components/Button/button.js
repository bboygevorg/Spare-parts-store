import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './button.css';
import { mergeClasses } from 'helper/mergeClasses';
import Loading from 'components/Loading/index';

const Button = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [isChecked, setIsChecked] = useState(false)
    const { isSubmitting } = props;

    useEffect(() => {
        if(isSubmitting) {
            setTimeout(() => {
                setIsChecked(true);
            }, 400)
        }else {
            setIsChecked(false);
        }
    }, [isSubmitting, isChecked]);
    
    return (
        <button
            type={props.Type}
            className={`${classes.root}
                        ${classes[`button_${props.type ? props.type : "primary"}`]}
                        ${isSubmitting && classes.submittingBtn}
                        ${isChecked && classes.checkedBtn} ${props.disabled ? classes.disabledButton : ""}`
                    }
            onClick={props.onClick}
            disabled={props.disabled || isSubmitting}
        >
            {isChecked && <span className={classes.checkbox}></span>}
            {isSubmitting && !isChecked && <div><Loading classes={{ring: classes.loading}} /></div>}
            {!isChecked && !isSubmitting && !props.labelIcon && <span className={classes.button_label}>{props.label}</span> }
            {props.labelIcon && <span className={classes.button_labelIcon}><img src={props.labelIcon} className={classes.buttonIcon}/>{props.label}</span>}
        </button>
    );
};

export default Button;

Button.propTypes = {
  Type: PropTypes.string,
  type: PropTypes.oneOf(["primary", "bordered", "delete"]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

Button.defaultProps = {
    Type: 'button',
    type: "primary",
    label: "OK",
    disabled: false,
    isSubmitting: false
}
