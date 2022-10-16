import React from 'react';
import classes from './courierOrder.css';
import { useCourierOrder } from 'talons/CourierOrder/useCourierOrder';
import PickUp from './pickUp';
import Button from 'components/Button';
import VirtualProducts from './virtualProducts';
import Place from './place';
import Date from './date';
import Typo from 'ui/Typo';
import Loading from 'components/Loading';
import isEmpty from 'lodash/isEmpty';
import CourierModal from 'components/CourierDelivery/modal/courierModal';

const CourierOrder = (props) => {
    const { selectedType } = props;

    const { 
        __, 
        formik, 
        days, 
        products, 
        isSubmitting, 
        graphqlError,
        isOpen,
        clearCartData,
        goToCart,
        setIsOpen,
        submittingClear,
        isSubmittingCourier,
        fromError,
        setFromError,
        toError,
        setToError,
        sizeError,
        setSizeError
    } = useCourierOrder({ selectedType });

    if(isSubmitting) {
        return (
            <div className={classes.loadingWrapper}>
                <Loading/>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <VirtualProducts __={__} products={products} formik={formik}/>
            <PickUp __={__} formik={formik} sizeError={sizeError} setSizeError={setSizeError}/>
            <Place __={__} formik={formik} setFromError={setFromError} setToError={setToError} fromError={fromError} toError={toError}/>
            {days.length ? <Date __={__} formik={formik} values={days}/> : null}
            {!isEmpty(formik.values.type) && formik.values.type.price ? 
                <div className={classes.deliveryPrice}>
                    <Typo as="h3" variant="h3" font="regular">{__("Delivery price:")}</Typo>
                    <Typo as="h3" variant="h3">${formik.values.type.price}</Typo>
                </div>
            : null}
            {graphqlError && (
                <Typo variant="px" color="error" font="regular">
                    {graphqlError}
                </Typo>
            )}
            <Button
                label={__("ORDER NOW")}
                classes={{button_primary: classes.orderNowBtn}}
                onClick={formik.handleSubmit}
                isSubmitting={isSubmittingCourier}
                disabled={!formik.values.type}
            />
            <CourierModal
                isShown={isOpen}
                onClose={() => setIsOpen(false)}
                goToCart={goToCart}
                clearCart={clearCartData}
                text={__("Your cart has some products. Please checkout them or clear your card before processing with ordering a courier service.")}
                clearSubmit={submittingClear}
            />
        </div>
    );
};

export default CourierOrder;