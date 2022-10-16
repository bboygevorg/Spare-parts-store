import React, { useState, useEffect, Fragment } from "react";
import defaultClasses from "./signUp.css";
import { mergeClasses } from "helper/mergeClasses";
import Input from "components/Input";
import Button from "components/Button";
import VerifyCode from "./verifyCode";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { CUSTOMER_VARIFY, CUSTOMER_REGISTER, MERGE_CARTS } from "api/mutation";
import { CUSTOMER_EXISTS, PHONE_EXISTS } from "api/query";
import AppWrapper from "ui/AppWrapper";
import { getMessage } from "helper/errors";
import { errorMessage } from "conf/consts";
import { firstUpperCase } from "helper/utils";
import Typo from "ui/Typo";
import Modal from "components/Modal";
import { useAwaitQuery } from "talons/useAwaitQuery";
import useTranslation from 'talons/useTranslation';
import CheckBox from 'components/CheckBox';
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link';
import isEmpty from "lodash/isEmpty";

const validate = (values, reseller, contractor) => {
  const errors = {};
  Object.keys(values).forEach((key) => {
    if(key !== "hvac" && key !== "epa" && key !== "companyName") {
      if(!reseller && key === "resellerId" || !contractor && key === "contractorLicence") {
        return;
      }
      if (!values[key]) {
        errors[key] = errorMessage(
          `'${firstUpperCase(key)}'`,
          "is a required value."
        );
      }
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email";
  }
  if (
    values.phone &&
    !/^(([(][+1]\d[)][ ])|)((\d{3}([-]\d{3})*([-]\d{4})+))$/.test(values.phone)
  ) {
    errors.phone = "Invalid phone number";
  }
  return errors;
};

const SignUp = (props) => {
  const { isFromCheckout, changeType, inviteToken, prevPath } = props;
  const history = useHistory();
  const __ = useTranslation();
  const [isSend, setIsSend] = useState(false);
  const [checked, setChecked] = useState(false);
  const [contractorChecked, setContractorChecked] = useState(false);
  const [setCustomerData, { error }] = useMutation(CUSTOMER_REGISTER);
  const [mergeCarts] = useMutation(MERGE_CARTS);
  const [sendCode] = useMutation(CUSTOMER_VARIFY);
  const getCustomerExists = useAwaitQuery(CUSTOMER_EXISTS);
  const getPhoneExists = useAwaitQuery(PHONE_EXISTS);
  const [graphqlError, setGraphqlError] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const localeId = useSelector(state => state.language.currentLanguage);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hvac: "",
      epa: "",
      resellerId: "",
      companyName: "",
      contractorLicence: ""
    },
    validate: values => validate(values, checked, contractorChecked),
    onSubmit: (values) => getUserAndPhoneExists(values),
  });
  const verifyCode = async (values) => {
    const lastSend = JSON.parse(localStorage.getItem('lastSend'));
    if(!isEmpty(lastSend) && values.phone === lastSend.phone) {
      const currentDate = new Date();
      const difference = currentDate.getTime() - lastSend.time;
      const resultInMinutes = Math.round(difference / 60000);
      if(resultInMinutes < 1) {
        setIsSend(!isSend);
        window.scrollTo(0,0);
        return;
      }
    }
    try {
      const response = await sendCode({
        variables: {
          telephone: values.phone,
        },
      });
      if (response.data && response.data.customerVerify) {
        localStorage.setItem('lastSend', JSON.stringify({
          email: values.email,
          phone: values.phone,
          time: new Date().getTime()
        }));
        setIsSend(!isSend);
        window.scrollTo(0,0);
      }
    } catch (error) {
      const parseError = JSON.parse(JSON.stringify(error));
      const message = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
      if(message) {
        setGraphqlError(message);
      }
      else {
        const twilioErrorCode = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].code;
        const twilioMessage = getMessage(twilioErrorCode);
        setGraphqlError(twilioMessage);
      }
    }
  };

  const getUserAndPhoneExists = async (values) => {
    const res = await getCustomerExists({
      variables: {
        email: values.email,
      },
    });
    if (res) {
      setUserExists(res.data.customerExists);
    }
    const response = await getPhoneExists({
      variables: {
        phone: values.phone,
      },
    });
    if (response) {
      setPhoneExists(response.data.phoneExists);
    }
    if (!res.data.customerExists && !response.data.phoneExists) {
      verifyCode(values);
    }
  };
  useEffect(() => {
    if (userExists) {
      setUserExists(false);
    }
  }, [formik.values.email]);
  useEffect(() => {
    if (phoneExists) {
      setPhoneExists(false);
    }
  }, [formik.values.phone]);
  useEffect(() => {
    if (error) {
      const parseError = JSON.parse(JSON.stringify(error));
      const code = parseError.graphQLErrors[0].code;
      const message = getMessage(code);
      setGraphqlError(message);
    }
  }, [error]);

  const customer = {
    email: formik.values.email,
    telephone: formik.values.phone,
    firstname: formik.values.firstName,
    lastname: formik.values.lastName,
    pushToken: "hhje",
    deviceId: "001-LP",
    resellerId: formik.values.resellerId,
    companyName: formik.values.companyName,
    hvacLicense: formik.values.hvac,
    epaCertification: formik.values.epa,
    contractorLicence: formik.values.contractorLicence
  };
  const classes = mergeClasses(defaultClasses, props.classes);
  return (
    <AppWrapper>
      <div className={classes.root}>
        <form onSubmit={formik.handleSubmit}>
          <Typo as="h2" variant="h2" font="condensed" className={classes.title}>
            {isFromCheckout ? __("TELL US ABOUT YOU") : __("SIGN UP")}
          </Typo>
          <div
            className={
              formik.touched.firstName && formik.errors.firstName
                ? classes.inputErrorDiv
                : classes.inputDiv
            }
          >
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={__("First name")}
              classes={{
                input:
                  formik.touched.firstName && formik.errors.firstName
                    ? classes.errorInputComponent
                    : classes.inputComponent,
              }}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          <div
            className={
              formik.touched.lastName && formik.errors.lastName
                ? classes.inputErrorDiv
                : classes.inputDiv
            }
          >
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={__("Last name")}
              classes={{
                input:
                  formik.touched.lastName && formik.errors.lastName
                    ? classes.errorInputComponent
                    : classes.inputComponent,
              }}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          <div
            className={
              formik.touched.email && formik.errors.email
                ? classes.inputErrorDiv
                : classes.inputDiv
            }
          >
            <Input
              id="email"
              name="email"
              type="text"
              placeholder={__("E-mail address")}
              classes={{
                input:
                  (formik.touched.email && formik.errors.email) || userExists
                    ? classes.errorInputComponent
                    : classes.inputComponent,
              }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {__(formik.errors.email)}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            ) : userExists ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {__("A customer with the same email address already exists in an associated website.")}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={
              formik.touched.phone && formik.errors.phone
                ? classes.inputErrorDiv
                : classes.inputDiv
            }
          >
            <Input
              id="phone"
              name="phone"
              type="phone"
              placeholder={__("(+1) xxx-xxx-xxxx (supports only mobile numbers)")}
              classes={{
                input:
                  (formik.touched.phone && formik.errors.phone) || phoneExists
                    ? classes.errorInputComponent
                    : classes.inputComponent,
              }}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {__(formik.errors.phone)}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            ) : phoneExists ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                {__("Phone number already registered.")}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            ) : (
              ""
            )}
          </div>
          {!inviteToken ? 
            <Fragment>
               <div className={classes.inputDiv}>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder={__("Company Name")}
                  classes={{input: classes.inputComponent}}
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={classes.inputDiv}>
                <Input
                  id="hvac"
                  name="hvac"
                  type="text"
                  placeholder={__("HVAC License (Optional)")}
                  classes={{input: classes.inputComponent}}
                  value={formik.values.hvac}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={classes.inputDiv}>
                <Input
                  id="epa"
                  name="epa"
                  type="text"
                  placeholder={__("EPA Certification (Optional)")}
                  classes={{input: classes.inputComponent}}
                  value={formik.values.epa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={classes.checkContractor}>
                <Typo as="p" variant="p" font="bold">{__("Are a contractor?")}</Typo>
                <CheckBox
                  label=""
                  value={contractorChecked}
                  onChange={() => {
                    setContractorChecked(!contractorChecked);
                  }}
                  inSignUp={true}
                />
              </div>
              <Typo as="p" variant="px" font="regular" color="code" className={contractorChecked && classes.contractorMessage}>{__("We have special offers and conditions for contractors")}</Typo>
              {contractorChecked &&
                <div className={classes.inputDiv}>
                  <Input
                    id="contractorLicence"
                    name="contractorLicence"
                    type="text"
                    placeholder={__("Contract license")}
                    classes={{input: classes.inputComponent}}
                    value={formik.values.contractorLicence}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contractorLicence && formik.errors.contractorLicence && (
                    <div className={classes.error}>
                      <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(formik.errors.contractorLicence)}
                      </Typo>
                      <img className={classes.errorIcon} src="/icons/error.svg" />
                    </div>
                  )}
                </div>
              }
              <div className={classes.checkReseller}>
                <Typo as="p" variant="p" font="bold">{__("Reseller")}</Typo>
                <CheckBox
                  label=""
                  value={checked}
                  onChange={() => {
                    setChecked(!checked);
                  }}
                  inSignUp={true}
                />
              </div>
              {checked &&
                <div className={classes.inputDiv}>
                  <Input
                    id="resellerId"
                    name="resellerId"
                    type="text"
                    placeholder={__("Reseller ID")}
                    classes={{input: classes.inputComponent}}
                    value={formik.values.resellerId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.resellerId && formik.errors.resellerId && (
                    <div className={classes.error}>
                      <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(formik.errors.resellerId)}
                      </Typo>
                      <img className={classes.errorIcon} src="/icons/error.svg" />
                    </div>
                  )}
                </div>
              }
            </Fragment>
          : 
            null
          }
          {graphqlError && (
            <Typo
              as="p"
              variant="pxs"
              color="error"
              font="regular"
              className={classes.signUpError}
            >
              {__(graphqlError)}
            </Typo>
          )}
          <Button
            Type="submit"
            label={isFromCheckout ? __("CONTINUE") : __("SIGN UP")}
            classes={{ button_primary: classes.signUpButton }}
          />
        </form>
        <Typo
          as="p"
          variant="px"
          font="regular"
          className={classes.haveAccount}
        >
           {__("If you already have been here before, please")}
        </Typo>
        <Button
          type="bordered"
          label= {__("SIGN IN")}
          classes={{ button_bordered: classes.signInButton }}
          onClick={() => {
            if (isFromCheckout) {
              changeType("signin");
            } else
            if(localeId) {
              if(localeId === "default") {
                history.replace("/signin");
              }
              else {
                history.replace(`/signin${codeSplitter(localeId)}`)
              }
            }
          }}
        />
      </div>
      <Modal
        isShown={isSend}
        onClose={() => {
          setIsSend(!isSend);
          setGraphqlError("");
        }}
        className={classes.dialog}
      >
        <VerifyCode
          action="signup"
          customer={customer}
          request={setCustomerData}
          mergeCartsRequest={mergeCarts}
          error={graphqlError}
          setGraphqlError={setGraphqlError}
          setIsSend={setIsSend}
          inCheckout={isFromCheckout}
          onClose={() => {
            setIsSend(!isSend);
            setGraphqlError("");
          }}
          prevPath={prevPath}
          inviteToken={inviteToken}
        />
      </Modal>
    </AppWrapper>
  );
};

export default SignUp;
