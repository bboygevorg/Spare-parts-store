import React, { Fragment, useState } from 'react';
import classes from './addCard.css';
import Input from "components/Input"; 
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement, 
} from "@stripe/react-stripe-js";
import Button from "components/Button";
import Typo from "ui/Typo"; 
import useTranslation from 'talons/useTranslation';

const AddCard = ({
  name,
  setName,
  submit,
  isSaving,
  onCancel,
  title,
  errMessage
}) => {

  const [form, setForm] = useState({
      number: false,
      cvc: false,
      date: false,
  })  
  const [nameTouched, setNameTocuhed] = useState(false)
  const __ = useTranslation();
  const isFormValid = name && Object.values(form).every(el => el === true)
 
  const handleValidForm = (element, name) => {
    if (!element.empty && element.complete) {
    //   this.setState({ [name]: true });
        setForm(prev => ({
            ...prev,
            [name]: true
        }))
    } else {
         setForm((prev) => ({
           ...prev,
           [name]: false,
         }));
    }
    // this.checkEmptyStripeElements();
  }
  const handleSubmit = async (event) => {
    if(!isFormValid) {
        return false
    } 
    
      submit(event);  
  
  };

  return (
    <div className={`${classes.addCardDiv} ${title === "inAttachDetach" && classes.attachDetach}`}>
      {title !== "inAttachDetach" ?
        <Fragment>
          <div className={classes.title}>
            <Typo
              as="h2"
              variant="h2"
              font="condensed"
              className={classes.selectMethod}
            >
            {__("SELECT A PAYMENT METHOD")}
            </Typo>
          </div>
          <div className={classes.paymentIcons}>
            <img
              className={classes.paymentIcon}
              src={require(`../../assets/icons/visapayment.svg`)}
            />
            <img
              className={classes.paymentIcon}
              src={require(`../../assets/icons/mastercard.svg`)}
            />
            <img
              className={classes.paymentIcon}
              src={require(`../../assets/icons/american-express-logo.svg`)}
            />
          </div>
        </Fragment>
      :
        null
      }
      <Typo as="h2" variant="h2" font="condensed" className={classes.addCard}>
        {title === "inAttachDetach" ? __("Add company card") : __("ADD A CARD")}
      </Typo>
      <form>
        <div className={classes.inputs}>
          <div className={classes.inputLabel}>
            <Typo font="bold" as="p" variant="px" className={classes.label}>
              {__("Name on card")}
            </Typo>
            <Input
              placeholder= {__("Enter name on card")}
              value={name}
              onChange={(e) => {
                setNameTocuhed(true);
                setName(e.target.value);
              }}
              classes={{
                input:
                  !name && nameTouched ? classes.errorInput : classes.input,
              }}
            />
          </div>
          <div className={classes.inputLabel}>
            <Typo font="bold" as="p" variant="px" className={classes.label}>
              {__("Card number")}
            </Typo>
            <CardNumberElement
              className={classes.input}
              onChange={(elem) => handleValidForm(elem, "number")}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <div className={classes.inputLabel}>
            <Typo font="bold" as="p" variant="px" className={classes.label}>
              {__("Card Cvc")}
            </Typo>
            <CardCvcElement
              className={classes.input}
              onChange={(elem) => handleValidForm(elem, "cvc")}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <div className={classes.inputLabel}>
            <Typo font="bold" as="p" variant="px" className={classes.label}>
              {__("Expiration date")}
            </Typo>
            <CardExpiryElement
              className={classes.input}
              onChange={(elem) => handleValidForm(elem, "date")}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          {title ? (
            <Fragment>
              {title === "inAttachDetach" && errMessage ?
                <Typo as="p" variant="px" color="error" font="regular" className={classes.error}>{errMessage}</Typo>
              :
              null}
              <Button
                label={title === "inAttachDetach" ? __("Attach") : __("Save")}
                isSubmitting={isSaving}
                disabled={!isFormValid}
                onClick={handleSubmit}
                classes={{ button_primary: classes.saveBtn }}
              />
            </Fragment>
          ) : (
            <div className={classes.buttons}>
              <Button
                label={__("Save")}
                onClick={handleSubmit}
                isSubmitting={isSaving}
                disabled={!isFormValid}
                classes={{ button_primary: classes.saveButton }}
              />
              <Button
                label={__("Cancel")}
                type="bordered"
                classes={{ button_bordered: classes.cancelButton }}
                onClick={onCancel}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCard;