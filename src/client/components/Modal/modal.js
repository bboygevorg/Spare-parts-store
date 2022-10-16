//props
//isShown = boolean for opening/closing modal
//onClose = func for isShown change
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classes from './modal.css';
import { useSelector } from 'react-redux';

const Modal = ({
    children,
    className,
    isShown,
    onClose,
    hideClose,
    ...rest
}) => {
    const isAuth = useSelector(state => state.signin.isAuth);
    useEffect(() => {
        if(typeof window !== "undefined") {
            if (isShown) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'auto'
            }
        }
    }, [isShown, isAuth])
    if(typeof window === 'undefined') {
        return false;
    }
    return ReactDOM.createPortal(
        <div>
            <div className={`${classes.modal} ${className} ${isShown && classes.modalOpen}`} {...rest}>
                {!hideClose && <span className={classes.closeIcon} onClick={onClose}></span>}
                {isShown && children}
            </div>
            {isShown && <div className={classes.backdrop} onClick={onClose}></div>}
        </div>
        , document.body);
};

export default Modal;