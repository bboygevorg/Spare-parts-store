import React from 'react'
import defaultClasses from './summary.css'
import { mergeClasses } from 'helper/mergeClasses'
import ReviewOrder from './reviewOrder'
import OrderSummary from './orderSummary'
import MiniCart from 'components/MiniCart'

const Summary = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { setStep,
        deliveryAddress,
        billingAddress,
        deliveryType,
        totals,
        getEstimatedDelivery
    } = props

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <div className={classes.reviewOrder}>
                    <ReviewOrder 
                        setStep={setStep} 
                        deliveryAddress={deliveryAddress} 
                        billingAddress={billingAddress} 
                        deliveryType={deliveryType} 
                    />
                </div>
                <div className={classes.orderSummary}>
                    <OrderSummary totals={totals}/>
                </div>
            </div>
            <div className={classes.miniCart}>
                <MiniCart inCheckout = {true} getEstimatedDelivery={getEstimatedDelivery}/>
            </div>
        </div>
    )
}

export default Summary