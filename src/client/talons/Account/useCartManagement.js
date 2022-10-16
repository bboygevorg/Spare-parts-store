import { useState, useCallback, useEffect, useMemo } from "react";
import useTranslation from "talons/useTranslation";
import useWindowDimensions from "talons/useWindowDimensions";
import { GET_RELATED_CUSTOMERS } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { useHistory } from "react-router-dom";
import { GET_CART_TEMPLATES, COMPANY_GET_USER_CART } from "api/query";
import { COMPANY_ADD_ITEM_TO_CART, COMPANY_REMOVE_ITEM_FROM_CART, COMPANY_UPDATE_ITEM_FROM_CART, TRUNCATE_CUSTOMER_CART } from 'api/mutation';
import { useMutation } from "@apollo/react-hooks";
import { actions } from "store/actions/signIn";
import { useDispatch } from "react-redux";
import getZoneCode from "../../../helper/getZoneCode";

export const useCartManagement = () => {
    const __ = useTranslation();
    const history = useHistory();
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const [view, setView] = useState("carts");
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const [isFetchingCart, setIsFetchingCart] = useState(false);
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [users, setUsers] = useState([]);
    const [openedUser, setOpenedUser] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState([{all: false, page: 1, items: []}]);
    const [currentPageInfo, setCurrentPageInfo] = useState({});
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [isOpenTemplates, setIsOpenTemplates] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const customerToken = typeof window !== "undefined" ? localStorage.getItem("customerToken") : "";
    const getRelatedUsers = useAwaitQuery(GET_RELATED_CUSTOMERS);
    const getCartTemplates = useAwaitQuery(GET_CART_TEMPLATES);
    const getCustomerCart = useAwaitQuery(COMPANY_GET_USER_CART);
    const [addItemToCart, { loading: addingItemLoading }] = useMutation(COMPANY_ADD_ITEM_TO_CART);
    const [removeItemFromCart, { loading: removingItemLoading }] = useMutation(COMPANY_REMOVE_ITEM_FROM_CART);
    const [updateItemFromCart, { loading: updateItemLoading }] = useMutation(COMPANY_UPDATE_ITEM_FROM_CART);
    const [truncateCart, { loading: removingAllItems }] = useMutation(TRUNCATE_CUSTOMER_CART);

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
                    let data = [...res.data.companyGetCompanyRelatedCustomers];
                    const ownerIndex = data.findIndex(el => el.role == 4);
                    data.splice(ownerIndex, 1);
                    setUsers(data);
                    setIsFetchingUsers(false);
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

    const handleGetTemplates = useCallback(async () => {
        setIsFetchingTemplates(true);
        try {
            const res = await getCartTemplates({
                variables: {
                    customerToken
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetRelatedCartTemplates) {
                setIsFetchingTemplates(false);
                setTemplates(res.data.companyGetRelatedCartTemplates);
            }
        } catch(err) {
            setIsFetchingTemplates(false);
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }, [customerToken]);

    const allSelectedItems = useMemo(() => {
        let arr = [];
        if(itemsPerPage.length) {
            itemsPerPage.map(el => {
                if(el.items && el.items.length) {
                    el.items.map(item => arr.push({
                        sku: item.objectID,
                        qty: item.qty || 1
                    }));
                }
            })
        }
        return arr;
    }, [itemsPerPage]);

    const handleAddItemsToCart = async () => {
        let data = [];
        if(selectedTemplate && selectedTemplate.selectedItems && selectedTemplate.selectedItems.length) {
            const arr = selectedTemplate.selectedItems.map(el => {
                return {
                    sku: el.sku,
                    qty: el.qty
                }
            })
            data = [...data, ...arr];
        }
        if(allSelectedItems && allSelectedItems.length) {
            data = [...data, ...allSelectedItems];
        }
        try {
            const res = await addItemToCart({
                variables: {
                    customerId: parseInt(openedUser.id), 
                    customerToken,
                    cartToken: openedUser.cart.cartToken, 
                    cartItems: data,
										zoneCode: getZoneCode()
                },
                fetchPolicy: "no-cache"
            })
            if(res && res.data && res.data.companyAddItemToCustomerCart) {
                if(isOpenSearch) {
                    setIsOpenSearch(false);
                    setItemsPerPage([{all: false, page: 1, items: []}]);
                }
                if(isOpenTemplates) {
                    setIsOpenTemplates(false);
                }
                let arr = [...users];
                const index = arr.findIndex(el => el.id === openedUser.id);
                arr[index] = {...openedUser, cart: res.data.companyAddItemToCustomerCart};
                setUsers(arr);
                setOpenedUser({...openedUser, cart: res.data.companyAddItemToCustomerCart});
            }
        } catch (err) {
            console.log('err', err)
        }
    }

    const handleRemoveItem = async (id) => {
        try {
            const res = await removeItemFromCart({
                variables: {
                    customerToken, 
                    customerId: parseInt(openedUser.id), 
                    cartToken: openedUser.cart.cartToken,
                    itemId: id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyRemoveItemFromCustomerCart) {
                let arr = [...users];
                const index = arr.findIndex(el => el.id === openedUser.id);
                arr[index] = {...openedUser, cart: res.data.companyRemoveItemFromCustomerCart};
                setUsers(arr);
                setOpenedUser({...openedUser, cart: res.data.companyRemoveItemFromCustomerCart});
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const handleTruncateCart = async () => {
        try {
            const res = await truncateCart({
                variables: {
                    customerToken,
                    customerId: parseInt(openedUser.id),
                    cartToken: openedUser.cart.cartToken,
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyTruncateCustomerCart) {
                let arr = [...users];
                const index = arr.findIndex(el => el.id === openedUser.id);
                arr[index] = {...openedUser, cart: res.data.companyTruncateCustomerCart};
                setUsers(arr);
                setOpenedUser({...openedUser, cart: res.data.companyTruncateCustomerCart});
            }
        }
        catch (err) {
            console.log('err', err);
        }
    }

    const handleGetUserCart = async (user) => {
        setIsFetchingCart(true);
        try {
            const cartRes = await getCustomerCart({
                variables: {
                    customerToken,
                    customerId: parseInt(user.id)
                },
                fetchPolicy: "no-cache"
            });
            if(cartRes && cartRes.data && cartRes.data.companyGetCustomerCart) {
                setIsFetchingCart(false);
                const updatedData = {...user, cart: cartRes.data.companyGetCustomerCart};
                setOpenedUser(updatedData);
            }
        } catch (err) {
            setIsFetchingCart(false);
            console.log('err', err);
        }
    }

    useEffect(() => {
        if(customerToken) {
            getRelatedCustomers();
        }
    }, []);

    useEffect(() => {
        if(isOpenTemplates && customerToken && !templates.length) {
            handleGetTemplates();
        }
    }, [isOpenTemplates]);

    return {
        __,
        width,
        view,
        setView,
        isFetchingUsers,
        users,
        setUsers,
        openedUser,
        setOpenedUser,
        itemsPerPage,
        setItemsPerPage,
        currentPageInfo,
        setCurrentPageInfo,
        isOpenSearch,
        setIsOpenSearch,
        isOpenTemplates,
        setIsOpenTemplates,
        templates,
        handleAddItemsToCart,
        addingItemLoading,
        handleRemoveItem,
        removingItemLoading,
        updateItemFromCart,
        updateItemLoading,
        selectedTemplate,
        setSelectedTemplate,
        handleTruncateCart,
        removingAllItems,
        isFetchingCart,
        handleGetUserCart,
        isFetchingTemplates
    }
};