import React from 'react';
import classes from './switch.css';

const Switch = (props) => {
    const { action, value, from } = props;
    return (
        <div className={classes.switchContainer}>
            <input onChange={(e) => action(e.target.checked)} id={`${classes.switchFlat} ${from}`} className={`${classes.switch} ${classes.switchFlat}`} type="checkbox" checked={value}/>
            <label htmlFor={`${classes.switchFlat} ${from}`}></label>
        </div>
    );
}

export default Switch;