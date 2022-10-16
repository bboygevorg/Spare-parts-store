// import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback, useMemo } from "react";
// import { checkoutActions } from 'actions/checkout';
import { GET_CUSTOMER_ADDRESS } from "api/query";
import { getAddressesFullfield } from "actions/checkoutNew";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { separateProductTypes } from 'helper/utils';
import orderBy from 'lodash/orderBy';
// import get from 'lodash/get';

export const useAddressStep = () => {
  const signin = useSelector((state) => state.signin);
  // const checkout = useSelector(state => state.checkout)
  // const { deliveryAddressId } = checkout
  const dispatch = useDispatch();
  const { customerData } = signin;
  const { customerToken } = customerData;
  const { cartData } = signin;
  const getAddresses = useAwaitQuery(GET_CUSTOMER_ADDRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [instants, setInstants] = useState([]);
  const [others, setOthers] = useState([]);
  // const [maxDeliveryOption, setMaxDeliveryOption] = useState();
  // const [addNewAddressMutation] = useMutation(addAddressMutation)
  // const [getDefaultBilling, {data: defaultBilling,loading: gettingBillingAddress} ] = useLazyQuery(getDefaultBillingAddressQuery)
  // const setStep = useCallback((step) => dispatch(checkoutActions.setStep(step)))
  // const setDeliveryAddressId = useCallback((id) => dispatch(checkoutActions.setDeliveryAddressId(id)))
  // const setBillingAddressId = useCallback((id) => dispatch(checkoutActions.setBillingAddressId(id)))
  //   const [addresses, setAddresses] = useState([]);
  const addresses = useSelector((state) => state.checkoutNew.addresses);
  const maxDelivery = useMemo(() => {
    if(others.length) {
      const arr = orderBy(others, ["deliveryOption"], ["desc"]);
      if(arr.length) {
        return arr[0].deliveryOption;
      }
    }
  }, [cartData, others])
  useEffect(() => { 
      fetchAddresses(); 
  }, [customerToken]);
  useEffect(() => { 
    if(cartData && cartData.items && cartData.items.length) {
      const separated = separateProductTypes(cartData.items);
      setInstants(separated && separated.instants);
      setOthers(separated && separated.others);
    }
}, [cartData, separateProductTypes]);
   
  useEffect(() => {
    fetchAddresses();
  }, []);
  const fetchAddresses = useCallback(() => {
    if(customerToken) {
      setIsLoading(true);
      getAddresses({
        variables: { customerToken: customerToken },
        fetchPolicy: "network-only",
      }).then((res) => {
        dispatch(getAddressesFullfield(res.data.getCustomerAddressBook));
        setIsLoading(false);
        setIsOpen(false);
      });
    }
  }, [customerToken]);

  const setAddresses = (data) => {
    dispatch(getAddressesFullfield(data));
  };

  //   useEffect(() => {
  //     if (addressBook && addressBook.getCustomerAddressBook) {
  //       //   setAddresses(addressBook.getCustomerAddressBook);

  //       dispatch(getAddressesFullfield(addressBook.getCustomerAddressBook));
  //     }
  //   }, [ ]);

  // useEffect(() => {
  //     if(customerToken) {
  //         getDefaultBilling({ variables: { customerToken: customerToken }})
  //     }
  // }, [customerToken, addressBook])

  return {
    // addNewAddressMutation,
    // customerToken,
    // addNewAddress: setAddresses,
    // setDeliveryAddressId,
    addresses,
    setAddresses,
    // deliveryAddressId,
    // setBillingAddressId,
    // setStep,
    isLoading,
    isOpen,
    toggleOpen: () => setIsOpen(!isOpen),
    setIsOpen,
    fetchAddresses,
    instants,
    others,
    maxDelivery
    // gettingBillingAddress,
    // billingAddress: get(defaultBilling, 'getCustomerDefaultBilling', {})
  };
};
