import React, { useEffect } from 'react';
import Typo from 'ui/Typo';
import classes from './notFound.css';
import useTranslation from 'talons/useTranslation';
import { actions } from 'actions/product';
import { useDispatch } from 'react-redux'
const NotFound = () => {
    const __ = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        return () => dispatch(actions.setProductData({}))
      }, []);

    return (
        <Typo as="h2" variant="h2" className={classes.title}>{__("Page not found.")}</Typo>
    )
}

export default NotFound;