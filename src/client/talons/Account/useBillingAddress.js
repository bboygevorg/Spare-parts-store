import {useMutation } from '@apollo/react-hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAwaitQuery } from 'talons/useAwaitQuery';

export const useBillingAddress = props => {
    const {updateAddressMutation, getCustomerDefaultBilling, addAddressMutation } = props;
    const [defaultBilling, setDefaultBilling] = useState({});
    const [addAddress] = useMutation(addAddressMutation);
    const getDefaultBilling = useAwaitQuery(getCustomerDefaultBilling);
    const [updateAddress] = useMutation(updateAddressMutation);
    const customerData = useSelector(state => state.signin.customerData);

    useEffect(() => {
        if(localStorage.getItem('customerToken')) {
            getBillingAddress();
        }
    },[]);

    const getBillingAddress = async () => {
        const response = await getDefaultBilling({variables: {customerToken: localStorage.getItem('customerToken')}});
        if(response && response.data && response.data.getCustomerDefaultBilling) {
            setDefaultBilling(response.data.getCustomerDefaultBilling);
        }
    }

    return {
        updateAddress,
        customerData,
        data: defaultBilling,
        addAddress
    }
}