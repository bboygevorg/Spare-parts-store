import { GET_RELATED_CUSTOMERS, GET_CUSTOMER_CARDS } from 'api/query';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { CHANGE_CUSTOMER_ROLE, CHANGE_ACCOUNT_STATUS, DETACH_USER_CARD } from 'api/mutation';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import useTranslation from 'talons/useTranslation';
import { useMutation } from "@apollo/react-hooks";
import useWindowDimensions from 'talons/useWindowDimensions';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from "store/actions/signIn";

export const useUserManagement = () => {
    const __ = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [view, setView] = useState("users");
    const [selectedUserCards, setSelectedUserCards] = useState([]);
    const [shouldGetCards, setShouldGetCards] = useState();
    const { width } = useWindowDimensions();
    const getRelatedUsers = useAwaitQuery(GET_RELATED_CUSTOMERS);
    const getUserCards = useAwaitQuery(GET_CUSTOMER_CARDS);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const [isFetchingUserCards, setIsFetchingUserCards] = useState(false);
    const [changeRole, { loading: roleChanging }] = useMutation(CHANGE_CUSTOMER_ROLE);
    const [changeStatus, { loading: statusChanging }] = useMutation(CHANGE_ACCOUNT_STATUS);
    const [detachUserCard, { loading: detachLoading }] = useMutation(DETACH_USER_CARD);
    const customerToken = typeof window !== "undefined" ? localStorage.getItem("customerToken") : "";
    const companyRole = useSelector(state => state.signin.customerData.companyRole);

    const getRelatedCustomers = useCallback(async () => {
        if(customerToken) {
            try {
                setIsFetchingUsers(true);
                const res = await getRelatedUsers({
                    variables: {
                        customerToken
                    },
                    fetchPolicy: "no-cache",
                });
                if(res && res.data && res.data.companyGetCompanyRelatedCustomers) {
                    setIsFetchingUsers(false);
                    setUsers(res.data.companyGetCompanyRelatedCustomers);
                }
            } catch (err) {
                setIsFetchingUsers(false);
                const parseError = JSON.parse(JSON.stringify(err));
                const code = parseError && parseError.graphQLErrors[0].code;
                if(code === 0) {
                    dispatch(actions.signOut());
                    history.replace("/signin", { state: { previousPath: history.location.pathname }});
                }
            }
        }
    }, [customerToken]);

    const changeCustomerRole = async (id, role) => {
        try {
            const res = await changeRole({
                variables: {
                    customerToken,
                    id,
                    role
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyChangeRelatedCustomerRole) {
                getRelatedCustomers();
            }
        } catch(err) {
            console.log('err', err)
        }
    }

    const changeCustomerStatus = async (id, status) => {
        const res = await changeStatus({
            variables: {
                customerToken,
                id,
                status
            },
            fetchPolicy: "no-cache"
        });
        if(res && res.data && res.data.companyChangeRelatedCustomerAccountStatus) {
            getRelatedCustomers();
        }
    }

    const getCustomerCards = async (id) => {
        setIsFetchingUserCards(true);
        try {
            const res = await getUserCards({
                variables: {
                    customerToken,
                    customerId: id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetRelatedCustomerCards) {
                setSelectedUserCards(res.data.companyGetRelatedCustomerCards);
                setIsFetchingUserCards(false);
                setShouldGetCards();
            }
        } catch(err) {
            setIsFetchingUserCards(false);
            setShouldGetCards();
            console.log('err', err);
        }
    }

    const handleDetachUserCard = async (id, userId) => {
        try {
            const res = await detachUserCard({
                variables: {
                    customerToken,
                    cardId: id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyDetachCardFromUser) {
                setShouldGetCards(userId);
            }
        } catch (err) {
            console.log('err', err)
        }
    }

    useEffect(() => {
        if(customerToken) {
            getRelatedCustomers();
        }
    }, []);

    useEffect(() => {
        if(shouldGetCards) {
            getCustomerCards(shouldGetCards);
        }
    }, [shouldGetCards]);

    return {
        __,
        users,
        changeCustomerRole,
        roleChanging,
        changeCustomerStatus,
        statusChanging,
        view,
        setView,
        width,
        companyRole,
        isFetchingUsers,
        getCustomerCards,
        isFetchingUserCards,
        selectedUserCards,
        setShouldGetCards,
        handleDetachUserCard,
        detachLoading
    }
}