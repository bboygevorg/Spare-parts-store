import { useCallback, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useMutation } from "@apollo/react-hooks";
import {COMPANY_CREATE_SHOPPER_ORDER_REQUEST, INIT_PAYMENT_INTENT, PLACE_ORDER, REMOVE_COUPON, APPLY_COUPON_TO_CART, CREATE_NEW_CART, SET_CART_SHIPPING_INFO, SET_DELIVERY_TIME, SET_CART_ADDITIONAL_DATA, BANK_PLACE_ORDER, SET_CART_BILLING_INFO } from "api/mutation";
import { useCards } from "talons/useCards";
import get from "lodash/get";
import { useSelector, useDispatch } from "react-redux";
import { storage, clearStorage } from "helper/utils";
import { useHistory } from "react-router-dom";
import { actions, addCartData } from "store/actions/signIn";
import { STORAGE_DONT_SHOW_AGAIN, STORAGE_STEP_DATA_KEY } from "conf/consts";
import { setCurrentStep } from "actions/checkoutNew";
import useWindowDimensions from "talons/useWindowDimensions";
import useTranslation from 'talons/useTranslation';
import { getMessage } from 'helper/errors';
import { codeSplitter } from 'components/Link/link';
import { isVisible } from 'helper/utils';
import { useAwaitQuery } from "talons/useAwaitQuery";
import { GET_CART, GET_PAYMENT_INTENT } from "api/query";
import { isCourierCheckout } from "pages/Checkout/courierCheckout";
import {USER_ROLE_ENUM} from "../../conf/enums";
import { isOnProduction } from "../../../helper/IsOnProduction";
import getZoneCode from "../../../helper/getZoneCode";
import orderScript from "../../../helper/orderScript";

export const useOrderSummary = (props) => {
    const {
        values,
        totals,
        getPlaceOrderLoading,
        setFormValues,
        setRecoverCartLoading,
        setIsOrderPlacing,
        setWith3dSecure,
        cardValue
    } = props;
    const [styles, setStyles] = useState({});

    const [googlePurchaseTracking, setGooglePurchaseTracking] = useState({});
    const [isFixed, setIsFixed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [failedOrderId, setFailedOrderId] = useState();
    const [couponCode, setCouponCode] = useState('');
    const [graphqlError, setGraphqlError] = useState('');
    const { width, height } = useWindowDimensions();
    const __ = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [initPaymentIntent] = useMutation(INIT_PAYMENT_INTENT);
    const [companyCreateShopperOrderRequest] = useMutation(COMPANY_CREATE_SHOPPER_ORDER_REQUEST);
    const [setCartShippingInfo] = useMutation(SET_CART_SHIPPING_INFO);
    const [setOrderDeliveryTime] = useMutation(SET_DELIVERY_TIME);
    const getCartData = useAwaitQuery(GET_CART);
    const getPaymentIntent = useAwaitQuery(GET_PAYMENT_INTENT);
    const [ removeCouponFromCart, { error: removeCouponError, loading: removeCouponLoad}] = useMutation(REMOVE_COUPON);
    const [ applyCouponToCart, { error: applyCouponError, loading: applyCouponLoad } ] = useMutation(APPLY_COUPON_TO_CART);
    const [placeOrder] = useMutation(PLACE_ORDER);
    const [bankPlaceOrder] = useMutation(BANK_PLACE_ORDER);
    const [createNewCart] = useMutation(CREATE_NEW_CART);
    const [sendAdditionalData] = useMutation(SET_CART_ADDITIONAL_DATA);
    const [setCartBillingInfo] = useMutation(SET_CART_BILLING_INFO);
    const { createEphemeral } = useCards();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPolicyModal, setIsOpenPolicyModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [isCartGrantTotalTrue, setIsCartGrantTotalTrue] = useState(false);
    const [shopperMessage, setShopperMessage] = useState("");
    const [grandTotalMessage, setGrandTotalMessage] = useState("");
    const customerData = useSelector((state) => state.signin.customerData);
    const cartData = useSelector((state) => state.signin.cartData);
    const localeId = useSelector(state => state.language.currentLanguage);
    const cartToken = useSelector((state) => state.signin.cartData.cartToken);
    const paymentMethodId = get(props, "cardValue.id", "");
    let data = values && values.courierData && JSON.parse(values.courierData);
    const payment = values && values.payment;

    const trackEcommerceEvents = useCallback(() => {
        if(typeof window !== "undefined") {
            if(!isEmpty(cartData) && cartData.items && cartData.items.length) {
                cartData.items.map(item => {
                    window.ga('ecommerce:addItem', {
                        'id': `${cartData.id}`,
                        'name': item.name,
                        'sku': item.sku,
                        'price': item.price,
                        'quantity': item.qty
                    })
                });
                window.ga('ecommerce:addTransaction', {
                    'id': `${cartData.id}`,
                    'revenue': cartData.totals.grandTotal,
                    'shipping': cartData.totals.shippingAmount.toFixed(2),
                    'tax': cartData.totals.taxAmount.toFixed(2)
                });
                window.ga('ecommerce:send');
            }
        }
    }, [cartData]);

    const removeCoupon = async () => {
        const res = await removeCouponFromCart({
            variables: {
                cartToken: cartData.cartToken,
                customerToken: customerData.customerToken,
            },
        });
        if (res && res.data) {
            dispatch(actions.addCart(res.data.removeCouponFromCart));
            setCouponCode('');
            setGraphqlError('');
        }
    };

    const applyCoupon = async () => {
        const res = await applyCouponToCart({
            variables: {
                cartToken: cartData.cartToken,
                customerToken: customerData.customerToken,
                coupon: couponCode
            }
        });
        if(res && res.data) {
            dispatch(actions.addCart(res.data.applyCouponToCart));
            setGraphqlError('');
        }
    };

    const handleGetPaymentIntent = async (id) => {
        getPlaceOrderLoading(true);
        setIsOrderPlacing(true);
        const res = await getPaymentIntent({
            variables: {
                customerToken: storage("customerToken"),
                intentId: id
            },
            fetchPolicy: "no-cache"
        });
        if(res && res.data && res.data.stripeGetPaymentIntent) {
            if(res.data.stripeGetPaymentIntent.status && res.data.stripeGetPaymentIntent.status === "succeeded") {
                if(process.env.FORCE_URL) {
                    trackEcommerceEvents();
                }
                setOrderPlaced(true);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
                if(localeId === "default") {
                    history.replace(`${history.location.pathname}/success`);
                }
                else {
                    history.replace(`${history.location.pathname}success${codeSplitter(localeId)}`);
                }
                setWith3dSecure(true);
                getPlaceOrderLoading(false);
                setIsOrderPlacing(false);
                dispatch(actions.deleteCartData());
                clearStorage('3dSecureFailedOrderId');
                clearStorage("cartData");
                clearStorage("cartToken");
                clearStorage("courierData");
                clearStorage("driveFileIds");
                clearStorage(STORAGE_STEP_DATA_KEY);
                clearStorage(STORAGE_DONT_SHOW_AGAIN);
            }
            else {
                setWith3dSecure(true);
                getPlaceOrderLoading(false);
                setIsOrderPlacing(false)
                setErrorMessage("Your payment was declined. Please check your card details and try again!");
                setOrderPlaced(false);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
                if(localeId === "default") {
                    history.replace(history.location.pathname);
                }
                else {
                    history.replace(`${history.location.pathname}${codeSplitter(localeId)}`);
                }
            }
        }
    }

    useEffect(() => {
        const intentId = new URLSearchParams(window.location.search).get("payment_intent");
        if(intentId) {
            handleGetPaymentIntent(intentId);
        } else {
            dispatch(addCartData(getCartData));
        }
    },[]);

    useEffect(() => {
        if(removeCouponError){
            const parseError = JSON.parse(JSON.stringify(removeCouponError));
            const code = parseError.graphQLErrors[0].code;
            if(code === 31) {
                dispatch(actions.addExpired(true));
                window.scrollTo(0,0);
            }
        }
    }, [removeCouponError]);

    useEffect(() => {
        if(applyCouponError){
            const parseError = JSON.parse(JSON.stringify(applyCouponError));
            const code = parseError.graphQLErrors[0].code;
            if(code === 31) {
                dispatch(actions.addExpired(true));
                window.scrollTo(0,0);
            }
            else {
                const message = getMessage(code);
                setGraphqlError(message);
            }
        }
    }, [applyCouponError]);

    const handleFormatLocale = (code) => {
        if(code === "default") {
            return 'en';
        }
        else
        if(code === "zh_Hans_CN" || code === "zh_Hant_TW") {
            return code;
        }
        else {
            return code.split('_')[0];
        }
    };

    const handleOrderTracking = (googlePurchaseTracking) => {
        if (isOnProduction()) {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({event:'purchase', ecommerce: googlePurchaseTracking});
        }
    }

    const handleOrder = async () => {
        if(!isCourierCheckout(history.location.pathname) && (!cartData || !cartData.shippingAddress || !cartData.shippingAddress.postcode || !cartData.billingAddress || !cartData.billingAddress.postcode || !cartData.items || !cartData.items.length)) {
            dispatch(setCurrentStep(1));
            document.body.style.overflow = "auto";
            return;
        }
        if(isCourierCheckout(history.location.pathname) && (!cartData || !cartData.billingAddress || !cartData.billingAddress || !cartData.billingAddress.postcode || !cartData.items || !cartData.items.length)) {
            dispatch(setCurrentStep(1));
            document.body.style.overflow = "auto";
            return;
        }
        getPlaceOrderLoading(true);
        setIsOrderPlacing(true);

        const customerToken = storage("customerToken");
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

        const getSendAdditionalData = await sendAdditionalData({
            variables: {
                cartToken,
                customerToken,
                platform: userAgent,
                locale: handleFormatLocale(localeId)
            }
        });
				const locationId = getSendAdditionalData.data.setCartAdditionalData.shippingAddress ? getSendAdditionalData.data.setCartAdditionalData.shippingAddress.id : "";
	
				//Google analytic  tracking
				setGooglePurchaseTracking({...googlePurchaseTracking,
            value:getSendAdditionalData.data.setCartAdditionalData.totals.grandTotal,
            tax:getSendAdditionalData.data.setCartAdditionalData.totals.taxAmount,
            shipping:getSendAdditionalData.data.setCartAdditionalData.totals.shippingAmount,
            coupon: getSendAdditionalData.data.setCartAdditionalData.totals.couponCode,
            items: getSendAdditionalData.data.setCartAdditionalData.items.map((item) => {
                return {
                    item_id: item.itemId,
                    item_name: item.name,
                    affiliation: "Google Merchandise Store",
                    coupon: getSendAdditionalData.data.setCartAdditionalData.totals.couponCode,
                    currency: "USD",
                    discount: getSendAdditionalData.data.setCartAdditionalData.totals.discountAmount,
                    index: 0,
                    item_brand: "",
                    item_category: "",
                    item_category2: "",
                    item_category3: "",
                    item_category4: "",
                    item_category5: "",
                    item_list_id: "",
                    item_list_name: "",
                    item_variant: "",
                    location_id: locationId,
                    price: item.price,
                    quantity: item.qty
                }
            })
        })
        if (customerData.companyRole === USER_ROLE_ENUM.shopper) {
            try {
                const selectedCardId = get(values, "cardId.value");
                if(localStorage.getItem("driveFileIds")) {
                    const ids = JSON.parse(localStorage.getItem("driveFileIds"));
                    data = {...data, attachments: ids}
                }

                let response = await companyCreateShopperOrderRequest({
                    variables: {
                        customerToken:customerToken,
                        paymentMethodCode: payment,
                        selectedCardId: selectedCardId,
                        comment: notes,
                        serviceOrderInformation: data
                    }
                });
                console.log(response);
                if (response && response.data) {
                    dispatch(actions.deleteCartData());
                    setShopperMessage('You order needs company admin approval.');
                    setIsOpen(!isOpen);

                }
            } catch (err) {
                const parseError = JSON.parse(JSON.stringify(err));
                const code = parseError.graphQLErrors[0].code;
                const message = getMessage(code);
                setShopperMessage(message);
                setIsOrderPlacing(false);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
            }

            clearStorage("cartData");
            clearStorage("cartToken");
            clearStorage("courierData");
            clearStorage("driveFileIds");
            dispatch(actions.deleteCartData());
            clearStorage(STORAGE_STEP_DATA_KEY);
            clearStorage(STORAGE_DONT_SHOW_AGAIN);
            getPlaceOrderLoading(false);
            return;

        }

        if (payment === "stripe") {
            let ephermal = await createEphemeral();
            if(isEmpty(ephermal) || !cardValue.id ) {
                getPlaceOrderLoading(false);
                setIsOrderPlacing(false)
                setErrorMessage("Your payment was declined. Please check your card details and try again!");
                setOrderPlaced(false);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
                console.log(JSON.parse(JSON.stringify('ephermal or card value is none')));
                return
            }
            const customer = ephermal.associated_objects[0].id;

            try {
	            let updatedCartData = await getCartData({
		            variables: {
			            cartToken: localStorage.getItem("cartToken")
				            ? localStorage.getItem("cartToken")
				            : "",
			            customerToken: localStorage.getItem("customerToken")
				            ? localStorage.getItem("customerToken")
				            : "",
		            },
		            fetchPolicy: "no-cache",
	            });
	
	            if (totals.grandTotal !== updatedCartData.data.getCart.totals.grandTotal) {
		            setGrandTotalMessage('Cart was updating during checkout process. Please check you cart and try again.');
		            setIsCartGrantTotalTrue(true);
		            return
	            }
                const initPaymentRes = await initPaymentIntent({
                    variables: {
                        customerToken,
                        paymentIntent: {
                            amount: parseInt(totals.grandTotal * 100),
                            currency: "usd",
                            method_types: ["card"],
                            customer,
                            returnUrl: window.location.href
                        },
                        paymentMethodId,
                    },
                });
                if (!isEmpty(initPaymentRes)) {
                    const selectedCardId = get(values, "cardId.value");
                    const obj = {
                        cartToken,
                        customerToken,
                        payment: {
                            paymentIntent: initPaymentRes.data.stripeInitPaymentIntent.id,
                            customer,
                            selectedCardId
                        },
                        comment: notes,
                    }
                    if(localStorage.getItem("driveFileIds")) {
                        const ids = JSON.parse(localStorage.getItem("driveFileIds"));
                        data = {...data, attachments: ids}
                    }
                    try {
	  
	                      const res = await placeOrder({
                            variables: isCourierCheckout(history.location.pathname) ? {...obj, serviceOrderInformation: data} : obj
                        });
                        
	                      orderScript(res.data.stripePlaceOrder)
	                      
	                      if(typeof window !== "undefined") {
                            if (window.fbq != null && cartData) {
                                const ids = cartData.items.length > 1 ? cartData.items.map(item => item.itemId) : cartData.items[0].itemId;
                                window.fbq('track', 'Purchase', {
                                    productId: ids,
                                    value: cartData.totals && cartData.totals.grandTotal,
                                    currency: 'USD'
                                });
                            }
                        }
                        if(initPaymentRes.data.stripeInitPaymentIntent.paymentErrorMessage && res.data.stripePlaceOrder.id) {
                            setFailedOrderId(res.data.stripePlaceOrder.id.toString());
                            const message = initPaymentRes.data.stripeInitPaymentIntent.paymentErrorMessage;
                            setErrorMessage(message);
                            setOrderPlaced(false);
                            setIsOpen(!isOpen);
                            window.scrollTo(0, 0);
                        }
                        else {
                            if(initPaymentRes.data && initPaymentRes.data.stripeInitPaymentIntent && initPaymentRes.data.stripeInitPaymentIntent.status === "requires_action" && initPaymentRes.data.stripeInitPaymentIntent.nextAction) {
                                localStorage.setItem("3dSecureFailedOrderId", res.data.stripePlaceOrder.id.toString());
                                window.location = initPaymentRes.data.stripeInitPaymentIntent.nextAction;
                                return;
                            }
                            if(process.env.FORCE_URL) {
                                trackEcommerceEvents();
                            }
                            setOrderPlaced(true);
                            setIsOpen(!isOpen);
                            window.scrollTo(0, 0);
                            if(localeId === "default") {
                                handleOrderTracking(googlePurchaseTracking);
                                history.replace(`${history.location.pathname}/success`);
                            }
                            else {
                                handleOrderTracking(googlePurchaseTracking);
                                history.replace(`${history.location.pathname}success${codeSplitter(localeId)}`);
                            }
                        }
                    } catch (err)  {
                        const parseError = JSON.parse(JSON.stringify(err));
                        const code = parseError.graphQLErrors[0].code;
                        const message = getMessage(code);
                        setShopperMessage(message);
                        setIsOpen(!isOpen);
                        window.scrollTo(0, 0);
                    }
                    dispatch(actions.deleteCartData());
                    clearStorage("cartData");
                    clearStorage("cartToken");
                    clearStorage("courierData");
                    clearStorage("driveFileIds");
                    clearStorage(STORAGE_STEP_DATA_KEY);
                    clearStorage(STORAGE_DONT_SHOW_AGAIN);
                    getPlaceOrderLoading(false);
                    setIsOrderPlacing(false);
                }
            } catch (error) {
                getPlaceOrderLoading(false);
                setIsOrderPlacing(false)
                setErrorMessage("Your payment was declined. Please check your card details and try again!");
                setOrderPlaced(false);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
                console.log(JSON.parse(JSON.stringify(error)));
            }
        }
        else {
            const obj = {
                cartToken,
                customerToken,
                comment: notes,
            }
            if(localStorage.getItem("driveFileIds")) {
                const ids = JSON.parse(localStorage.getItem("driveFileIds"));
                data = {...data, attachments: ids}
            }
            try {
                const res = await bankPlaceOrder({
                    variables: isCourierCheckout(history.location.pathname) ? {...obj, serviceOrderInformation: data} : obj
                });
                if(res && res.data && res.data.bankTrasferPlaceOrder && res.data.bankTrasferPlaceOrder.id) {
	                  orderScript(res.data.bankTrasferPlaceOrder);
                    if(typeof window !== "undefined") {
                        if (window.fbq != null && cartData) {
                            const ids = cartData.items.length > 1 ? cartData.items.map(item => item.itemId) : cartData.items[0].itemId;
                            window.fbq('track', 'Purchase', {
                                productId: ids,
                                value: cartData.totals && cartData.totals.grandTotal,
                                currency: 'USD'
                            });
                        }
                    }
                    if(process.env.FORCE_URL) {
                        trackEcommerceEvents();
                    }
                    setOrderPlaced(true);
                    setIsOpen(!isOpen);
                    window.scrollTo(0, 0);
                    if(localeId === "default") {
                        handleOrderTracking(googlePurchaseTracking);
                        history.replace(`${history.location.pathname}/success`);
                    }
                    else {
                        history.replace(`${history.location.pathname}success${codeSplitter(localeId)}`);
                    }
                    dispatch(actions.deleteCartData());
                    clearStorage("cartData");
                    clearStorage("cartToken");
                    clearStorage("courierData");
                    clearStorage("driveFileIds");
                    clearStorage(STORAGE_STEP_DATA_KEY);
                    clearStorage(STORAGE_DONT_SHOW_AGAIN);
                    getPlaceOrderLoading(false);
                    setIsOrderPlacing(false);
                }
            } catch(err) {
                const parseError = JSON.parse(JSON.stringify(err));
                const code = parseError.graphQLErrors[0].code;
                const message = getMessage(code);
                setShopperMessage(message);
                //todo move to
                dispatch(actions.deleteCartData());
                clearStorage("cartData");
                clearStorage("cartToken");
                clearStorage("courierData");
                clearStorage("driveFileIds");
                clearStorage(STORAGE_STEP_DATA_KEY);
                clearStorage(STORAGE_DONT_SHOW_AGAIN);
                getPlaceOrderLoading(false);
                setIsOrderPlacing(false);
                setIsOpen(!isOpen);
                window.scrollTo(0, 0);
            }
        }
    };

    const handleOrderDeliveryTime = (token, time) => {
        setOrderDeliveryTime({
            variables: {
                cartToken: token,
                customerToken: storage("customerToken"),
                deliveryTime: time
            }
        });
    }
    
    const handleWrongGrandTotalModal = () => {
	    setIsCartGrantTotalTrue(false)
    	window.location.reload();
    }

    const orderModalAction = async () => {
        setIsOpen(!isOpen);
        const failedId = localStorage.getItem('3dSecureFailedOrderId');
        if(errorMessage && (failedOrderId || failedId)) {
            setRecoverCartLoading(true);
            const res = await createNewCart({
                variables: {
                    orderId: failedOrderId || failedId,
                    customerToken: customerData.customerToken
                }
            });
            if(res && res.data && res.data.createNewCartFromOrder.cartToken) {
                dispatch(actions.addCart(res.data.createNewCartFromOrder))
                if(isCourierCheckout(history.location.pathname)) {
                    await setCartBillingInfo({
                        variables: {
                            customerToken: storage("customerToken"),
                            cartToken: res.data.createNewCartFromOrder.cartToken,
                            billingInfo: {
                                billingAddressId: get(values, ["billingAddressId", "id"], ""),
                            },
                        },
                    });
                }
                else {
                    await setCartShippingInfo({
                        variables: {
                            customerToken: storage("customerToken"),
                            cartToken: res.data.createNewCartFromOrder.cartToken,
                            shippingInfo: {
                                billingAddressId: get(values, ["billingAddressId", "id"], ""),
                                shippingAddressId: get(values, ["shippingAddressId", "id"], ""),
                                estimatedSizeCode: get(values, ["estimatedSizeCode", "code"], ""),
                            },
														zoneCode: getZoneCode()
                        },
                    });
                    if(values.shippingAddressId && values.shippingAddressId.postcode) {
                        if(values.timeToSend) {
                            handleOrderDeliveryTime(res.data.createNewCartFromOrder.cartToken, values.timeToSend);
                        }
                    }
                }
            }
            setFormValues({
                cardId: {},
            });
            if(isCourierCheckout(history.location.pathname)) {
                dispatch(setCurrentStep(2));
            }
            else {
                dispatch(setCurrentStep(4));
            }
            clearStorage('3dSecureFailedOrderId');
            setRecoverCartLoading(false);
        }
        else {
            setTimeout(() => {
                localeId === "default" ? history.replace("/account/orders") : history.replace(`/account/orders${codeSplitter(localeId)}`);
                dispatch(setCurrentStep(0));
            }, 100);
        }
    };

    useEffect(() => {
        if(width !== undefined) {
            handleScroll();
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [width]);


    useEffect(() => {
        if(width !== undefined) {
            handleScroll();
        }
    }, [
        width,
        height,
        window.scrollY,
        document.getElementById("orderSummaryId"),
    ]);

    const handleScroll = () => {
        const id = new URLSearchParams(window.location.search).get("payment_intent");
        if (width < 784 || isCourierCheckout(history.location.pathname) || id) {
            return;
        }
        const el = document.getElementById("orderSummaryId");
        const headerHeight = document.getElementById("header").offsetHeight;
        const checkoutStepsTab = document.getElementById("checkoutStepsTab");
        const tabsHeight = checkoutStepsTab ? checkoutStepsTab.offsetHeight : 0;

        if (
            document.getElementById("summaryContainer").offsetTop - headerHeight <
            window.scrollY
        ) {
            setIsFixed(true);
            if (el.offsetHeight > height - headerHeight) {
                setStyles({
                    ...styles,
                    top: `${
                        (headerHeight - window.scrollY) / (headerHeight % el.offsetHeight) +
                        tabsHeight
                    }px`,
                });
            } else {
                setStyles({
                    ...styles,
                    top: `${headerHeight + 10}px`,
                });
            }
        } else {
            setIsFixed(false);
            setStyles({
                position: "absolute",
                top: "0",
                bottom: "auto",
                width: "100%",
            });
        }
        if (isVisible("footer")) {
            setStyles({
                position: "absolute",
                top: "auto",
                bottom: "450px",
                width: "100%",
            });
            if (window.scrollY === 0) {
                setStyles({
                    position: "absolute",
                    top: "0",
                    width: "100%",
                });
            }
        }
    };

    return {
        __,
        data,
        couponCode,
        setCouponCode,
        graphqlError,
        applyCoupon,
        applyCouponLoad,
        removeCoupon,
        removeCouponLoad,
        setIsOpenPolicyModal,
        isOpenPolicyModal,
        isOpen,
        setIsOpen,
        orderModalAction,
        orderPlaced,
        errorMessage,
        shopperMessage,
	      handleWrongGrandTotalModal,
	      grandTotalMessage,
		    isCartGrantTotalTrue,
		    handleOrder,
        isFixed,
        styles,
        notes,
        setNotes,
        history
    }
}