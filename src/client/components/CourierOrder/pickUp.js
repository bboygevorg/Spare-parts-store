import React from 'react';
import classes from './pickUp.css';
import Typo from 'ui/Typo';
import Input from 'components/Input';
import Upload from 'components/Upload';

const PickUp = props => {
    const { __, formik, sizeError, setSizeError } = props;

    return (
        <div className={classes.root}>
            <Typo as="h2" variant="h2" className={classes.title}>{__("PICK UP INFORMATION")}</Typo>
            <div className={classes.fields}>
                <div>
                    <Input
                        id="contactName"
                        placeholder={__("Contact name at pickup location")}
                        classes={{input: formik.errors.contactName && formik.touched.contactName ? classes.errorInputComponent : classes.field}}
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.contactName && formik.touched.contactName ? 
                        <div className={classes.error}>
                                <Typo as="p" variant="pxs" color="error" font="regular">
                                    {__(formik.errors.contactName)}
                                </Typo>
                            <img className={classes.errorIcon} src="/icons/error.svg" />
                        </div>
                    : null}
                </div>
                <div>
                    <Input
                        id="phone"
                        type="phone"
                        placeholder={__("Phone number at pickup location")}
                        classes={{input: formik.errors.phone && formik.touched.phone ? classes.errorInputComponent : classes.field}}
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.phone && formik.touched.phone ? 
                        <div className={classes.error}>
                                <Typo as="p" variant="pxs" color="error" font="regular">
                                    {__(formik.errors.phone)}
                                </Typo>
                            <img className={classes.errorIcon} src="/icons/error.svg" />
                        </div>
                    : null}
                </div>
            </div>
            <div className={classes.fields}>
                <Input
                    id="companyName"
                    placeholder={__("Company name at pickup location")}
                    classes={{input: formik.errors.companyName && formik.touched.companyName ? classes.errorInputComponent : classes.field}}
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <Input
                    id="orderNumber"
                    placeholder={__("Order reference number")}
                    classes={{input: formik.errors.orderNumber && formik.touched.orderNumber ? classes.errorInputComponent : classes.field}}
                    value={formik.values.orderNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>
            <Upload formik={formik} sizeError={sizeError} setSizeError={setSizeError}/>
            <div>
                <textarea
                    id="notes"
                    cols="10"
                    rows="4"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={__("Notes")}
                    className={classes.notesInput}
                />
            </div>
        </div>
    );
};

export default PickUp;