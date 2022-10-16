import React from 'react';
import classes from './appWrapper.css';

const AppWrapper = ( {children, className} ) => {
    return (
        <div className={`${classes.root} ${className ? className : ""}`}>{children}</div>
    )
};

export default AppWrapper;