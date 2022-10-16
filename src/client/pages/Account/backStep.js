import React from 'react'
import useTranslation from 'talons/useTranslation'
import { mergeClasses } from '../../../helper/mergeClasses'
import defaultClasses from './backStep.css'

const BackStep = props => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const __ = useTranslation();

    return (
        <div>
           <div className={classes.root}>
                <div className={classes.icon}>
                    <span className={classes.backIcon}></span>
                </div>
                <div className={classes.text}>
                    <span>{__("Back")}</span>
                </div>
            </div>
            <div className={classes.lineWrapper}>
                <div className={classes.line}></div>
            </div>
        </div>
        
    )
}

export default BackStep