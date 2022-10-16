import React from 'react'
import defaultClasses from './navigation.css'
import { mergeClasses } from 'helper/mergeClasses'
import useTranslation from 'talons/useTranslation';

const Navigation = props => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { step, setStep } = props
    const __ = useTranslation();
    return (
        <div className={classes.navigation}>
                <div className={classes.item}>
                    <div className={classes.iconWrapper}>
                        <div className={classes.textWrapper}>
                            <p className={`${classes.iconText} ${step === 'signIn' && classes.selected}`}>{__("Sign In")}</p>
                        </div>
                        <div className={`${classes.icon}  ${step === 'signIn' && classes.iconSelected}`}>
                            <span className={`${classes.userIcon} ${step==='signIn' && classes.selected}`}></span>
                        </div>
                    </div> 
                    <div className={`${classes.line} ${step === 'signIn' && classes.lineSelected}`}></div>
                </div>
                <div className={classes.item}>
                    <div className={classes.iconWrapper}  onClick={step !== 'signIn' ? () => setStep('delType'): null }>
                        <div className={classes.textWrapper}>
                           <p className={`${classes.iconText} ${step === 'delType' && classes.selected}`}>{__("Delivery type")}</p>
                        </div>
                        <div className={`${classes.icon}  ${step === 'delType' && classes.iconSelected}`}>
                            <span className={`${classes.delTypeIcon} ${step === 'delType' && classes.selected}`}></span>
                        </div>
                    </div>
                     <div className={`${classes.line} ${step === 'delType' && classes.lineSelected}`}></div>                  
                </div>
                <div className={classes.item}>
                    <div className={classes.iconWrapper} onClick={step !== 'signIn' ? () => setStep('delAddress'): null}>
                        <div className={classes.textWrapper}>
                            <p className={`${classes.iconText} ${step === 'delAddress' && classes.selected}`}>{__("Delivery address")}</p>
                        </div>
                        
                        <div className={`${classes.icon}  ${step === 'delAddress' && classes.iconSelected}`}>
                            <span className={`${classes.delAddressIcon} ${step === 'delAddress' && classes.selected}`}></span>
                        </div>
                    </div>
                     <div className={`${classes.line} ${step === 'delAddress' && classes.lineSelected}`}></div>               
                </div>
                <div className={classes.item}>
                    <div className={classes.iconWrapper} onClick={step !=='signIn' && step !== 'delAddress' && step !== 'delType' ? () => setStep('billAddress') : null}>
                        <div className={classes.textWrapper}>
                          <p className={`${classes.iconText} ${step === 'billAddress' && classes.selected}`}>{__("Billing address")}</p>
                        </div>
                        <div className={`${classes.icon}  ${step === 'billAddress' && classes.iconSelected}`}>
                            <span className={`${classes.billingIcon} ${step === 'billAddress' && classes.selected}`}></span>
                        </div>
                    </div> 
                    <div className={`${classes.line} ${step === 'billAddress' && classes.lineSelected}`}></div>                 
                </div>
                <div className={classes.item}>
                    <div className={classes.iconWrapper}>
                        <div className={classes.textWrapper}>
                           <p className={`${classes.iconText} ${step === 'payment' && classes.selected}`}>{__("Payment")}</p>
                        </div>
                        <div className={`${classes.icon}  ${step === 'payment' && classes.iconSelected}`}>
                            <span className={`${classes.paymentIcon} ${step === 'payment' && classes.selected}`}></span>
                        </div>
                    </div>  
                    <div className={`${classes.line} ${step === 'payment' || step === 'summary'  && classes.lineSelected}`}></div>                
                </div>
                <div className={`${classes.item} ${classes.lastItem}`}>
                    <div className={classes.iconWrapper} onClick={step === 'summary' ? () => setStep('summary'): null}>
                        <div className={classes.textWrapper}>
                            <p className={`${classes.iconText} ${step === 'summary' && classes.selected}`}>{__("Summary")}</p>
                        </div>
                        <div className={`${classes.icon}  ${step === 'summary' && classes.iconSelected}`}>
                            <span className={`${classes.summaryIcon} ${step === 'summary' && classes.selected}`}></span>
                        </div>
                    </div>                    
                </div>
            </div>
    )
}

export default Navigation