import React, { useState } from 'react';
import Typo from 'ui/Typo';
import Button from 'components/Button';
import classes from './downloadApp.css';
import useTranslation from 'talons/useTranslation';

const text = {
    android: 'You can install Android application and get better shopping experience.',
    ios: 'You can install iOS application and get better shopping experience.'
};

const link = {
    android: 'https://play.google.com/store/apps/details?id=app.aimotion.buildclub',
    ios: 'https://apps.apple.com/us/app/buildclub-hardware-delivery/id1493952151'
}

const DownloadApp = () => {
    const [isOpen, setIsOpen] = useState(true);
    const __ = useTranslation();

    const checkMobileDevice = () => {  
        let isAndroid = true;
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

        //Check mobile device is Android
        if (/android/i.test(userAgent)) {
            return isAndroid; 
        }

        //Check mobile device is IOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            isAndroid = false;
            return isAndroid;
        }

         //Check device os is Windows (For Laptop and PC)
        if (navigator.appVersion.indexOf("Win") !== -1)
        {
            return isAndroid;
        }

        //Check device os is MAC (For Laptop and PC)
        if (navigator.appVersion.indexOf("Mac") !== -1)
        {
            isAndroid = false;
            return isAndroid;        
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <div className={isOpen ? classes.downloadAppPopup : classes.closedPopup}>
            <img src="/images/mobile.png"/>
            <div className={classes.popupContent}>
                <Typo as="p" variant="pxs">{__("Smart phone, smarter experience.")}</Typo>
                <Typo as="p" variant="pxs" font='regular'>{checkMobileDevice() ? __(text['android']) : __(text['ios'])}</Typo>
                <div className={classes.popupButtons}>
                    <a href={checkMobileDevice() ? link['android'] : link['ios'] } className={classes.linkButton} target="blank">
                        <Button 
                            label="DOWNLOAD"
                            type="primary"
                            classes={{root: classes.buttonRoot, button_primary: classes.popupDownloadButton, button_labelIcon: classes.buttonLabel}}
                            labelIcon={checkMobileDevice() ? '/icons/android.svg' : '/icons/apple-logo.svg'}
                        />
                    </a>
                    <Button
                        label="NOT NOW"
                        type="bordered"
                        classes={{button_bordered: classes.popupNotNowButton, button_label: classes.buttonLabel}}
                        onClick={handleClose}
                    />
                </div>
            </div>
            <img className={classes.closeIcon} src="/icons/closePopup.svg" onClick={handleClose}/>
        </div>
    );
};

export default DownloadApp;