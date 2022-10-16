import React, { useState, useRef } from 'react';
import Call from 'icons/Call'
import Text from 'icons/Text'; 
import useFirebaseInfo from "talons/useFirebaseInfo";
import Typo from 'ui/Typo';
import classes from './textCallUs.css';
import useWindowDimensions from "talons/useWindowDimensions"; 
import useOnClickOutside from 'talons/useOnClickOutside';
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';

const TextCallUs = () => {
    const [isOpenSupport, setIsOpenSupport] = useState(false);
    const { phone, text } = useFirebaseInfo();
    const { width } = useWindowDimensions();
    const rootRef = useRef();
    const __ = useTranslation();
    const localId = useSelector(state => state.language.currentLanguage);
    useOnClickOutside(rootRef, () => {if(isOpenSupport) setIsOpenSupport(!isOpenSupport)});

    return (
        <div ref={rootRef} className={classes.textAndCall} onClick={() => setIsOpenSupport(!isOpenSupport)}>
        {isOpenSupport ?
          <div className={classes.textAndCallBox}>
            <div className={classes.top}>
              <Typo as="p" variant="p">{__("CALL OR TEXT US")}</Typo>
            </div>
            <div className={classes.bottom}>
              <div className={localId === "hy_AM" && width < 784 ? classes.fieldHy : classes.field}>
                <Call/>
                <Typo as="p" variant="p" font="regular" >
                  {__("Call us")}
                </Typo>
                <a href={`tel:${phone}`}>
                  <Typo as="p" variant="p" >{phone}</Typo>
                </a>
              </div>
              <div className={localId === "hy_AM" && width < 784 ? classes.fieldHy : classes.field}>
                <Text/>
                <Typo as="p" variant="p" font="regular" >
                  {__("Text us")}
                </Typo>
                <a href={`${width < 784 ? 'sms' : 'tel'}:${text}`}>
                  <Typo as="p" variant="p" >{text}</Typo>
                </a>
              </div>
              <div className={localId === "hy_AM" && width < 784 ? classes.fieldHy : classes.field}>
                <Text/>
                <Typo as="p" variant="p" font="regular" >
                  {__("Email")}
                </Typo>
                <a href={`mailto:sales@buildclub.com`}>
                  <Typo as="p" variant="p" >{"sales@buildclub.com"}</Typo>
                </a>
              </div>
            </div>
          </div>
          :
          null
        }
        <img className={classes.yellowIcon} src={require(`../../assets/icons/yellow.svg`)}/>
        {!isOpenSupport ? <img className={classes.girlIcon} src={require(`../../assets/icons/girl.svg`)}/> : null }
        {isOpenSupport ? <img className={classes.closeIcon} src={require(`../../assets/icons/close.svg`)}/>: null}
      </div>
    );
};

export default TextCallUs;