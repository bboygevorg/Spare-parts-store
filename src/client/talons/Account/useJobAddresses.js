import {useState, useEffect} from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useAwaitQuery } from 'talons/useAwaitQuery';


export const useJobAddresses = (props) => {
    const {
        getAddressQuery, 
        addAddressMutation,
        updateAddressMutation,
        removeAddressMutation
    } = props;
    const [addresses, setAddresses] = useState([]);
    const getAddress = useAwaitQuery(getAddressQuery);
    const [removeAddress, {loading: removeLoader}] = useMutation(removeAddressMutation);
    const [addAddress, { loading: addLoader}] = useMutation(addAddressMutation);
    const [updateAddress, { loading: updateLoader}] = useMutation(updateAddressMutation);
    const [edit, setEdit] = useState(false);
    const [editedAddress, setEditedAddress] = useState({});
    const [add, setAdd] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [getAddressLoader, setAddressLoader] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => { setShowModal(false); setCurrentAddress()}
    const deleteAddress = async () => {
        const res = await removeAddress({variables: {customerToken: localStorage.getItem('customerToken'), addressId: currentAddress}});
        if(res && res.data.removeCustomerAddress) {
            const arr = [...addresses];
            const newAddresses = arr.filter(el => el.id !== currentAddress)
            setAddresses(newAddresses)
            setCurrentAddress();
        }
    };
    useEffect(() => {
        if(localStorage.getItem('customerToken')) {
            setAddressLoader(true)
            getAddress(
                {
                    variables: {customerToken: localStorage.getItem('customerToken')},
                    fetchPolicy: "network-only"
                }
            ).then(res => {setShowInfo(true); setAddressLoader(false); setAddresses(res.data.getCustomerAddressBook)})
        }
    },[edit, add, addAddress]);

    return {
        addresses,
        addLoader,
        getAddressLoader,
        setAddresses,
        addAddress,
        updateAddress,
        updateLoader,
        edit,
        setEdit,
        editedAddress,
        setEditedAddress,
        add,
        setAdd,
        showInfo,
        setShowInfo,
        deleteAddress,
        removeLoader,
        showModal,
        handleShowModal,
        handleCloseModal,
        currentAddress,
        setCurrentAddress
    };
};