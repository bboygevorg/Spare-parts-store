import React from 'react'
import defaultClasses from './productContent.css';
import { mergeClasses } from 'helper/mergeClasses';
import { pageTitle } from 'helper/utils';

const ContentSlide = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes) 
    const { image, index, product } = props
    return (
        <div key={index} className={classes.contentSlideDiv}>
            <img
                className={classes.image} 
                src={image}
                itemProp="image"
                alt={pageTitle(product)}
            />
        </div>
    );
};

export default ContentSlide