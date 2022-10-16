import React, { useState, useEffect } from "react";
import AppWrapper from "ui/AppWrapper";
import Tabs from "./tabs";
import classes from "./paymentMethods.css";
import Button from "components/Button";
import Typo from "ui/Typo";
import { MOBILE_SIZE, STATIC_DESCRIPTION } from "conf/consts";
import useWindowDimensions from "talons/useWindowDimensions";
import BackStep from "../../pages/Account/backStep";
import {
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
} from "@stripe/react-stripe-js";
import { CREATE_EPHEMERAL_KEY, SAVE_CARD, DELETE_CARD } from "api/mutation";
import { GET_CARDS } from "api/query";
import { useMutation } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "store/actions/user";
import Loading from "components/Loading/index";
import AddCard from "./addCard";
import isEmpty from "lodash/isEmpty";
import { useAwaitQuery } from "talons/useAwaitQuery";
import Head from "components/Head";
import visa from "icons/visa.svg";
import mastercard from "icons/mastercard.svg";
import americanExpress from "icons/american-express-logo.svg";
import get from "lodash/get";
import Modal from "components/Modal";
import CardError from "pages/Account/CardError";
import useTranslation from 'talons/useTranslation';

const icons = {
  visa,
  mastercard,
  amex: americanExpress,
};

const PaymentMethods = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState("payment");
  const [add, setAdd] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [del, setDel] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();
  const customerToken = useSelector(
    (state) => state.signin.customerData.customerToken
  );
  const customerCards = useSelector((state) => state.signin.customerCards);
  const __ = useTranslation();
  const getCards = useAwaitQuery(GET_CARDS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createEphemeralKey] = useMutation(CREATE_EPHEMERAL_KEY);
  const [saveCard] = useMutation(SAVE_CARD);
  const [deleteCardHandler] = useMutation(DELETE_CARD);

  useEffect(() => {
    if (customerToken) {
      setIsLoading(true);
      getCustomerId();
    }
  }, [del, customerToken, add]);
  const getCustomerId = async () => {
    const res = await createEphemeralKey({
      variables: {
        customerToken,
      },
    });
    setCustomerId(res.data.stripeCreateEphemeralKey.associated_objects[0].id);
    getCards({
      variables: {
        customerToken,
        stripeCustomerToken:
          res.data.stripeCreateEphemeralKey.associated_objects[0].id,
      },
      fetchPolicy: "network-only",
    }).then((response) => {
      if (!isEmpty(response.data)) {
        dispatch(userActions.addCustomerCards(response.data.stripeGetCards));
        setIsLoading(false);
      }
    });
  };

  const handleSubmit = async () => {
    // Block native form submission.
    // event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setIsSaving(true);

    const tokentRes = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
      },
    });
    const res = await saveCard({
      variables: {
        customerToken,
        stripeCustomerToken: customerId,
        ccStripejsToken: `${tokentRes.paymentMethod.id}:${tokentRes.paymentMethod.card.brand}:${tokentRes.paymentMethod.card.last4}`,
        //ccStripejsToken: reso.paymentMethod.id
      },
    });
    if (get(res, "data.stripeSaveCard.error", "") === "1") {
      if(get(res, "data.stripeSaveCard.message", "")) {
        setErrMessage(get(res, "data.stripeSaveCard.message", ""));
      }
      setIsOpen(true);
      setIsSaving(false);
      setName("");
       elements.getElement(CardNumberElement).clear();
       elements.getElement(CardExpiryElement).clear();
       elements.getElement(CardCvcElement).clear();
      return true;
    }
    if(typeof window !== "undefined") {
      if (window.fbq != null) {
        window.fbq('track', 'Add payment info');
      }
    }
    setAdd(!add);
    setName("");
    if (isMobile) {
      setView("payment");
    }
    setErrMessage("");
    setIsSaving(false);
  };

  useEffect(() => {
    if (width <= MOBILE_SIZE) {
      setIsMobile(true);
    }
  }, [width]);

  const deleteCard = (cardId) => {
    deleteCardHandler({
      variables: {
        customerToken,
        stripeCustomerToken: customerId,
        token: cardId,
      },
      fetchPolicy: "no-cache",
    }).then(() => {
      setDel(!del);
    });
  };
  const onCancel = () => {
    setAdd(!add);
    setName("");
    if (isMobile) {
      setView("payment");
    }
  };
  const onClose = () => {
    setIsOpen(!isOpen);
  };
  const formContent = (
    <div className={classes.cards}>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className={classes.addCard}>
            <Typo
              as="h3"
              varinat="h3"
              font="condensed"
              className={classes.title}
            >
              {__("PAYMENT METHODS")}
            </Typo>
            <Button
              type="bordered"
              label={`+ ${__("ADD A NEW CARD")}`}
              classes={{ button_bordered: classes.addCardButton }}
              onClick={() => {
                setView("addNew");
                setAdd(true);
              }}
            />
          </div>
          {customerCards.map((card, index) => {
            const brandIcon = icons[get(card, "brand", "").toLowerCase()];
            return (
              <div key={index} className={classes.customerCard}>
                <div className={classes.about}>
                  {brandIcon ? (
                    <img src={brandIcon} />
                  ) : (
                    <div className={classes.emptyBrand}></div>
                  )}
                  <Typo
                    as="p"
                    variant="p"
                    font="regular"
                    className={classes.ending}
                  >{`${
                    card.brand.charAt(0).toUpperCase() + card.brand.slice(1)
                  } Ending In ${card.last4}`}</Typo>
                </div>
                <Typo
                  color="text"
                  as="p"
                  variant="p"
                  font="regular"
                  className={classes.exp}
                >{`Exp: ${card.exp_year}/${card.exp_month}`}</Typo>
                {index === customerCards.length - 1 && (
                  <Typo
                    color="code"
                    as="p"
                    variant="p"
                    font="regular"
                    className={classes.defaultMethod}
                  >
                    {__("This is your default payment method")}
                  </Typo>
                )}
                <Button
                  type="bordered"
                  label={__("DELETE")}
                  classes={{ button_bordered: classes.deleteButton }}
                  onClick={() => {
                    deleteCard(card.id);
                    setDel(!del);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const form = !add ? (
    formContent
  ) : (
    <AddCard
      name={name}
      setName={setName}
      submit={handleSubmit}
      onCancel={onCancel}
      isSaving={isSaving}
    />
  );
  let desktopView = (
    <section className={classes.body}>
      <div className={classes.tabs}>
        <Tabs active="payment" />
      </div>
      {form}
    </section>
  );
  let content;
  if (isMobile) {
    switch (view) {
      case "tabs":
        content = (
          <div className={classes.tabs}>
            <Tabs active="payment" onClick={() => setView("payment")} />
          </div>
        );
        break;
      case "payment":
        content = (
          <div>
            <div className={classes.backStep} onClick={() => setView("tabs")}>
              <BackStep />
            </div>
            {form}
          </div>
        );
        break;
      case "addNew":
        content = (
          <div>
            <div
              className={classes.backStep}
              onClick={() => setView("payment")}
            >
              <BackStep />
            </div>
            <AddCard
              name={name}
              setName={setName}
              submit={handleSubmit}
              onCancel={onCancel}
              isSaving={isSaving}
            />
          </div>
        );
        break;
      default:
        content = (
          <div className={classes.tabs}>
            <Tabs active="payment" onClick={() => setView("orders")} />
          </div>
        );
        break;
    }
  } else {
    content = desktopView;
  }
  return (
    <div>
      <Head description={STATIC_DESCRIPTION}>Payment method</Head>
      <AppWrapper>
        <div className={classes.root}>{content}</div>
      </AppWrapper>
      <Modal isShown={isOpen} onClose={onClose} className={classes.dialog}>
        <CardError action={onClose} message={errMessage} />
      </Modal>
    </div>
  );
};

export default PaymentMethods;
