import React, { Fragment } from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import Typo from 'ui/Typo';
import classes from './createWishList.css';
import useTranslation from 'talons/useTranslation';

const CreateWishList = (props) => {
    const { value, setValue, handleAddWishList, addLoading, fromModal, error } = props;
    const __ = useTranslation();
    return (
        <Fragment>
            <Typo as="h2" variant={fromModal ? "h3" : "h2"} className={classes.title}>
                {fromModal ? __("Create a new Wish List") : __("CREATE WISH LIST")}
            </Typo>
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={__("Enter Wish List Name")}
                classes={{ input: fromModal ? `${classes.inputComponentModal} ${error ? classes.inputError : ''}` : `${classes.inputComponent} ${error ? classes.inputError : ''}` }}
            />
            {error ? 
                <div className={fromModal ? classes.errorModal : classes.error}>
                    <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(error)}
                    </Typo>
                    {fromModal ? <img className={classes.errorIcon} src="/icons/error.svg" /> : null}
                </div>
                : 
                null
            }
            <Button
                type="bordered"
                label={fromModal ? __("CREATE WISH LIST") : __("CREATE")}
                classes={{ button_bordered: fromModal ? classes.buttonComponentModal : classes.buttonComponent }}
                onClick={handleAddWishList}
                disabled={!value}
                isSubmitting={addLoading}
            />
        </Fragment>
    );
};

export default CreateWishList;