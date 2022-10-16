import React, { useState, useEffect } from "react";
import defaultClasses from "./signIn.css";
import { mergeClasses } from "helper/mergeClasses";
import Input from "components/Input";
import Button from "components/Button";
import { useFormik } from "formik";
// import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import VerifyCode from "components/SignUp/verifyCode";
import { CUSTOMER_VARIFY, CUSTOMER_LOGIN, MERGE_CARTS } from "api/mutation";
import { CUSTOMER_EXISTS, PHONE_EXISTS } from "api/query";
import Typo from "ui/Typo";
import AppWrapper from "ui/AppWrapper";
import { getMessage } from "helper/errors";
import { errorMessage } from "conf/consts";
import { firstUpperCase } from "helper/utils";
import Modal from "components/Modal";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { useHistory } from "react-router-dom";
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link';
import isEmpty from "lodash/isEmpty";

const validate = (values) => {
  const errors = {};
  Object.keys(values).forEach((key) => {
    if (!values[key]) {
      errors[key] = errorMessage(
        `${firstUpperCase(key)}`,
        "is a required value."
      );
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

const SignIn = (props) => {
  const { isFromCheckout, changeType, prevPath } = props;
  const history = useHistory()
  const __ = useTranslation();
  const [sendCode] = useMutation(CUSTOMER_VARIFY);
  const [getCustomerData, { error }] = useMutation(CUSTOMER_LOGIN);
  const [mergeCarts] = useMutation(MERGE_CARTS);
  const getCustomerExists = useAwaitQuery(CUSTOMER_EXISTS);
  const getPhoneExists = useAwaitQuery(PHONE_EXISTS);
  const [isOpen, setIsOpen] = useState(false);
  const [graphqlError, setGraphqlError] = useState("");
  const [userExists, setUserExists] = useState(true);
  const [phoneExists, setPhoneExists] = useState(true);
  const localeId = useSelector(state => state.language.currentLanguage);
  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
    },
    validate,
    onSubmit: (values) => {
      setGraphqlError("");
      getUserAndPhoneExists(values);
    },
  });
  const verifyCode = async (values) => {
    const lastSend = JSON.parse(localStorage.getItem('lastSend'));
    if(!isEmpty(lastSend) && values.phone === lastSend.phone) {
      const currentDate = new Date()
      const difference = currentDate.getTime() - lastSend.time;
      const resultInMinutes = Math.round(difference / 60000);
      if(resultInMinutes < 1) {
        setIsOpen(!isOpen);
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
        setIsOpen(!isOpen);
        window.scrollTo(0,0);
      }
    } catch(error) {
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
    if (res.data.customerExists && response.data.phoneExists) {
      verifyCode(values);
    }
  };
  useEffect(() => {
    if (!userExists) {
      setUserExists(true);
    }
  }, [formik.values.email]);
  useEffect(() => {
    if (!phoneExists) {
      setPhoneExists(true);
    }
  }, [formik.values.phone]);
  useEffect(() => {
    if (error) {
      const parseError = JSON.parse(JSON.stringify(error));
      const code = parseError.graphQLErrors[0].code;
      const message = getMessage(code);
      if (message.includes("Customer")) {
        setIsOpen(!isOpen);
        setGraphqlError(message);
      } else {
        setGraphqlError(message);
      }
    }
  }, [error]);
  const customer = {
    telephone: formik.values.phone,
    email: formik.values.email,
    deviceId: "001-LP",
  };
  const classes = mergeClasses(defaultClasses, props.classes);
  return (
    <AppWrapper>
      <div className={classes.root}>
        <form onSubmit={formik.handleSubmit}>
          <Typo
            as="h2"
            variant="h2"
            color="primary"
            font="condensed"
            className={classes.title}
          >
            {__("SIGN IN")}
          </Typo>
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
                  (formik.touched.email && formik.errors.email) || !userExists
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
            ) : !userExists ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {
                    __("This email address doesn't exist in an associated website.")
                  }
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
                  (formik.touched.phone && formik.errors.phone) || !phoneExists
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
            ) : !phoneExists ? (
              <div className={classes.error}>
                <Typo as="p" variant="pxs" color="error" font="regular">
                  {__("This phone number doesn't exists in an associated website.")}
                </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
              </div>
            ) : (
              ""
            )}
          </div>
          {graphqlError && (
            <Typo
              as="p"
              variant="pxs"
              color="error"
              font="regular"
              className={classes.signInError}
            >
              {__(graphqlError)}
            </Typo>
          )}
          <Button
            Type="submit"
            label={__("SIGN IN")}
            classes={{ button_primary: classes.signInButton }}
          />
        </form>
        <Typo
          as="p"
          variant="px"
          color="primary"
          font="regular"
          className={classes.haveAccount}
        >
          {__("If you already have been here before, please")}
        </Typo>
        <Button
          label={__("SIGN UP")}
          type="bordered"
          classes={{ button_bordered: classes.signUpButton }}
          onClick={() => {
            if (isFromCheckout) {
              changeType("signup");
            } else {
              localeId === "default" ? history.replace("/signup") : history.replace(`/signup${codeSplitter(localeId)}`);
            }
          }}
        />
      </div>
      <Modal
        isShown={isOpen}
        onClose={() => {
          setIsOpen(!isOpen);
          setGraphqlError("");
        }}
        className={classes.dialog}
      >
        <VerifyCode
          action="signin"
          customer={customer}
          request={getCustomerData}
          error={graphqlError}
          mergeCartsRequest={mergeCarts}
          inCheckout={isFromCheckout}
          onClose={() => {
            setIsOpen(!isOpen);
            setGraphqlError("");
          }}
          prevPath={prevPath}
        />
      </Modal>
    </AppWrapper>
  );
};

export default SignIn;
