import { useState, useCallback, useMemo, useEffect } from 'react'
import { getArrivalDate } from 'helper/utils';
import { useDispatch, useSelector } from 'react-redux';
import { REJECT_ORDER_REQUEST, APPROVE_ORDER_REQUEST, UPDATE_ORDER_REQUEST, DELETE_ORDER_REQUEST, PENDING_REQUEST_REORDER, REMOVE_FROM_CART } from 'api/mutation';
import { GET_CART_TEMPLATES } from "api/query";
import { useMutation } from "@apollo/react-hooks";
import { months } from './useAccountOrder';
import isEmpty from 'lodash/isEmpty';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { actions } from "store/actions/signIn";
import { codeSplitter } from 'components/Link';
import { useHistory } from 'react-router-dom';

export const useShopperOrder = ({ order, getOrderDetails, setShouldGetOrders, setView }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState("");
    const [isOpenReject, setIsOpenReject] = useState(false);
    const [rejected, setRejected] = useState({});
    const [message, setMessage] = useState("");
    const [changingOrder, setChangingOrder] = useState({});
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState([{all: false, page: 1, items: []}]);
    const [currentPageInfo, setCurrentPageInfo] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [isOpenTemplates, setIsOpenTemplates] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenReorderModal, setIsOpenReorderModal] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const [submittingClear, setSubmittingClear] = useState(false);
    const [approveError, setApproveError] = useState("");
    const [isApprove, setIsApprove] = useState(false);
    const [rejectOrder, { loading: rejectLoading }] = useMutation(REJECT_ORDER_REQUEST);
    const [approveOrder, { loading: approveLoading}] = useMutation(APPROVE_ORDER_REQUEST);
    const [updateOrder, { loading: updateLoading }] = useMutation(UPDATE_ORDER_REQUEST);
    const [deleteOrder, { loading: deleteLoading }] = useMutation(DELETE_ORDER_REQUEST);
    const [reorder, { loading: reorderLoading }] = useMutation(PENDING_REQUEST_REORDER);
    const [removeFromCart] = useMutation(REMOVE_FROM_CART);
    const getCartTemplates = useAwaitQuery(GET_CART_TEMPLATES);
    const { customerToken } = useSelector(state => state.signin.customerData);
    const { cartData } = useSelector(state => state.signin);
    const localeId = useSelector(state => state.language.currentLanguage);
    const { items, requestStatus, totals, shippingAddress, billingAddress, customer, requestCreatedAt, requestPayment, requestServiceOrderInformation, id } = order;

    const getExpires = (date) => {
        const newDate = new Date(date.replace(/-/g, "/"));
        const year = newDate.getFullYear();
        const day = newDate.getDate();
        const monthIndex = newDate.getMonth();
        const month = months[monthIndex];
        return `${day} ${month} ${year}`;
    }

    const handleOpen = useCallback(() => {
        setIsOpen(!isOpen)
    }, [isOpen]);
    
    const timeFormat = (first) => {
        if(first) {
            const date = new Date((typeof date === "string" ? new Date(first.replace(/-/g, "/")) : first.replace(/-/g, "/")));
            const deliveryDate = getArrivalDate(date);
            if(typeof date !== "string" && first.split(" ").length && first.split(" ")[1] === "00:00:00")  {
                return deliveryDate;
            }
            const time1 = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const sumRange = date.setMinutes(date.getMinutes() + 30); // timestamp
            const time2 = new Date(sumRange).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return `${deliveryDate}, ${time1} - ${time2}`;
        }
        else {
            return ''
        }
    }

    const handleRejectOrder = async () => {
        try {
            const res = await rejectOrder({
                variables: {
                    customerToken, 
                    orderRequestId: rejected.id,
                    comment: rejectComment
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyRejectShopperOrderRequest) {
                handleCloseReject();
                setMessage("Rejected!");
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const handleApproveOrder = async id => {
        try {
            setIsApprove(true)
            const res = await approveOrder({
                variables: {
                    customerToken, 
                    orderRequestId: id,
                    returnUrl: window.location.href,
                    serviceOrderInformation: !isEmpty(requestServiceOrderInformation) ? requestServiceOrderInformation : null
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyApproveShopperOrderRequest) {
                if(res.data.companyApproveShopperOrderRequest.paymentData) {
                    if(res.data.companyApproveShopperOrderRequest.paymentData.status === "succeeded") {
                        setMessage("Approved!");
                    }
                    else
                    if(!res.data.companyApproveShopperOrderRequest.paymentData.status && res.data.companyApproveShopperOrderRequest.paymentData.paymentErrorMessage) {
                        setApproveError(res.data.companyApproveShopperOrderRequest.paymentData.paymentErrorMessage);
                    }
                    else
                    if(res.data.companyApproveShopperOrderRequest.paymentData.status === "requires_action" && res.data.companyApproveShopperOrderRequest.paymentData.nextAction) {
                        localStorage.setItem("orderId", res.data.companyApproveShopperOrderRequest.orderId);
                        localStorage.setItem('orderRequestId', res.data.companyApproveShopperOrderRequest.orderRequestId);
                        window.location = res.data.companyApproveShopperOrderRequest.paymentData.nextAction;
                        return;
                    }
                }
                else
                if(res.data.companyApproveShopperOrderRequest.paymentMethodCode === "banktransfer") {
                    setMessage("Approved!");
                }
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const handleUpdateOrder = async () => {
        localStorage.setItem("changedOrderId", changingOrder.id)
        const products = changingOrder.items.map(item => {
            return {
                sku: item.sku,
                qty: item.qty
            }
        });
        try {
            const res = await updateOrder({
                variables: {
                    customerToken,
                    orderRequestId: changingOrder.id,
                    products
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyUpdateShopperOrderRequest) {
                setChangingOrder({});
                setShouldGetOrders(true);
                setView("orders");
            }
        } catch (err) {
            console.log('err', err);
        }
    }

    const handleDeleteOrder = async () => {
        try {
            const res = await deleteOrder({
                variables: {
                    customerToken,
                    orderRequestId: order.id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyDeleteShopperOrderRequest) {
                setIsOpenDelete(false);
                setShouldGetOrders(true);
                setView("orders");
            }
        } catch (err) {
            console.log('err', err);
        }
    }

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

    const handleCloseReject = () => {
        setIsOpenReject(false);
        setRejected({});
    }

    const handleOpenReject = (order) => {
        setIsOpenReject(true);
        setRejected(order);
    }

    const handleCloseMessageModal = () => {
        if(approveError) {
            setApproveError("");
        }
        else {
            setMessage("");
        }
        setShouldGetOrders(true);
        setIsApprove(false);
        setView("orders");
    }

    const attachments = useMemo(() => {
        if(!isEmpty(requestServiceOrderInformation)) {
            let backendUrl = process.env.BACKEND_URL.split("/");
            backendUrl.pop();
            backendUrl = backendUrl.join("/")
            return requestServiceOrderInformation.attachments.map(file => {
                return {
                    ...file,
                    url: `${backendUrl}/gd-file-download/${id}/${file.id}?orderStatus=pending`
                }
            });
        }
    }, [requestServiceOrderInformation]);

    const allSelectedItems = useMemo(() => {
        let arr = [];
        if(itemsPerPage.length) {
            itemsPerPage.map(el => {
                if(el.items && el.items.length) {
                    el.items.map(item => arr.push({
                        ...item,
                        sku: item.objectID,
                        qty: item.qty || 1,
                        imageUrl: item.images[0].imageURL
                    }));
                }
            })
        }
        return arr;
    }, [itemsPerPage]);

    const handleAddItemsToOrder = async () => {
        let data = [];
        if(selectedTemplate && selectedTemplate.selectedItems && selectedTemplate.selectedItems.length) {
            data = [...data, ...selectedTemplate.selectedItems];
        }
        if(allSelectedItems && allSelectedItems.length) {
            data = [...data, ...allSelectedItems];
        }
        const updatedItems = [...changingOrder.items, ...data];
        const updatedOrder = {...changingOrder, items: updatedItems};
        setChangingOrder(updatedOrder);
        if(isOpenSearch) {
            setIsOpenSearch(false);
            setItemsPerPage([{all: false, page: 1, items: []}]);
        }
        if(isOpenTemplates) {
            setIsOpenTemplates(false);
        }
    }

    const goToCart = () => {
        if(localeId === "default") {
            history.replace("/cart");
        }
        else {
            history.replace(`/cart${codeSplitter(localeId)}`);
        }
    }

    const clearCartData = () => {
        if(localStorage.getItem("courierData")) {
            localStorage.removeItem("courierData");
        }
        if(localStorage.getItem("driveFileIds")) {
            localStorage.removeItem("driveFileIds");
        }
        setSubmittingClear(true);
        cartData.items.map(async item => {
            await removeFromCart({variables: {
                cartToken: cartData.cartToken,
                customerToken: customerToken,
                itemId: item.itemId
            }})
        })
        dispatch(actions.clearCart());
        handleReorder(undefined, true);
    }

    const handleReorder = async (shouldCallReorder, afterClear) => {
        if(shouldCallReorder || afterClear || (isEmpty(cartData) || (cartData.items && !cartData.items.length))) {
            if(shouldCallReorder) {
                setIsMerging(true);
            }
            if(afterClear) {
                setSubmittingClear(true);
            }
            try {
                const res = await reorder({
                    variables: {
                        customerToken,
                        orderRequestId: order.id
                    },
                    fetchPolicy: "no-cache"
                });
                if(res && res.data && res.data.companyRejectedOrderReorder) {
                    if(shouldCallReorder) {
                        setIsMerging(false);
                    }
                    else
                    if(afterClear) {
                        setSubmittingClear(false);
                    }
                    else {
                        setIsOpenReorderModal(false);
                    }
                    goToCart();
                }
            } catch (err) {
                console.log('err', err);
                if(shouldCallReorder) {
                    setIsMerging(false);
                }
                else
                if(afterClear) {
                    setSubmittingClear(false);
                }
                else {
                    setIsOpenReorderModal(false);
                }
            }
        }
        else {
            setIsOpenReorderModal(true);
        }
    }

    useEffect(() => {
        const id = localStorage.getItem("changedOrderId");
        if(id && id == order.id && !isOpen) {
            setIsOpen(true);
            getOrderDetails(parseInt(id));
            setView('orderDetails'); 
        }
    }, []);

    useEffect(() => {
        if(isOpenTemplates && customerToken && !templates.length) {
            handleGetTemplates();
        }
    }, [isOpenTemplates]);

    return {
        isOpen,
        handleOpen,
        createdAt: getExpires(requestCreatedAt),
        totals: totals || {},
        items: items || [],
        requestStatus,
        requestPayment,
        shippingAddress,
        timeFormat,
        billingAddress,
        customer,
        isOpenReject,
        handleCloseReject,
        handleOpenReject,
        handleApproveOrder,
        approveLoading,
        rejectComment,
        setRejectComment,
        handleRejectOrder,
        rejectLoading,
        attachments,
        serviceOrder: requestServiceOrderInformation,
        message,
        handleCloseMessageModal,
        changingOrder,
        setChangingOrder,
        handleUpdateOrder,
        updateLoading,
        isOpenSearch,
        setIsOpenSearch,
        itemsPerPage,
        setItemsPerPage,
        currentPageInfo,
        setCurrentPageInfo,
        isOpenTemplates,
        setIsOpenTemplates,
        templates,
        selectedTemplate,
        setSelectedTemplate,
        isFetchingTemplates,
        handleAddItemsToOrder,
        isOpenDelete,
        setIsOpenDelete,
        handleDeleteOrder,
        deleteLoading,
        isOpenReorderModal,
        setIsOpenReorderModal,
        handleReorder,
        reorderLoading,
        isMerging,
        clearCartData,
        submittingClear,
        approveError,
        isApprove
    }
}