import React from 'react';
import Modal from 'components/Modal';
import Typo from 'ui/Typo/index';
import Button from 'components/Button';
import classes from './confirmation.css';
import useTranslation from 'talons/useTranslation';

const Confirmation = (props) => {
    const {isShown, onClose, action, text, title, isSubmitting} = props;
    const __ = useTranslation();

    const handleConfirm = () => {
        if(isSubmitting !== undefined) {
            action();
        }
        else {
            action();
            onClose();
        }
    }

    return  <Modal
                isShown={isShown}
                onClose={onClose}
                className={classes.dialog}
            >
                <div className={classes.root}>
                    <Typo as="h3" variant="h3" className={title ? classes.titleSecond : classes.title}>{text}</Typo>
                    <div className={classes.actions}>
                        <Button
                            label={__("Yes")}
                            classes={{button_primary: classes.yesButton}}
                            onClick={handleConfirm}
                            isSubmitting={isSubmitting}
                        />
                        <Button 
                            label={__("No")}
                            type="bordered"
                            classes={{button_bordered: classes.noButton}}
                            onClick={onClose}
                        />
                    </div>
                </div>
            </Modal>
};

export default Confirmation;