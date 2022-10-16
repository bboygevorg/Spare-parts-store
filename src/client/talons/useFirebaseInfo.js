import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import get from 'lodash/get'
const PHONE_KEY = "support_phone_number";
const TEXT_KEY = "support_text_number";
const useFirebaseInfo = () => {
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const firebaseObj = useSelector(state => state.firebase.config);
  useEffect(() => {
    const phoneValue = get(firebaseObj, PHONE_KEY , '');
    const textValue = get(firebaseObj, TEXT_KEY, '')
    const modifiedPhone = phoneValue && `${phoneValue.slice(2,5)}-${phoneValue.slice(5,8)}-${phoneValue.slice(8)}`;
    const modifiedText = textValue && `${textValue.slice(2,5)}-${textValue.slice(5,8)}-${textValue.slice(8)}`;
    setPhone(modifiedPhone);
    setText(modifiedText);

  }, [firebaseObj]);
  return { phone, text };
};

export default useFirebaseInfo;
