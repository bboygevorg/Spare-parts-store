import React from 'react';
import Switch from 'components/Switch';
import useTranslation from 'talons/useTranslation';
import defaultClasses from './instantSwitch.css';
import { mergeClasses } from 'helper/mergeClasses';
import { useDispatch, useSelector } from 'react-redux';
import { setInstantChecked } from 'actions/categories';

const InstantSwitch = (props) => {
    const __ = useTranslation();
    const classes = mergeClasses(defaultClasses, props.classes);
    const dispatch = useDispatch();
    const instantChecked = useSelector(state => state.categories.instantChecked);

    const handleToggleInstant = (value) => {
        dispatch(setInstantChecked(value));
    }

    return (
        <div className={classes.root}>
            <Switch action={handleToggleInstant} value={instantChecked} from="instant"/>
            <p className={!instantChecked ? classes.disabled : classes.enabled}>{__("Instant Delivery")}</p> 
        </div>
    );
};

export default InstantSwitch;