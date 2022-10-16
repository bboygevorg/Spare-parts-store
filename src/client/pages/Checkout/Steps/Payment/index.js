import React, {useCallback, useEffect} from "react";
import classes from "./payment.css";
import Radio from "components/Radio/radio";
import { useCards } from "talons/useCards";
import Loading from "components/Loading";
import AddCard from "pages/Account/addCard";
import Typo from "components/UI/Typo";
import Button from "components/Button";
import get from "lodash/get";
import Modal from "components/Modal";
import CardError from "pages/Account/CardError";
import useTranslation from 'talons/useTranslation';
import { isCourierCheckout } from "../../courierCheckout";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import CheckBox from "components/CheckBox";

const paymentTitles = {
  stripe: "Pay by card",
  banktransfer: "Invoice payment"
}

const Payment = ({ values, setFormValues, nextStep, fields }) => {
  const {
    cards,
    isLoading,
    isOpen,
    isOpenCardError,
    onClose,
    toggleOpen,
    addNewCard,
    isSubmiting,
    setIsOpen,
    name,
    setName,
    errMessage
  } = useCards();
  const __ = useTranslation();
  const { pathname } = useLocation();
  const { allowedPaymentMethods } = useSelector(state => state.signin.customerData);
	
	useEffect(() => {
		const disableZoneList = new Event('disableZoneList');
		const enableZoneList = new Event('enableZoneList');
		document.dispatchEvent(disableZoneList);
		
		return () => {
			document.dispatchEvent(enableZoneList);
		}
	}, [])

  const renderPayments = useCallback(() => {
    if(allowedPaymentMethods && allowedPaymentMethods.length) {      
      if(allowedPaymentMethods.length === 1 && allowedPaymentMethods[0] === "stripe") {
        return;
      }
      else {
        let arr = [...allowedPaymentMethods];
        const i = arr.findIndex(el => el === "stripe");
        if(i) {
          arr.splice(i, 1);
          arr= ["stripe", ...arr];
        }
        return (
          <div className={classes.paymentSelection}>
            {arr.map((method, index) => 
                <div key={index} className={classes.checkBox}>
                  <CheckBox
                      label={__(paymentTitles[method])}
                      value={values.payment === method}
                      onChange={() => {
                        setFormValues({ payment: method });
                      }}
                      inCheckout={true}
                  />
              </div>
            )}
          </div>
        )
      }
    }
  }, [allowedPaymentMethods, values, paymentTitles, setFormValues]);

  const renderCards = () => {
    const elems = cards.map((el) => {
      return {
        ...el,
        value: el.id,
        label: `**** **** ****${el.last4}`,
      };
    });
    return (
      <Radio
        elements={elems}
        inCheckout={true}
        inPayment={true}
        value={isOpen ? null : get(values, "cardId.value", {})}
        name={"stores"}
        onChange={(val) => {
          setFormValues({
            cardId: elems.find((el) => el.value === val),
          });
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      />
    );
  };

  return (
    <div className={classes.root}>
      {renderPayments()}
      {isLoading || (!isLoading && isSubmiting) ? (
        <div className={classes.loadingWrapper}>
          {" "}
          <Loading />{" "}
        </div>
      ) : (values.payment === "stripe" &&
        <div>{renderCards()}</div>
      )}
      <div
        style={{
          display: (isLoading || (!isLoading && isSubmiting)) || values.payment !== "stripe" ? "none" : "block",
        }}
      >
        {!isOpen ? (
          <div className={classes.addNew}>
            <div
              className={classes.addNewContent}
              onClick={() => {
                setFormValues({ [fields]: undefined });
                toggleOpen();
              }}
            >
              <span>+</span>
              <Typo as="p" variant="p">
                {__("SELECT PAYMENT METHOD")}
              </Typo>
            </div>
          </div>
        ) : (
          <div>
            <AddCard
              submit={addNewCard}
              name={name}
              setName={setName}
              isSubmiting={isSubmiting}
              title="inCheckout"
            />
          </div>
        )}
      </div>
      {values.payment !== "stripe" || (values.payment === "stripe" && values[fields] && !isOpen) ? (
        <div className={classes.button}>
          <Button
            label={__("CONFIRM")}
            onClick={() => {
              if(!isCourierCheckout(pathname)) {
                if (
                  !get(values, ["billingAddressId", "id"]) ||
                  !get(values, ["shippingAddressId", "id"], "") ||
                  !get(values, ["estimatedSizeCode", "code"], "")
                ) {
                  return false;
                }
              }
              else
              if(values.payment === "stripe" &&
                !get(values, ["billingAddressId", "id"])
              ) {
                return false;
              }
              nextStep();
            }}
          />
        </div>
      ) : null}
      <Modal
        isShown={isOpenCardError}
        onClose={onClose}
        className={classes.dialog}
      >
        <CardError action={onClose} message={errMessage}/>
      </Modal>
    </div>
  );
};

export default Payment;
