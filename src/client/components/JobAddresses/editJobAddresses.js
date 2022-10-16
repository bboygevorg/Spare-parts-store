import React, { useEffect, useState } from "react";
import defaultClasses from "./editJobAddresses.css";
import { mergeClasses } from "helper/mergeClasses";
import Input from "components/Input";
import Button from "components/Button";
import Select from "components/Select";
import { useFormik } from "formik";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import Loading from "components/Loading";
import { GET_COUNTRIES, GET_REGIONS } from "api/query";
import get from "lodash/get";
import { errorMessage } from "conf/consts";
import { firstUpperCase } from "helper/utils";
import Typo from "ui/Typo";
import SearchLocationInput from "./input";
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
  } else if (values.zip && values.zip.length !== 5) {
    errors.zip = "Wrong Zip Code, allowed format: XXXXX";
  }
  return errors;
};

const EditJobAddresses = (props) => {
  const {
    customerToken,
    onAfterSubmit,
    request,
    setAddresses,
    addresses,
    setShowInfo,
    initialValues,
    inCheckout,
    setStep,
    step,
    setAddressId,
    inProfile,
    title: titlee,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const __ = useTranslation();
  const { loading: countriesLoader, data: countries } = useQuery(GET_COUNTRIES);
  const [getRegions, { loading: regionsLoader, data: regions }] = useLazyQuery(
    GET_REGIONS
  ); 
  const formik = useFormik({
    initialValues: {
      title: get(initialValues, "title", ""),
      firstName: get(initialValues, "firstname", ""),
      lastName: get(initialValues, "lastname", ""),
      address_1: get(initialValues, ["street", "0"], ""),
      address_2: get(initialValues, ["street", "1"], ""),
      city: get(initialValues, "city", ""),
      state: get(initialValues, ["region", "name"], titlee ? "" : "California"),
      zip: get(initialValues, "postcode", ""),
      country: get(initialValues, ["country", "id"], "US"),
    },
    validate,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!initialValues) {
        req(values);
      } else if (initialValues.id) {
        req(values);
      }
    },
  }); 
  useEffect(() => {
    if (formik.values.country) {
      if (!titlee) {
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
  const req = async (values) => {
    if (!initialValues) {
      setIsSubmitting(true);
      const response = await request({
        variables: {
          customerToken: customerToken,
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
            defaultBilling: inProfile,
          },
        },
      });
      setIsSubmitting(false);
      const arr = [...addresses];
      arr.push(response.data.addCustomerAddress);
      setAddresses(arr);
      !inProfile && setShowInfo(true);
      if (inCheckout) {
        setAddressId(response.data.addCustomerAddress.id);
        setStep(step);
      }
      onAfterSubmit();
    } else if (initialValues.id) {
      setIsSubmitting(true);
      const response = await request({
        variables: {
          customerToken: customerToken,
          addressId: initialValues.id,
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
          },
        },
      });
      setIsSubmitting(false);
      const updatedAddress = response.data.updateCustomerAddress;
      const arr = [...addresses];
      const updateIndex = arr.findIndex((el) => el.id === updatedAddress.id);
      arr[updateIndex] = updatedAddress;
      setAddresses(arr);
      if (inCheckout) {
        setAddressId(updatedAddress.id);
        setStep(step);
      }
      onAfterSubmit();
    }
  };
  const classes = mergeClasses(defaultClasses, props.classes);
  let title;
  if (step === "billAddress") {
    title = "DELIVERY ADDRESS";
  } else if (step === "payment" || step === "summary") {
    title = "BILLING ADDRESS";
  } else if (initialValues) {
    title = "EDIT JOB ADDRESS";
  } else {
    title = "ADD JOB ADDRESS";
  }
  if (countriesLoader || regionsLoader) {
    if (titlee) {
      return <Loading />;
    } else {
      return (
        <div className={classes.loadingWrapper}>
          {" "}
          <Loading />{" "}
        </div>
      );
    }
  }
  return (
    <div className={`${classes.root} ${inCheckout && classes.inCheckoutRoot}`}>
        <h3
          className={`${classes.title} ${
            inCheckout && classes.inCheckoutTitle
          }`}
        >
          {__(props.title) || __(title)}
        </h3>
        {!titlee && 
          <div className={classes.inputDiv}>
            <div className={classes.inputErrorDiv}>
              <Input
                id="title"
                name="title" 
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={__("Title")}
                classes={{
                  input: classes.inputComponent
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
                root:
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
                root:
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
        <div
          className={`${classes.buttonLoadingDiv} ${
            inCheckout && classes.inCheckoutBtn
          }`}
        >
          <Button
            label={inCheckout ? __("CONFIRM") : __("SAVE")}
            onClick={() => {formik.handleSubmit()}}
            classes={{ button_primary: classes.buttonComponent }}
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>
    </div>
  );
};

export default EditJobAddresses;
