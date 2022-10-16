import React from 'react';
import Modal from 'components/Modal';
import Typo from 'ui/Typo';
import Button from 'components/Button';
import classes from './courierModal.css';
import useTranslation from 'talons/useTranslation';

const CourierModal = (props) => {
    const { isShown, onClose, goToCart, clearCart, text, title, clearSubmit } = props;
    const __ = useTranslation();
    return (
        <Modal
            isShown={isShown}
            onClose={onClose}
            className={classes.dialog}
        >
            <div className={classes.root}>
                <Typo as="h3" variant="h3" className={title ? classes.titleSecond : classes.title}>{text}</Typo>
                <div className={classes.actions}>
                    <Button
                        label={__("Go to cart")}
                        classes={{button_primary: classes.yesButton}}
                        onClick={() => { goToCart(); onClose() }}
                    />
                    <Button 
                        label={__("Clear cart and proceed")}
                        type="bordered"
                        classes={{button_bordered: classes.noButton}}
                        onClick={clearCart}
                        isSubmitting={clearSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default CourierModal;