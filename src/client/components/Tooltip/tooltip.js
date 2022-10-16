import React, { useState } from "react";
import defaultClasses from "./tooltip.css";
import { mergeClasses } from 'helper/mergeClasses';

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };
  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div
      className={classes.tooltipWrapper}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {props.children}
      {active && (
        <div className={`${classes.tooltipTip} ${classes.top}`}>
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;