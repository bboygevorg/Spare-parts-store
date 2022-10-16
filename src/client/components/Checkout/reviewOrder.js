import React from 'react'
import defaultClasses from './reviewOrder.css'
import { mergeClasses } from 'helper/mergeClasses'

const ReviewOrder = (props) => {
    const {
        setStep,
        deliveryAddress,
        billingAddress,
        deliveryType
    } = props
    const classes = mergeClasses(defaultClasses, props.classes)
    
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>Review Your Order</h1>
            <div className={classes.body}>
                <div className={classes.left}>
                    <div className={classes.titleWrapper}>
                        <h3>Delivery type</h3>
                        <span className={classes.changeBtn} onClick={() => setStep("delType")}>Change</span>
                    </div>
                    <span className={classes.text}>{deliveryType}</span>
                    <div className={classes.titleWrapper}>
                        <h3>Delivery Address</h3>
                        <span className={classes.changeBtn}  onClick={() => setStep("delAddress")}>Change</span>
                    </div>
                    {deliveryAddress.city && <span className={classes.text}>{deliveryAddress.city}</span>}
                    {deliveryAddress.street && 
                        <div className={classes.streetWrapper}>
                            {deliveryAddress.street.map((e, i)=> (
                                <span key={i} className={classes.text}>{e}</span>
                            ))}
                        </div>  
                    }
                    {deliveryAddress.firstname && <span className={classes.text}>{deliveryAddress.firstname}</span>}
                    {deliveryAddress.lastname && <span className={classes.text}>{deliveryAddress.lastname}</span>}
                </div>
                <div className={classes.right}>
                    <div className={classes.titleWrapper}>
                        <h3>Billing Address</h3>
                        <span className={classes.changeBtn} onClick={() => setStep("billAddress")}>Change</span>
                    </div>
                    {billingAddress.city && <span className={classes.text}>{billingAddress.city}</span>}
                    {
                        billingAddress.street && 
                            <div className={classes.streetWrapper}>
                                {billingAddress.street.map((e, i)=> (
                                    <span key={i} className={classes.text}>{e}</span>
                                ))}
                            </div>
                    }
                    {billingAddress.firstname && <span className={classes.text}>{billingAddress.firstname}</span>}
                    {billingAddress.lastname && <span className={classes.text}>{billingAddress.lastname}</span>}
                    <div className={classes.titleWrapper}>
                        <h3>Payment Method</h3>
                        <span className={classes.changeBtn}>Change</span>
                    </div>
                    <div className={classes.iconWrapper}>
                        <span>Icon</span>
                        <span>Master Card</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewOrder