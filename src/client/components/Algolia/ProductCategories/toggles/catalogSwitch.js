import React from 'react';
import Switch from 'components/Switch';
import useTranslation from 'talons/useTranslation';
import defaultClasses from './catalogSwitch.css';
import { mergeClasses } from 'helper/mergeClasses';
import { useDispatch, useSelector } from 'react-redux';
import { setCatalogChecked } from 'actions/categories';

const CatalogSwitch = (props) => {
    const __ = useTranslation();
    const classes = mergeClasses(defaultClasses, props.classes);
    const dispatch = useDispatch();
    const catalogChecked = useSelector(state => state.categories.catalogChecked)

    const handleToggleCatalog = (value) => {
      dispatch(setCatalogChecked(value));
    }

    return (
        <div className={classes.root}>
            <Switch action={handleToggleCatalog} value={catalogChecked} from="catalog"/>
            <p className={!catalogChecked ? classes.disabled : classes.enabled}>{__("Search in entire catalog")}</p> 
        </div>
    );
};

export default CatalogSwitch;