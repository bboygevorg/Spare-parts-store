import { useEffect, useCallback, useState } from 'react'
import { GET_PENDING_ORDERS, GET_COMPANY_ORDERS, GET_PAYMENT_INTENT } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery'
import { actions } from "store/actions/signIn";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { storage, clearStorage } from "helper/utils";
import { CONFIRM_SHOPPER_ORDER_REQUEST } from 'api/mutation';
import { useMutation } from "@apollo/react-hooks";
import { codeSplitter } from 'components/Link';

export const useAllOrders = props => {
    const { setOpenedOrder, setView } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const fetchPendingOrders = useAwaitQuery(GET_PENDING_ORDERS);
    const fetchCompanyOrders = useAwaitQuery(GET_COMPANY_ORDERS);
    const getPaymentIntent = useAwaitQuery(GET_PAYMENT_INTENT);
    const [confirmShopperOrder] = useMutation(CONFIRM_SHOPPER_ORDER_REQUEST);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [placedOrders, setPlacedOrders] = useState([])
    const [fetchingPending, setFetchingPending] = useState(false);
    const [fetchingAll, setFetchingAll] = useState(false);
    const [currentPagePending, setCurrentPagePending] = useState(1);
    const [totalPagesPending, setTotalPagesPending] = useState();
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const [totalPagesAll, setTotalPagesAll] = useState();
    const [shouldGetOrders, setShouldGetOrders] = useState(false);
    const [stripeLoad, setStripeLoad] = useState(false);
    const [approve3dError, setApprove3dError] = useState("");
    const [approve3dSuccess, setApprove3dSuccess] = useState("");
    const customerToken = typeof window !== "undefined" && localStorage.getItem('customerToken');
    const { companyRole } = useSelector(state => state.signin.customerData);
    const localeId = useSelector(state => state.language.currentLanguage);

    useEffect(() => {
        handleFetchPendingOrders();
        handleFetchPlacedOrders();
        return () => {
            if(storage("changedOrderId")) {
                clearStorage("changedOrderId");
            }
        }
    }, []);

    useEffect(() => {
        handleFetchPendingOrders();
    }, [currentPagePending]);

    useEffect(() => {
        handleFetchPlacedOrders();
    }, [currentPageAll]);

    useEffect(() => {
        if(shouldGetOrders) {
            handleFetchPendingOrders();
            handleFetchPlacedOrders();
        }
    }, [shouldGetOrders]);

    const handleFetchPendingOrders = async () => {
        const pageSize = 5;
        setFetchingPending(true);
        try {
            const res = await fetchPendingOrders({
                variables: {
                    customerToken,
                    pageSize,
                    currentPage: currentPagePending,
                    sortOrders: [{ field: "created_at", direction: "desc" }]
                },
                fetchPolicy: "no-cache",
            });
            if(res && res.data && res.data.companyGetShopperOrderRequests && res.data.companyGetShopperOrderRequests.items) {
                if(shouldGetOrders) {
                    setShouldGetOrders(false);
                }
                dispatch(actions.setPendingOrderCount(res.data.companyGetShopperOrderRequests.totalCount));
                setPendingOrders(res.data.companyGetShopperOrderRequests.items);
                setTotalPagesPending(Math.ceil(res.data.companyGetShopperOrderRequests.totalCount / pageSize))
                setFetchingPending(false);
            }
        } catch (err) {
            if(shouldGetOrders) {
                setShouldGetOrders(false);
            }
            setFetchingPending(false);
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }

    const handleFetchPlacedOrders = async () => {
        if(companyRole === 1) {
            return;
        }
        const pageSize = 10;
        setFetchingAll(true);
        try {
            const res = await fetchCompanyOrders({
                variables: {
                    customerToken,
                    pageSize,
                    currentPage: currentPageAll,
                    sortOrders: [{ field: "created_at", direction: "desc" }]
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetRelatedCustomerOrders && res.data.companyGetRelatedCustomerOrders.items) {
                setPlacedOrders(res.data.companyGetRelatedCustomerOrders.items);
                setTotalPagesAll(Math.ceil(res.data.companyGetRelatedCustomerOrders.totalCount / pageSize))
                setFetchingAll(false);
            }

        } catch (err) {
            setFetchingAll(false);
            setFetchingPending(false);
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }

    const getOrderDetails = useCallback((id) => {
        const order = [...pendingOrders, ...placedOrders].find(e => e.id === id)
        setOpenedOrder(order || {})
    }, [pendingOrders, placedOrders]);
    
    const handleCloseMessageModal = () => {
        if(approve3dError) {
            setApprove3dError("");
        }
        else {
            setApprove3dSuccess("");
        }
        clearStorage("orderId");
        clearStorage("orderRequestId");
        setShouldGetOrders(true);
        setView("orders");
    }

    const handleGetPaymentIntent = async (id) => {
        setStripeLoad(true);
        const res = await getPaymentIntent({
            variables: {
                customerToken: storage("customerToken"),
                intentId: id
            },
            fetchPolicy: "no-cache"
        });     
        if(res && res.data && res.data.stripeGetPaymentIntent) {
            if(res.data.stripeGetPaymentIntent.status) {
                const orderId = localStorage.getItem("orderId");
                const orderRequestId = localStorage.getItem("orderRequestId");
                await confirmShopperOrder({
                    variables: {
                        customerToken: storage("customerToken"),
                        orderId: parseInt(orderId),
                        orderRequestId: parseInt(orderRequestId),
                        paymentStatus: res.data.stripeGetPaymentIntent.status
                    },
                    fetchPolicy: "no-cache"
                });
                if(res.data.stripeGetPaymentIntent.status === "succeeded") {
                    setStripeLoad(false);
                    setApprove3dSuccess("Approved!");
                }
                else {
                    setStripeLoad(false);
                    setApprove3dError("3d authentication failed.");
                }
            }
        }
    }

    useEffect(() => {
        const intentId = new URLSearchParams(window.location.search).get("payment_intent");
        if(intentId) {
            handleGetPaymentIntent(intentId);
            if(localeId === "default") {
                history.replace(history.location.pathname);
            }
            else {
                history.replace(`${history.location.pathname}${codeSplitter(localeId)}`);
            }   
        }
    }, []);

    return {
        pendingOrders,
        placedOrders,
        getOrderDetails,
        fetchingPending,
        fetchingAll,
        currentPagePending,
        setCurrentPagePending,
        totalPagesPending,
        setShouldGetOrders,
        totalPagesAll,
        currentPageAll,
        setCurrentPageAll,
        stripeLoad,
        setStripeLoad,
        approve3dError,
        approve3dSuccess,
        handleCloseMessageModal
    }
}