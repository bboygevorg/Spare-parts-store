import React from "react";
import PropTypes from "prop-types";
import { mergeClasses } from "helper/mergeClasses";
import defaultClasses from "./input.css";
import { clsx } from "helper/utils";
import InputMask from "react-input-mask";
import { hasError } from "../../wrappers/hasError/index";

const phoneMask = "(+1) 999-999-9999";
const maskChar = "_";

const Input = ({
  id,
  //   name,
  type,
  classes: className,
  placeholder,
  onChange,
  onBlur,
  value,
  onKeyDown,
  disabled,
  onFocus
}) => {
  const classes = mergeClasses(defaultClasses, className);
  const commonParams = {
    type,
    value,
    onChange,
    // onFocus: this.focusHandle,
    onBlur,
    onKeyDown,
    placeholder,
    className: clsx(classes),
    disabled,
    onFocus
  };
  return type === "phone" ? (
    <InputMask mask={phoneMask} maskChar={maskChar} {...commonParams}>
      {(inputProps) => <input {...inputProps} {...commonParams} id={id} />}
    </InputMask>
  ) : (
    <input {...commonParams} id={id} />
  );
};

export default hasError(Input);

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func
};

Input.defaultProps = {
  id: "",
  name: "",
  type: "text",
  placeholder: "",
  onBlur: null,
  onKeyDown: () => {},
  onChange: () => {},
  disabled: false,
  onFocus: null
};
