import { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { CREATE_EPHEMERAL_KEY, SAVE_CARD, ATTACH_USER_CARD } from "../graphql/mutation";
import { GET_CARDS } from "api/query";
import { userActions } from "actions/user";
import { clearStorage, storage } from "helper/utils";
import {
  useStripe,
  CardNumberElement,
  useElements,
} from "@stripe/react-stripe-js";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useAwaitQuery } from "./useAwaitQuery";
import { setCurrentStep } from "actions/checkoutNew";
import { STORAGE_STEP_DATA_KEY } from "conf/consts";
import { actions } from "store/actions/signIn";

export const useCards = (props) => {
  const [name, setName] = useState("");
  const [isOpenCardError, setIsOpenCardError] = useState(false);
  const [ephemeralKey, setEphemeralKey] = useState("");
  const [cardsLoading, setCardsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const cards = useSelector((state) => state.signin.customerCards);
  const [createEphemeralKey] = useMutation(CREATE_EPHEMERAL_KEY);
  const [attachCard] = useMutation(ATTACH_USER_CARD);
  const getUserCards = useAwaitQuery(GET_CARDS);
  const [saveCard] = useMutation(SAVE_CARD);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmiting, setIsSubmiting] = useState(false)
  const createEphemeral = async () => { 
    try {
       const res = await createEphemeralKey({
        variables: {
          customerToken: storage("customerToken"),
        },
      });
      setEphemeralKey(res.data.stripeCreateEphemeralKey);
      return res.data.stripeCreateEphemeralKey
    } catch (err) {
      dispatch(actions.deleteCartData());
      clearStorage("cartData");
      clearStorage("cartToken");
      clearStorage(STORAGE_STEP_DATA_KEY);
      dispatch(setCurrentStep(0));
    }
   
  };

  useEffect(() => {
    createEphemeral();
  }, []);

  useEffect(() => {
    if (!isEmpty(ephemeralKey) && ephemeralKey.associated_objects[0].id) {
      getCards();
    }
  }, [ephemeralKey]);
  const onClose = () => {
    setIsOpenCardError(!isOpenCardError)
  }
  const getCards = async () => {
    setCardsLoading(true);
    getUserCards({
      variables: {
        customerToken: storage("customerToken"),
        stripeCustomerToken: ephemeralKey.associated_objects[0].id,
      },
      fetchPolicy: "network-only",
    }).then(res => {
        if (!isEmpty(res.data)) {
          dispatch(userActions.addCustomerCards(res.data.stripeGetCards));
          setCardsLoading(false);
          setIsOpen(false);
        }
    }).catch(() => setCardsLoading(false))
  };
  
  const addNewCard = async () => {
    // event.persist();

    setIsSubmiting(true);
    window.scrollTo(0, 0);
    await createEphemeral();
    const customerId = ephemeralKey.associated_objects[0].id;
    // Block native form submission.
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    const tokenRes = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
      },
    });
    if(props && props.id) {
      const res = await attachCard({
        variables: {
          customerToken: storage("customerToken"),
          customerId: props.id, 
          ccStripejsToken: `${tokenRes.paymentMethod.id}:${tokenRes.paymentMethod.card.brand}:${tokenRes.paymentMethod.card.last4}`,
        },
        fetchPolicy: "no-cache"
      });
      if (get(res, "data.companyAttachCardToUser.error", "") === "1") {
        if(get(res, "data.companyAttachCardToUser.message", "")) {
          setErrMessage(get(res, "data.companyAttachCardToUser.message", ""));
        }
        setIsSubmiting(false);
        onClose();
        return false;
      }
      setErrMessage("");
      if(isOpenCardError) {
        onClose();
      }
      setName("");
      setIsSubmiting(false);
      props.setCustomerId(props.id);
      props.setIsOpenAdd(false);
      return;
    }
    const res = await saveCard({
      variables: {
        customerToken: storage("customerToken"),
        stripeCustomerToken: customerId,
        ccStripejsToken: `${tokenRes.paymentMethod.id}:${tokenRes.paymentMethod.card.brand}:${tokenRes.paymentMethod.card.last4}`,
      },
    });
    if (get(res, "data.stripeSaveCard.error", "") === "1") {
      if(get(res, "data.stripeSaveCard.message", "")) {
        setErrMessage(get(res, "data.stripeSaveCard.message", ""));
      }
      setIsSubmiting(false);
      setIsOpen(true);
      onClose();
      setName('')

      return false;
    } 
    if(typeof window !== "undefined") {
      if (window.fbq != null) {
        window.fbq('track', 'Add payment info');
      }
    }
    getCards();
    setErrMessage("");
    setIsSubmiting(false);
    setIsOpen(false);
  };

  return {
    ephemeralKey,
    createEphemeral,
    getCards,
    isLoading: cardsLoading,
    cards,
    isOpen,
    addNewCard,
    isSubmiting,
    toggleOpen: () => setIsOpen(!isOpen),
    setIsOpen,
    name,
    setName,
    onClose,
    isOpenCardError,
    errMessage
  };
};
