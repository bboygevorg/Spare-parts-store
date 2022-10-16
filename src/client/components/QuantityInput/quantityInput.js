import React, { useState, useEffect, useRef } from 'react';
import classes from './quantityInput.css';
import PropTypes from 'prop-types'; 
import Loading from 'components/Loading/index';
import useOnClickOutside from 'talons/useOnClickOutside';

const QuantityInput = (props) => {
    const {value, setValue, isSubmitting, isFromCart, setShouldUpdate, setUpdateFromInput, updateFromInput } = props;
    const [isChecked, setIsChecked] = useState(false);
    const inputRef = useRef();
    useOnClickOutside(inputRef, (e) => {if(isFromCart && updateFromInput && e.target.tagName !== "BUTTON" && e.target.tagName !== "SPAN") {setUpdateFromInput(!updateFromInput)}});

    const increase = (e) => {
        setValue(e, +value + 1);
        if(isFromCart) {
          setUpdateFromInput(false);
          setShouldUpdate(true);
        }
    };

    const decrease = (e) => {
        if(value !== 1) {
            setValue(e, +value - 1);
            if(isFromCart) {
              setUpdateFromInput(false);
              setShouldUpdate(true);
            }
        }
    };

    useEffect(() => {
        if(isSubmitting) {
            setTimeout(() => {
                setIsChecked(true)
            }, 400)
        }else {
            setIsChecked(false)
        }
    }, [isSubmitting, isChecked])
  
    return (
      <div
        className={`${classes.root} ${props.className ? props.className : ""}`}
        onClick={(e) => e.preventDefault()}
      >
        <button className={classes.decrementBtn} onClick={(e) => decrease(e)} disabled={isSubmitting}>
          <span className={classes.quantityInput_span}>&#8722;</span>
        </button>
        <input
          ref={inputRef}
          className={classes.input}
          value={!isSubmitting && !isChecked ? value : ""}
          onChange={(e) => {
            if(e.target.value.match(/^\s*\d*\s*$/)) {
              setValue(e, e.target.value);
            }
          }}
          onFocus={() => {
            if(isFromCart) {
              setUpdateFromInput(true);
            }
          }}
          onBlur={(e) => {
            const value = +e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
            if(value) {
              setValue(e, +e.target.value);
            }
            else {
              setValue(e, 1);
            }
          }}
        />
        {isChecked && <span className={classes.checkbox}></span>}
        {isSubmitting && !isChecked && <Loading classes={{ring: classes.loading}} />}
        <button className={classes.incrementBtn} onClick={(e) => increase(e)} disabled={isSubmitting}>
          <span className={classes.quantityInput_span}>&#x2B;</span>
        </button>
      </div>
    );
};

export default QuantityInput;

QuantityInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setValue: PropTypes.func.isRequired,
};