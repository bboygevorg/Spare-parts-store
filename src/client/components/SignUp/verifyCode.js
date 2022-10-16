import React, { useState, useEffect } from "react";
import { mergeClasses } from "helper/mergeClasses";
import defaultClasses from "./verifyCode.css";
import Input from "components/Input";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "store/actions/signIn";
import { clearStorage } from "helper/utils";
import { STORAGE_DONT_SHOW_AGAIN } from "conf/consts";
import useTranslation from 'talons/useTranslation';
import { GET_WISHLISTS, GET_ALL_WISHLIST_ITEMS } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { actions as wishListActions } from 'actions/wishList';
import { searchClient } from "conf/main";
import aa from 'search-insights';
import Loading from 'components/Loading';
import Typo from "ui/Typo";
import Attention from 'icons/attention.svg';
import { getMessage } from "helper/errors";

const validate = (values) => {
  const errors = {};
  Object.keys(values).forEach((key) => {
    if (!values[key]) {
      errors[key] = "Required.";
    } else if (!/^[0-9]+$/.test(values[key])) {
      errors[key] = "Type only numbers.";
    }
  });
  return errors;
};

const VerifyCode = (props) => {
  const dispatch = useDispatch();
  const { inCheckout, onClose, inviteToken, prevPath, setGraphqlError, setIsSend } = props;
  const cartToken = useSelector((state) => state.signin.cartToken);
  const getWishlists = useAwaitQuery(GET_WISHLISTS);
  const getAllWishlistItems = useAwaitQuery(GET_ALL_WISHLIST_ITEMS);
  let timer = null;
  const __ = useTranslation()
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      code_1: "",
      code_2: "",
      code_3: "",
      code_4: "",
      code_5: "",
      code_6: "",
    },
    validate,
    onSubmit: (values) => {
      customerRequest(values);
    },
  });
  const [inputs, setInputs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const customerRequest = async (values) => {
    if(message) {
      setMessage("");
      clearTimeout(timer);
    }
    if (props.action === "signup") {
      try {
        setIsSubmitting(true);
        const response = await props.request({
          variables: {
            customer: props.customer,
            secret: "".concat(
              values.code_1,
              values.code_2,
              values.code_3,
              values.code_4,
              values.code_5,
              values.code_6
            ),
            inviteToken: inviteToken || ""
          },
        });
        if (response && response.data) {
          aa('getUserToken', null, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            const userToken = response.data.customerRegister.customerToken;
            searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
          });
          dispatch(actions.signIn(response.data.customerRegister));
          const wishlistRes = await getWishlists({
            variables: {
              customerToken: response.data.customerRegister.customerToken
            },
            fetchPolicy: "no-cache"
          });
          dispatch(wishListActions.setWishlists(wishlistRes.data.getWishlists));
          const allItems = await getAllWishlistItems({
            variables: {
              customerToken: response.data.customerRegister.customerToken
            },
            fetchPolicy: "no-cache"
          });
          dispatch(wishListActions.setAllItems(allItems.data.getAllWishlistItems));
        }
        if(cartToken) {
          const res = await props.mergeCartsRequest({
            variables: {
              cartToken,
              customerToken: response.data.customerRegister.customerToken,
            },
          });
          if (res && res.data) {
            dispatch(actions.addCart(res.data.assignCustomerToCart));
          }
        }
        localStorage.removeItem('lastSend');
        setIsSubmitting(false);
        onClose();
        if (!inCheckout) {
          if(prevPath) {
            history.goBack();
          }
          else {
            history.replace("/account/profile");
          }
        }
      } catch (error) {
          setIsSubmitting(false);
          const parseError = JSON.parse(JSON.stringify(error));
          const code = parseError.graphQLErrors[0].code;
          const message = getMessage(code);
          setGraphqlError(message);
          clearStorage("cartData");
          clearStorage("cartToken");
          clearStorage(STORAGE_DONT_SHOW_AGAIN);
          clearCodes();
          setIsSend(false);
        }
    } else {
      try {
        setIsSubmitting(true);
        const response = await props.request({
          variables: {
            telephone: props.customer.telephone,
            email: props.customer.email,
            secret: "".concat(
              values.code_1,
              values.code_2,
              values.code_3,
              values.code_4,
              values.code_5,
              values.code_6
            ),
            deviceId: "001-LP",
          },
        });
        if (response && response.data) {
          aa('getUserToken', null, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            const userToken = response.data.customerLogin.customerToken;
            searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
          });
          dispatch(actions.signIn(response.data.customerLogin));
          const wishlistRes = await getWishlists({
            variables: {
              customerToken: response.data.customerLogin.customerToken
            },
            fetchPolicy: "no-cache"
          });
          dispatch(wishListActions.setWishlists(wishlistRes.data.getWishlists));
          const allItems = await getAllWishlistItems({
            variables: {
              customerToken: response.data.customerLogin.customerToken
            },
            fetchPolicy: "no-cache"
          });
          dispatch(wishListActions.setAllItems(allItems.data.getAllWishlistItems));
        }
        if (cartToken) {
          const res = await props.mergeCartsRequest({
            variables: {
              cartToken,
              customerToken: response.data.customerLogin.customerToken,
            },
          });
          if (res && res.data) {
            dispatch(actions.addCart(res.data.assignCustomerToCart));
          }
        }
        localStorage.removeItem('lastSend');
        setIsSubmitting(false);
        onClose();
        if(!inCheckout) {
          if(prevPath) {
            history.goBack();
          }
          else {
            history.replace("/account/profile");
          }
        }
      } catch (error) {
        setIsSubmitting(false);
        clearCodes();
      }
    }
  };
  const clearCodes = () => {
    Object.keys(formik.initialValues).map((key) =>
      formik.setFieldValue(key, "")
    );
  };
  const changeFocus = (values) => {
    const keys = Object.keys(values).map((key) => ({
      key,
      value: values[key],
    }));
    const focused = keys.filter((el) => !el.value);
    if (!focused.length) {
      formik.handleSubmit();
    } else {
      inputs.map((elem) => {
        if (elem.key === focused[0].key) {
          document.getElementById(elem.key).focus();
        }
      });
    }
  };
  useEffect(() => {
    timer = setTimeout(() => {
      const filtered = Object.values(formik.values).filter(el => el).length;
      if(!filtered) {
        setMessage(__("Make sure you gave mobile numbers. Landline numbers not supported"))
      }
    }, 30000);
    const values = Object.keys(formik.values);
    const inputs = values.map((key, index) => ({
      key,
      index: index + 1,
      focus: index === 0,
    }));
    setInputs(inputs);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (inputs.length) {
      document.getElementById(inputs[0].key).focus();
    }
  }, [inputs]);

  useEffect(() => {
    if (inputs.length) {
      changeFocus(formik.values);
    }
  }, [formik.values]);
  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <h2 className={classes.verifyTitle}>{__("Verify security code")}</h2>
      <p className={classes.about}>
        {__("Shortly you will receive sms with security code")}
      </p>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <div className={classes.codeInputs}>
          {isSubmitting ? 
            <div className={classes.loaderWrapper}>
              {" "}
              <Loading classes={{root: classes.loadingRoot}}/>{" "}
            </div>
          :
           inputs.map((inp, index) => (
            <div key={index} className={classes.input_error_div}>
              <Input
                id={inp.key}
                name={inp.key}
                value={formik.values[inp.key]}
                onChange={(e) => {
                  if (e.target.value.length > 1) {
                    return false;
                  } else {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                classes={{
                  input:
                    (formik.touched[inp.key] && formik.errors[inp.key]) ||
                    (props.error && props.error.includes("Verification"))
                      ? classes.inputErrorComponent
                      : classes.inputComponent,
                }}
                focus={inp.focus}
              />
            </div>
          ))}
        </div>
        {props.error && props.error.includes("Verification") && (
          <span className={classes.codeErrorMessage}>{__(props.error)}</span>
        )}
      </form>
      {message ? 
          <div className={classes.longVerification}>
            <img src={Attention} />
            <Typo as="p" variant="p" color="primary" font="regular" className={classes.message}>{message}</Typo>
          </div>
        :
          null
        }
    </div>
  );
};

export default VerifyCode;
