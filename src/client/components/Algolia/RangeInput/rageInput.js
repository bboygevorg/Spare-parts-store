import React from "react"
import {connectRange} from 'react-instantsearch-dom';
import Input from "components/Input";
import classes from "./rangeInput.css"

const RangeInput = ({ currentRefinement, min, max, precision, refine }) => {

  return (
    <form className={classes.root}>
      <Input
        id={"categoriesMin"}
        min={min}
        max={max}
        classes={classes.rageinput}
        placeholder="From"
        step={1 / Math.pow(10, precision)}
        value={currentRefinement.min || ""}
        onChange={(event) => {
          refine({
            ...currentRefinement,
            min: event.currentTarget.value,
          })
        }}
      />
      <span className={classes.separator}></span>
      <Input
        id={"categoriesMax"}
        min={min}
        max={max}
        placeholder="To"
        step={1 / Math.pow(10, precision)}
        classes={classes.rageinput}
        value={currentRefinement.max || ""}
        onChange={(event) => {
          refine({
            ...currentRefinement,
            max: event.currentTarget.value,
          })
        }}
      />
    </form>
  )
};

export default connectRange(RangeInput)
