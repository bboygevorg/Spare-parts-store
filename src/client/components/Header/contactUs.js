import React from 'react';
import classes from './contactUs.css';
import Typo from "components/UI/Typo";
import Call from 'icons/Call'
import useTranslation from 'talons/useTranslation';

const ContactUs = (props) => {
    const { phone, isHidden } = props
    const __ = useTranslation();

    return (
        <div className={isHidden ? classes.hiddenContactUs : classes.contactUs}>
            <Typo as="p" font="regular" variant="p">{__("Call or text us!")}</Typo>
            <a href={`tel:${phone}`}>
                <div>
                    <Call />
                    <Typo as="h3" variant="h3">{phone}</Typo>
                </div>
            </a>
        </div>
    )
};

export default ContactUs;