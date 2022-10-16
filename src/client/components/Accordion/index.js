import React, { useState } from "react";
import classes from "./accordion.css";
import Arrow from "icons/Arrow";
import Typo from "ui/Typo";

const Accordion = ({ title, component, fromHeader, defaultStatus = true, hidden = "" }) => {
  const [isOpen, setIsOpen] = useState(defaultStatus);
  // title - String!
  // component - React component!
  return (
    <div className={`${fromHeader ? classes.fromHeaderAccordion : classes.Accordion} ${hidden ? classes.hidden : ""}`}>
      <div className={`${fromHeader ? classes.fromHeaderHeader : classes.Header}`} onClick={() => setIsOpen(!isOpen)}>
        <Typo as="h4" variant={fromHeader ? "px" : 'p'} font="condensed">{title}</Typo>
        <div className={isOpen ? classes.Opened : classes.Closed}>
          <Arrow />
        </div>
      </div>
      <div className={`${fromHeader ? classes.fromHeaderComponent : classes.Component}`} style={{display: isOpen ?  "block" : "none"}}>{component()}</div>
    </div>
  );
};

export default Accordion;
