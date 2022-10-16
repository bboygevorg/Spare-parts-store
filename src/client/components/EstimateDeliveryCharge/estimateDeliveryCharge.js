import React from "react";
import classes from "./estimateDeliveryCharge.css";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import Input from "components/Input";
import Button from "components/Button";
import ButtonArrow from "icons/ButtonArrow";
import useTranslation from 'talons/useTranslation';

const validate = (values) => {
  const errors = {};
  if (!values.zipCode) {
    errors.zipCode = "Zipcode is a required value.";
  } else if (/.*[a-zA-Z].*/.test(values.zipCode)) {
    errors.zipCode = "Type only numbers.";
  } else if (values.zipCode.length !== 5) {
    errors.zipCode = "Wrong Zip Code, allowed format: XXXXX";
  }
  return errors;
};


const EstimateDeliveryCharge = () => {
  const __ = useTranslation();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      zipCode: "",
    },
    validate,
  });

  return (
    <div className={classes.root}>
      <div className={classes.inputWrapper}>
        <Input
          id="zipCode"
          name="zipCode"
          classes={{
            input:
              formik.touched.zipCode && formik.errors.zipCode
                ? classes.inputError
                : classes.input,
          }}
          placeholder={__("Enter a ZIP Code")}
          value={formik.values.zipCode}
          onChange={(e) => {
            if (e.target.value.length > 5) {
              return false;
            } else {
              formik.handleChange(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              document.activeElement.blur();
            }
          }}
          onBlur={formik.handleBlur}
        />{" "}
      </div>
      {/* {formik.touched.zipCode && formik.errors.zipCode &&
                            <div className={classes.error}>
                                <Typo as="p" variant="pxs" color="error" font="regular">{formik.errors.zipCode}</Typo>
                                <img className={classes.errorIcon} src="/icons/error.svg" />
                            </div> 
                    } */}
      <div>
        <Button
          label={<ButtonArrow />}
          classes={{ button_primary: classes.getPrice_button }}
          onClick={() => {
            if((formik.touched.zipCode && formik.errors.zipCode )|| !formik.touched.zipCode) {
              return;
            }
            history.replace("/estimate-delivery", {
              state: {
                zipCode: formik.values.zipCode,
              },
            });
          }}
        />
      </div>
    </div>
  );
};

export default EstimateDeliveryCharge;
