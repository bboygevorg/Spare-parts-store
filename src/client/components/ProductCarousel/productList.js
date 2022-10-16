import React from 'react'
import defaultClasses from './productList.css'
import { mergeClasses } from '../../../helper/mergeClasses'
import Slide from './slide'

const ProductList = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { items } = props
    return (
        <div className={classes.root}>
            {items && items.length ? items.map((product) => (
                <div key={product.product_id} className={classes.item}>
                    <Slide item={product} />
                </div>
                
            )) : null}
        </div>
    )
}

export default ProductList