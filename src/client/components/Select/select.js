import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import defaultClasses from "./select.css";
import { mergeClasses } from "helper/mergeClasses";
import useOnClickOutside from 'talons/useOnClickOutside';

const Select = ({
  value,
  onChange,
  onBlur,
  label,
  labelKey,
  classes: cls,
  items,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = mergeClasses(defaultClasses, cls);
  const rootRef = useRef();
  useOnClickOutside(rootRef, () => {if(isOpen) setIsOpen(!isOpen)});
  return (
    <div  className={classes.root} onClick = {() => setIsOpen(!isOpen)} onBlur = {onBlur}>
        <div className={classes.mainDiv}>{value ? value : label}</div>
        <div 
          ref={rootRef}
          className={isOpen ? classes.customOptionsOpen : classes.customOptionsHidden}
        >
           <div className={classes.option} onClick={() => onChange(name, '')}>{label}</div>
          {items.map((item, index) => (
            <div className={classes.option} key={index} onClick={() => onChange(name,item[labelKey])}>
              {item[labelKey]}
            </div>
          ))}
        </div>
    </div>
 
  );
};

export default Select;

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

Select.defaultProps = {
  labelKey: "id",
};
