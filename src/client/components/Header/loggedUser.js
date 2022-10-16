import React from 'react';
import defaultClasses from './loggeduser.css';
import { mergeClasses } from '../../../helper/mergeClasses';
import Link from 'components/Link';
import Button from 'components/Button/index';
import useTranslation from 'talons/useTranslation';

const LoggedUser = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { setShowModal } = props;
    const __ = useTranslation();

    return (
        <div className={classes.root}>
            <Link to='/account/profile' className={classes.link}>
                {__("My profile")}
            </Link>
            <Link to='/account/orders' className={classes.link}>
                {__("My orders")}
            </Link>
            <Link to="/account/payment_methods" className={classes.link}>
                {__("Payment methods")}
            </Link>
            <div className={classes.button}>
                <Button type='bordered' label={__("SIGN OUT")} onClick={() => {setShowModal(true); window.scrollTo(0,0)}}/>
            </div>
        </div>
    );
}

export default LoggedUser;