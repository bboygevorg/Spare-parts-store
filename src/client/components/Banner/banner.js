import React from 'react';
import defaultClasses from './banner.css';
import { mergeClasses } from 'helper/mergeClasses';

const Banner = ( props ) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <img src="https://images.squarespace-cdn.com/content/v1/5b9ae7a2f8370a58df90de13/1566512483721-LBOZP4SOXR2CGVFWQ11X/ke17ZwdGBToddI8pDm48kCjvJNEoBJSYSc89HaubvMtZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIA85_iADn_Gdr6lwPVO4W0y0cF9iot8wWqs_heJXiucA/Buildclub-Logo.png" />
        </div>
    );
};

export default Banner;