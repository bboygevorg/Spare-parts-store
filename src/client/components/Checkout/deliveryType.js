import React from 'react'
import defaultClasses from './deliveryType.css'
import { mergeClasses } from 'helper/mergeClasses'
import Button from 'components/Button'
import useTranslation from 'talons/useTranslation';

const DeliveryType = props => {
    const { type, setType, setStep } = props
    const classes = mergeClasses(defaultClasses, props.classes)
    const __ = useTranslation();
    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <h1>{__("DELIVERY TYPE")}</h1>
            </div>
            <div className={classes.shipmentTypes}>
                    <div className={`${classes.type} ${type === "Car seat" && classes.clickedType}`} onClick={() => setType("Car seat")}>
                        <p className={classes.image_title}>{__("Car")}</p>
                        <span className={classes.carIcon}></span>
                    </div>
                    <div className={`${classes.type} ${type === "Back or SUV" && classes.clickedType}`} onClick={() => setType("Back or SUV")}>
                        <p className={classes.image_title}>{__("SUV")}</p>
                        <span className={classes.suvIcon}></span>
                    </div>
                    <div className={`${classes.type} ${type === "Pickup truck" && classes.clickedType}`} onClick={() => setType("Pickup truck")}>
                        <p className={classes.image_title}>{__("Pickup truck")}</p>
                        <span className={classes.pickUpIcon}></span>
                    </div>
                    <div className={`${classes.type} ${classes.commingSoonType}`}>
                        <p className={classes.image_title_cs}>{__("Coming soon")}</p>
                        <span className={classes.flatBedIcon}></span>
                    </div>
            </div>
            <div className={classes.button}>
                <Button label={__("CONFIRM")} onClick={() => setStep('delAddress')}/>
            </div>
        </div>
    )
}

export default DeliveryType