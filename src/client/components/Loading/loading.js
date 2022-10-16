import React from 'react';
import defaultClasses from './loading.css';
import { mergeClasses } from 'helper/mergeClasses';

const Loading = ( props ) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <div className={classes.ring}><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

export default Loading;