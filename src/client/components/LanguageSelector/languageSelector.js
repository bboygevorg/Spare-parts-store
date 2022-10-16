import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as languageActions } from 'actions/language';
import useOnClickOutside from 'talons/useOnClickOutside';
import classes from './languageSelector.css';
import Arrow from "icons/Arrow";
import { LANGUAGES } from 'conf/consts';
import { useLocation, useHistory } from 'react-router-dom';
import { codeSplitter } from 'components/Link/link'

const LanguageSelector = () => {
    const [lang, setLang] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const currentLanguage = useSelector(state => state.language.currentLanguage);
    const searchRef = useSelector(state => state.categories.searchRefinement);
    const rootRef = useRef();
    const location = useLocation();
    const history = useHistory();
    useOnClickOutside(rootRef, () => {if(isOpen) setIsOpen(!isOpen)});

    useEffect(() => {
        if(currentLanguage) {
            const lan = LANGUAGES.find(language => language.code === currentLanguage);
            if(lan) {
                setLang(lan);
            }
        }
    }, [currentLanguage])
    const handleLanguageChange = useCallback((localeId) => {
        dispatch(languageActions.setCurrentLanguage(localeId)); 
        const length = location.pathname.length;
        const path = location.pathname[length - 1] === "/" ? location.pathname.slice(0, length - 1) : location.pathname;
        const finalUrl = path.split("/")[1] === 'search' ? `/search?query=${searchRef}` : path;
        const newPathname = localeId === "default" ? finalUrl : `${finalUrl}${codeSplitter(localeId)}`;
        if(newPathname.split("/")[1] === 'search') {
            history.push(newPathname, {
                state: {
                  isFromSearchBox: true,
                  searchRef
                },
            });      
        }
        else {
            history.push(newPathname);
        }
    }, [location, history, currentLanguage, codeSplitter, searchRef]);

    if(!currentLanguage) {
        return false;
    }
    return (
        <div
            ref={rootRef}
            className={classes.root}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={classes.mainDiv}>
                <img src={lang.icon}/>
                <span>{lang.name}</span>
                <span className={classes.arrow}>
                {" "}
                <Arrow />
            </span>
            </div>
            <div 
                className={isOpen ? classes.customOptionsOpen : classes.customOptionsHidden}
            >
                {LANGUAGES.map((language, index) => {
                    if(language.code !== lang.code) {
                    return (
                        <div className={classes.option} key={index} onClick={() => {setLang(language); handleLanguageChange(language.code)}}>
                            <img src={language.icon}/>
                            <span>{language.name}</span>
                        </div>
                    )}
                })}
            </div>
        </div>
    )
}

export default LanguageSelector;