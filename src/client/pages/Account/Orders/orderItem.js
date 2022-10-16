import React from 'react'
import defaultClasses from './orderItem.css'
import { mergeClasses } from 'helper/mergeClasses'
import useTranslation from 'talons/useTranslation';
import Link from 'components/Link';
import { VENDORS, createMask } from 'conf/consts';
import {replaceId} from "../../../../helper/replaceId";

const OrderItem = props => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { item } = props
    const __ = useTranslation();

    return (
        <div className={classes.root}>
            <div className={classes.image}>
                <Link to={`/product/${VENDORS[item.sku.split("_")[0]]}_${createMask(replaceId(item.sku), 1)}`}>
                    <img src={item.imageUrl}/>
                </Link>
            </div>
            <div className={classes.info}>
                <Link to={`/product/${VENDORS[item.sku.split("_")[0]]}_${createMask(replaceId(item.sku), 1)}`}>
                    <span>{item.name}</span>
                </Link>
                <span>$ {item.price.toFixed(2)}</span>
                <span>{__("Quantity")}: {item.qty}</span>
                <p>{__("Total")} ${item.rowTotal ? item.rowTotal.toFixed(2) : (item.qty * item.price).toFixed(2)}</p>
            </div>
        </div>
    )
}

export default OrderItem