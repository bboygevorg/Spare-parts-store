import isEmpty from 'lodash/isEmpty';
import React from 'react';
import Typo from 'ui/Typo';
import classes from './virtualProducts.css';

const VirtualProducts = props => {
    const { products, formik, __ } = props;

    return (
        <div className={classes.products}>
            <Typo as="h2" variant="h2">{__("WHERE WILL YOUR STUFF FIT?")}</Typo>
            <div className={classes.productTypes}>
                {products.map((el, index) => {
                    return (
                        <div
                            key={index}
                            className={`${classes.type}`}
                        >
                            <p className={classes.image_title}>{el.name}</p>
                            <div className={`${classes.imageWrapper} ${!isEmpty(formik.values.type) && formik.values.type.name === el.name ? classes.selected : ""}`} onClick={() => formik.setFieldValue("type", el)}>
                                <img src={el.imageUrl} className={classes.image}/>
                            </div>
                        </div>
                    )
                })}
            </div>
            {formik.errors.type && formik.touched.type ? 
                <Typo as="p" variant="pxs" color="error" font="regular" className={classes.error}>
                    {__(formik.errors.type)}
                </Typo> 
            : null}
        </div>
    );
};

export default VirtualProducts;