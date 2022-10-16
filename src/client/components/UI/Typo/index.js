import React from 'react';
import classes from './typo.css';
//props
//variant = "h1"||"h2"||"h3"||"p"||"px"||"pxs"
//color = "primary"||"secondary"||"error"||"code"||"text"
//font = "condensed"||"regular"||"bold"
const Typo = ({
                children,
                as: Component = "p",
                variant = "px",
                color = "primary",
                font = 'condensed',
                className,
                ...rest
            }) => {
                return (
                    <Component
                        className={`${classes[`typo_${variant}`]} ${classes[`typo_${color}`]} ${classes[`typo_${font}`]} ${className}`}
                        {...rest}
                    >
                        {children}
                    </Component>
                );
};

export default Typo;