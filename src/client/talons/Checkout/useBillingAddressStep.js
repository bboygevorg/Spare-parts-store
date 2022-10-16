import { useMutation } from "@apollo/react-hooks";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { setBillingAddress } from "actions/checkoutNew";
import { storage } from "helper/utils";
import { ADD_ADDRESS, SET_CUSTOMER_DEFAULT_BILLING } from "api/mutation";
import { getAddressesFullfield } from "actions/checkoutNew";

// import { checkoutActions, getBillingAddress } from "actions/checkout";
import { GET_CUSTOMER_DEFAULT_BILLING, GET_CUSTOMER_ADDRESS } from "api/query";
import { isEmpty } from "lodash";
export const useBillingAddressStep = () => {
  const [defaultNotExists, setDefaultNotExists] = useState(false);
  //   const { getDefaultBillingAddressQuery, addNewAddressMutation } = props;
  // const { customerData } = useSelector(state => state.signin)
  // const checkout = useSelector(state => state.checkout)

	const [setCustomerDefaultBilling] = useMutation(SET_CUSTOMER_DEFAULT_BILLING);
  const billingAddress = useSelector(
    (state) => state.checkoutNew.billingAddress
  );
  const addresses = useSelector((state) => state.checkoutNew.addresses);

    //   const isLoading = useSelector(state => state.checkoutNew.isLoading)
  // const { billingAddress } = checkout
  // const { customerToken } = customerData
  const getDefaultBilling = useAwaitQuery(GET_CUSTOMER_DEFAULT_BILLING);
  const [isLoading, setIsLoading] = useState(false);
  const [addAddress] = useMutation(ADD_ADDRESS);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const getAddresses = useAwaitQuery(GET_CUSTOMER_ADDRESS);

  const fetchAddresses = useCallback(() => {
    if(storage("customerToken")) {
      setIsLoading(true);
      getAddresses({
        variables: { customerToken: storage("customerToken") },
        fetchPolicy: "network-only",
      }).then((res) => {
        dispatch(getAddressesFullfield(res.data.getCustomerAddressBook));
        setIsLoading(false);
        setIsOpen(false);
      });
    }
  }, []);

  const getBillingAddress = () => {
    setIsLoading(true);
    getDefaultBilling({
      fetchPolicy: "network-only",
      variables: {
        customerToken: storage("customerToken"),
      },
    })
      .then((res) => {
        setIsLoading(false);
        dispatch(setBillingAddress(res.data.getCustomerDefaultBilling));
      })
      .catch(() => {
        setIsLoading(false);
        setDefaultNotExists(true);
      });
  };

  useEffect(() => {
    // if (isEmpty(billingAddress)) {
      getBillingAddress();
    // }
  }, []);
  const addBillingAddress = (address) => {
		setIsLoading(true)
		setCustomerDefaultBilling({
			variables: {
				customerToken: storage("customerToken"),
				addressId: address.id
			}
		}).then(() => {
      setIsLoading(false)
			dispatch(setBillingAddress(address))
		}).catch((err) => {
			setIsLoading(false)
			console.log(err);
		})
  };
  // const setBillingAddress = useCallback(async (address) => {

  //  await dispatch(checkoutActions.setBillingAddress(address))
  //     dispatch(getBillingAddress(getDefaultBilling))
  // }, [checkoutActions.setBillingAddress, dispatch])

  // // useEffect(() => {
  // //     dispatch(getBillingAddress(getDefaultBilling))
  // // }, [setBillingAddress])

  const billingAddressInfform = useMemo(() => {
    if (isEmpty(billingAddress)) {
      return {};
    } else {
      return {
        country: get(billingAddress, ["country", "name"], ""),
        id: get(billingAddress, ["id"], ""),
        city: get(billingAddress, ["city"], ""),
        region: get(billingAddress, ["region", "name"], ""),
        street: get(billingAddress, ["street"], []).join(","),
        zipCode: get(billingAddress, ["postcode"], ""),
        firstname: get(billingAddress, ["firstname"], ""),
        lastname: get(billingAddress, ["lastname"], ""),
      };
    }
  }, [billingAddress]);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  // console.log("UPDATED BIILING ADRESSS", billingAddress)
  // return {
  //     billingAddressInform,
  //     addAddress,
  //     customerToken,
  //     addBillingAddress,
  //     isOpen,
  //     toggleOpen
  // }

  return {
    defaultNotExists,
    billingAddress: billingAddressInfform,
    addAddress,
    isLoading,
    isOpen,
    setIsOpen,
    toggleOpen,
    addresses,
    fetchAddresses,
    addBillingAddress,
    getBillingAddress,
  };
};
