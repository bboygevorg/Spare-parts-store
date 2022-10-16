import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const CHECKOUT_NOTE_KEY = "legal_info_text_long";
const useCheckoutNotes = () => {
  const [checkoutNotes, setCheckoutNotes] = useState([]);
  const firebaseObj = useSelector(state => state.firebase.config);
  useEffect(() => {
    setCheckoutNotes(firebaseObj[CHECKOUT_NOTE_KEY].split("||"));
  }, []); 
  return { checkoutNotes };
};

export default useCheckoutNotes;
