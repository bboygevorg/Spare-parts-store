import React from "react"
import defaultClasses from "./sectionBlock.css"
import Typo from 'ui/Typo';
import { mergeClasses } from "helper/mergeClasses";
import { clsx } from "helper/utils";
import useTranslation from 'talons/useTranslation';


const SectionBlock = ({title, children, classes: propClasses}) =>{
    const classes = mergeClasses(defaultClasses, propClasses);
    const __ = useTranslation();
    return (
        <div className={clsx({root: classes.root, main: classes.main})}>
            <Typo as="h2" variant="h2" font="condensed" color="primary" className={classes.title}>
                {__(title.toUpperCase())}
            </Typo>
            <div>
                {children}
            </div>
        </div>
    )
};

export default SectionBlock;
