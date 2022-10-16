import React, { useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import classes from "./addressForm.css";
// import { FormikFormField } from "../../wrappers/Formik/FormField";
import Input from "components/Input/input";
import Select from "components/Select";
import { GET_COUNTRIES, GET_REGIONS } from "api/query";
import Loading from "components/Loading";
import Button from "components/Button";
import { firstUpperCase, storage } from "helper/utils";
import { useFormik } from "formik";
import Typo from "components/UI/Typo/index";
import { errorMessage } from "conf/consts";
import { ADD_ADDRESS } from "api/mutation";
import SearchLocationInput from "../../components/JobAddresses/input";
import isEmpty  from "lodash/isEmpty";
import useTranslation from 'talons/useTranslation';

const validate = (values) => {
  const errors = {};
  Object.keys(values).forEach((key) => {
    if (key !== "address_2" && key !== "title") {
      if (
        !values[key] ||
        values[key] === "Country" ||
        values[key] === "State"
      ) {
        errors[key] = errorMessage(
          `'${firstUpperCase(key)}'`,
          "is a required value."
        );
      }
    }
  });
  if (/.*[a-zA-Z].*/.test(values.zip)) {
    errors.zip = "Type only numbers.";
  } 
  else 
  if (values.zip.length !== 5) {
    errors.zip = "Wrong Zip Code, allowed format: XXXXX";
  }
  return errors;
};
const AddressForm = (props) => {
  const { onSubmit } = props;
  const __ = useTranslation();
  const formik = useFormik({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "California",
      zip: "",
      country: "US",
      //   defaultBilling: props.billing,
    },
    validate,
    enableReinitialize: true,
    onSubmit: (vals) => {
      window.scrollTo(0, 0);
      saveAddressHandler(vals);
    },
  });
  const [addAddress, { loading }] = useMutation(ADD_ADDRESS);

  const { loading: countriesLoader, data: countries } = useQuery(GET_COUNTRIES);
  const [getRegions, { loading: regionsLoader, data: regions }] = useLazyQuery(
    GET_REGIONS
  );
  const isFormValid = formik.isValid && !isEmpty(formik.touched); 

  const saveAddressHandler = (values) => {
    addAddress({
      variables: {
        customerToken: storage("customerToken"),
        address: {
          title: values.title,
          countryId: values.country,
          regionId: regionIdByName(values.state),
          street: values.address_2
            ? [values.address_1, values.address_2]
            : [values.address_1],
          city: values.city,
          firstname: values.firstName,
          lastname: values.lastName,
          postcode: values.zip,
          defaultBilling: !!props.billing,
        },
      },
    }).then((res) => {
      if (onSubmit) {
        onSubmit(res.data.addCustomerAddress);
      }
    });
  };
  useEffect(() => {
    if (formik.values.country) {
      if (props.title === "DELIVERY ADDRESS") {
        formik.values.state = "California";
      }
      getRegions({
        variables: {
          countryId: formik.values.country,
        },
      });
    } else {
      formik.values.state = "State";
    }
  }, [formik.values.country]);

  const regionIdByName = (regionName) => {
    let id = 0;
    regions.getRegions.map((region) => {
      if (region.name === regionName) {
        id = region.id;
      }
    });
    return id;
  };

  if (countriesLoader || regionsLoader) {
    return <Loading />;
  }
  return (
    <div className={`${classes.root} ${classes.inCheckoutRoot}`}>
      {/* <form onSubmit={formik.handleSubmit}> */}
      <div className={classes.title}>
        <Typo as="h2" variant="h2" className={classes.toggleTitle}>
          {__(`ADD NEW ${props.title}`)}
        </Typo>
      </div>
      {props.title === "DELIVERY ADDRESS" && 
        <div
          className={classes.inputDiv}
        >
          <div className={classes.inputErrorDiv}>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={__("Title")}
              classes={{
                input:classes.inputComponent
              }}
            />
          </div>
        </div>
      }
      <div
        className={
          (formik.touched.firstName && formik.errors.firstName) ||
          (formik.touched.lastName && formik.errors.lastName)
            ? classes.inputWithError
            : classes.inputDiv
        }
      >
        <div className={classes.inputErrorDiv}>
          <Input
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={__("First name")}
            classes={{
              input:
                formik.touched.firstName && formik.errors.firstName
                  ? classes.errorInput
                  : classes.inputComponent,
            }}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.firstName)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
        <div className={classes.inputErrorDiv}>
          <Input
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={__("Last name")}
            classes={{
              input:
                formik.touched.lastName && formik.errors.lastName
                  ? classes.errorInput
                  : classes.inputComponent,
            }}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.lastName)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
      </div>
      <div
        className={
          formik.touched.address_1 && formik.errors.address_1
            ? classes.inputWithError
            : classes.inputDiv
        }
      >
        <div className={classes.inputErrorDiv}>
          <SearchLocationInput
            classes={
              formik.touched.address_1 && formik.errors.address_1
                ? classes.errorInput
                : classes.inputComponent
            }
            name="address_1"
            onChange={formik.setFieldValue}
            onTouched={formik.setFieldTouched}
            onError={formik.setFieldError}
            value={formik.values["address_1"]}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address_1 && formik.errors.address_1 && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.address_1)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
        <div className={classes.inputErrorDiv}>
          <Input
            id="address_2"
            name="address_2"
            value={formik.values.address_2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={__("Address 2")}
            classes={{ input: classes.inputComponent }}
          />
        </div>
      </div>
      <div
        className={
          (formik.touched.city && formik.errors.city) ||
          (formik.touched.state && formik.errors.state)
            ? classes.inputWithError
            : classes.inputDiv
        }
      >
        <div className={classes.inputErrorDiv}>
          <Input
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={__("City")}
            classes={{
              input:
                formik.touched.city && formik.errors.city
                  ? classes.errorInput
                  : classes.inputComponent,
            }}
          />
          {formik.touched.city && formik.errors.city && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.city)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
        <div className={classes.inputErrorDiv}>
          <Select
            id="state"
            name="state"
            label={__("State")}
            value={formik.values.state}
            onChange={formik.setFieldValue}
            onBlur={formik.handleBlur}
            labelKey="name"
            items={regions && formik.values.country ? regions.getRegions : []}
            classes={{
              select:
                formik.touched.state && formik.errors.state
                  ? classes.errorSelect
                  : classes.selectComponent,
            }}
          />
          {formik.touched.state && formik.errors.state && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.state)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
      </div>
      <div className={classes.inputDiv}>
        <div className={classes.inputErrorDiv}>
          <Input
            id="zip"
            name="zip"
            value={formik.values.zip}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={__("ZIP")}
            classes={{
              input:
                formik.touched.zip && formik.errors.zip
                  ? classes.errorInput
                  : classes.inputComponent,
            }}
          />
          {formik.touched.zip && formik.errors.zip && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.zip)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
        <div className={classes.inputErrorDiv}>
          <Select
            id="country"
            name="country"
            label={__("Country")}
            value={formik.values.country}
            onChange={formik.setFieldValue}
            onBlur={formik.handleBlur}
            items={countries.getCountries}
            classes={{
              select:
                formik.touched.country && formik.errors.country
                  ? classes.errorSelect
                  : classes.selectComponent,
            }}
          />
          {formik.touched.country && formik.errors.country && (
            <div className={classes.error}>
              <Typo as="p" variant="pxs" color="error" font="regular">
                {__(formik.errors.country)}
              </Typo>
              <img className={classes.errorIcon} src="/icons/error.svg" />
            </div>
          )}
        </div>
      </div>
      <div className={classes.button}>
        <Button
          label={__("CONFIRM")}
          disabled={!isFormValid}
          onClick={() => {
            if(!isFormValid || loading) {
              return false
            }
            formik.handleSubmit()}}
        />
      </div>
      {/* </form> */}
    </div>
  );
};

export default AddressForm;
