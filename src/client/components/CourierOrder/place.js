import Typo from 'ui/Typo';
import React from 'react';
import classes from './place.css';
import SearchLocationInput from 'components/JobAddresses/input';
import { capitalizeFirstLetter } from 'helper/utils';

const Place = props => {
    const { __, formik, setFromError, setToError, fromError, toError } = props;

    return (
        <div className={classes.root}>
            <Typo as="h2" variant="h2">{__("WHERE TO DELIVER?")}</Typo>
            <div className={classes.fields}>
                <div>
                    <SearchLocationInput
                        classes={
                            (formik.touched.from && formik.errors.from) || fromError
                            ? classes.errorInputComponent
                            : classes.field
                        }
                        name="from"
                        onChange={formik.setFieldValue}
                        onTouched={formik.setFieldTouched}
                        onError={formik.setFieldError}
                        value={formik.values["from"]}
                        onBlur={formik.handleBlur}
                        placeholder={capitalizeFirstLetter(__("from"))}
                        setError={setFromError}
                        onPaste={(e)=>{
                            e.preventDefault()
                            return false;
                        }}
                    />
                    {fromError ? 
                        <div className={classes.error}>
                            <Typo as="p" variant="pxs" color="error" font="regular">
                            {__(fromError)}
                            </Typo>
                            <img className={classes.errorIcon} src="/icons/error.svg" />
                        </div>
                    :
                        formik.touched.from && formik.errors.from && (
                            <div className={classes.error}>
                                <Typo as="p" variant="pxs" color="error" font="regular">
                                {__(formik.errors.from)}
                                </Typo>
                                <img className={classes.errorIcon} src="/icons/error.svg" />
                            </div>
                    )}
                </div>
                <div>
                    <SearchLocationInput
                        classes={
                            (formik.touched.to && formik.errors.to) || toError
                            ? classes.errorInputComponent
                            : classes.field
                        }
                        name="to"
                        onChange={formik.setFieldValue}
                        onTouched={formik.setFieldTouched}
                        onError={formik.setFieldError}
                        value={formik.values["to"]}
                        onBlur={formik.handleBlur}
                        placeholder={capitalizeFirstLetter(__("to"))}
                        setError={setToError}
                        onPaste={(e)=>{
                            e.preventDefault()
                            return false;
                        }}
                    />
                    {toError ? 
                        <div className={classes.error}>
                            <Typo as="p" variant="pxs" color="error" font="regular">
                            {__(toError)}
                            </Typo>
                            <img className={classes.errorIcon} src="/icons/error.svg" />
                        </div>
                    : null}
                </div>
            </div>
        </div>
    );
};

export default Place;