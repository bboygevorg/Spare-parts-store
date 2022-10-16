import React from 'react';
import { useLink } from 'talons/Link/useLink';
import { Link as LinkRouter } from 'react-router-dom';


export const codeSplitter = (code) => {
    if(code === "zh_Hans_CN" || code === "zh_Hant_TW") {
        return `/?lang=${code}`;
    }
    else {
        return `/?lang=${code.split('_')[0]}`;
    }
};

const Link  = props => {
    const { currentLanguage } = useLink();
    if(currentLanguage === "default") {
        return (
            <LinkRouter { ...props } to={`${props.to.pathname ? props.to.pathname : props.to}`} />
        )
    }
    else {
        return (
            <LinkRouter { ...props } to={`${props.to.pathname ? props.to.pathname : props.to}${codeSplitter(currentLanguage)}`} />
        );
    }
}

export default Link;