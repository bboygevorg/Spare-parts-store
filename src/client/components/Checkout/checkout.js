import React from 'react'
import defaultClasses from './checkout.css'
import { mergeClasses } from 'helper/mergeClasses'
import Navigation from './navigation'
import SignIn from 'components/SignIn/index'
import DeliveryType from './deliveryType'
import JobAddresses from '../JobAddresses/jobAddresses'
import { useCheckout } from 'talons/Checkout/useCheckout'
import Summary from './summary'
import { GET_CUSTOMER_ADDRESS, GET_CUSTOMER_DEFAULT_BILLING  } from 'api/query';
import { SET_CUSTOMER_DEFAULT_BILLING } from 'api/mutation';

const Checkout = props => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const talonProps = useCheckout({ 
        getCustomerAddressBook: GET_CUSTOMER_ADDRESS,
        setCustomerDefaultBilling: SET_CUSTOMER_DEFAULT_BILLING,
        getCustomerDefaultBilling: GET_CUSTOMER_DEFAULT_BILLING
     })
    const { checkout,
            setType,
            setStep,
            setDeliveryAddressId,
            setBillingAddressId,
            deliveryAddress,
            billingAddress,
            deliveryType,
            totals,
            getEstimatedDelivery
         } = talonProps
    const { step, shipmentType } = checkout
    let content;
    switch(step) {
        case "signIn":
            content = <SignIn inCheckout={true}/>;
            break
        case "delType":
            content = <DeliveryType type = {shipmentType} setType={setType} setStep={setStep}/>;
            break;
        case "delAddress":
            content = <div className={classes.address}>
                        <JobAddresses 
                            inCheckout={true}
                            setStep={setStep}
                            inCheckoutAddress={deliveryAddress}
                            step="billAddress"
                            setAddressId={setDeliveryAddressId}
                        />
                    </div>
            break;
        case "billAddress":
            content = <div className={classes.address}>
                        <JobAddresses
                            inCheckout={true}
                            setStep={setStep}
                            inCheckoutAddress={billingAddress}
                            step="summary"
                            setAddressId={setBillingAddressId}
                        />
                    </div> 
            break;
        case "summary":
            content = <Summary 
                        setStep={setStep}
                        deliveryAddress={deliveryAddress}
                        billingAddress={billingAddress}
                        deliveryType={deliveryType}
                        totals={totals}
                        getEstimatedDelivery={getEstimatedDelivery}
                    />
            break;
        default: content = <SignIn/> 
    }
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Navigation step={step} setStep={setStep}/>
            </div>
            <div className={classes.body}>
                {content}
            </div>
        </div>
    )
}

export default Checkout