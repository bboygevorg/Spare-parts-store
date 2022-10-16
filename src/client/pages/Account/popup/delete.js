import React from 'react';
import Typo from 'ui/Typo/index';
import Button from 'components/Button';
import classes from './delete.css';
import useTranslation from 'talons/useTranslation';

const Delete = (props) => {
    const { onClose, action, text, isSubmitting, process, title } = props;
    const __ = useTranslation();

    return (
        <div className={classes.root}>
            <Typo as="h3" variant="h3" className={classes.deleteTitle}>{__(title)}</Typo>
            <Typo as="p" variant="p" font="regular" className={classes.title}>{text}</Typo>
            <div className={classes.actions}>
                <Button 
                    label={__("Cancel")}
                    type="bordered"
                    classes={{button_bordered: classes.noButton}}
                    onClick={onClose}
                />
                <Button
                    label={__(process)}
                    classes={{button_primary: classes.yesButton}}
                    onClick={action}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}

export default Delete;