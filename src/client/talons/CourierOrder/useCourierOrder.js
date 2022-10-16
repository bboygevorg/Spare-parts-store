import useTranslation from "talons/useTranslation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { firstUpperCase } from "helper/utils";
import { errorMessage } from "conf/consts";
import { GET_DELIVERY_DATES, GET_SERVICE_PRODUCTS, ESTIMATE_SHIPPING } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { useHistory } from "react-router";
import { ADD_TO_CART } from "api/mutation";
import { useMutation } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { codeSplitter } from 'components/Link/link';
import { actions } from "store/actions/signIn";
import { REMOVE_FROM_CART } from "api/mutation";
import isEmpty from 'lodash/isEmpty';
import { VALID_KEY } from 'conf/consts';
import find from 'lodash/find';
import axios from "axios";
import getZoneCode from "../../../helper/getZoneCode";

const validate = (values) => {
    const errors = {};
    if(!values.type) {
        errors.type = "Required";
    }
    if(!values.contactName) {
        errors.contactName = errorMessage(`${firstUpperCase("contact name")}`,"is a required value.");
    }
    if(!values.phone) {
        errors.phone = errorMessage(`${firstUpperCase("phone number")}`,"is a required value.");
    }
    if(!values.from) {
        errors.from = errorMessage(`${firstUpperCase("from")}`,"is a required value.");
    }
    if (values.phone && !/^(([(][+1]\d[)][ ])|)((\d{3}([-]\d{3})*([-]\d{4})+))$/.test(values.phone)) {
        errors.phone = "Invalid phone number";
    }
    return errors;
}

export const useCourierOrder = (props) => {
    const { selectedType } = props;
    const __ = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [days, setDays] = useState([]);
    const [products, setProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [graphqlError, setGraphqlError] = useState("");
    const getDates = useAwaitQuery(GET_DELIVERY_DATES);
    const getProducts = useAwaitQuery(GET_SERVICE_PRODUCTS);
    const getEstimatedCharge = useAwaitQuery(ESTIMATE_SHIPPING);
    const [ addToCart ] = useMutation(ADD_TO_CART);
    const customerData = useSelector((state) => state.signin.customerData);
    const cartToken = useSelector((state) => state.signin.cartData.cartToken);
    const localeId = useSelector(state => state.language.currentLanguage);
    const cartData = useSelector(state => state.signin.cartData);
    const [isOpen, setIsOpen] = useState(false);
    const [ removeFromCart ] = useMutation(REMOVE_FROM_CART);
    const [submittingClear, setSubmittingClear] = useState(false);
    const [isSubmittingCourier, setIsSubmittingCourier] = useState(false);
    const [fromError, setFromError] = useState("");
    const [toError, setToError] = useState("");
    const [sizeError, setSizeError] = useState("");

    const formik = useFormik({
        initialValues: {
            type: null,
            contactName: "",
            phone: "",
            companyName: "",
            orderNumber: "",
            notes: "",
            from: "",
            to: "",
            day: "",
            time: "",
            files: []
        },
        enableReinitialize: true,
        validate: validate,
        onSubmit: (values, { resetForm }) => {
            addProductToCart(values, resetForm);
        },
    });

    const getDeliveryDates = async (value) => {
        const response = await getDates({
            variables: {
              zipCode: value
            },
            fetchPolicy: "no-cache",
        });
        if(response && response.data && response.data.getDeliveryDatesByZipCode) {
            setDays(response.data.getDeliveryDatesByZipCode.dates);
        }
    };

    const getServiceProducts = async () => {
        setIsSubmitting(true);
        const response = await getProducts({
            variables: {
                serviceType: "courier"
            },
            fetchPolicy: "no-cache",
        });
        if(response && response.data && response.data.getServiceProducts) {
            setProducts(response.data.getServiceProducts);
            setIsSubmitting(false);
        }
    }

    const handleUploadFilesToTmp = (files) => {
        const formData = new FormData();
        formData.append('key', process.env.UPLOAD_KEY)
        files.map(file => {
            formData.append(`file`, file);
        })
        axios.post(process.env.UPLOAD_BACKEND_URL, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            }
        })
        .then(res => {
            if(res && res.data && res.data.length) {
                localStorage.setItem("driveFileIds", JSON.stringify(res.data));
            }
        })
        .catch(err => console.log('err', err));
    }

    const addProductToCart = async (values, resetForm, afterClear) => {
        if(afterClear || (isEmpty(cartData) || (cartData.items && !cartData.items.length))) {
            if(!afterClear) {
                setIsSubmittingCourier(true);
            }
            let fromSupported = false;
            let toSupported = false;
            const res = await getEstimatedCharge({
                variables: {
                    zipCode: parseInt(formik.values.fromZip),
                    shipmentType: 1
                }
            })
            if(res && res.data && res.data.estimateShippingByZipAndType) {
                if(find(res.data.estimateShippingByZipAndType, { carrierCode : VALID_KEY })) {
                    fromSupported = true;
                    if(formik.values.toZip && formik.values.to) {
                        const response = await getEstimatedCharge({
                            variables: {
                                zipCode: parseInt(formik.values.toZip),
                                shipmentType: 1
                            }
                        });
                        if(response && response.data) {
                            if(find(response.data.estimateShippingByZipAndType, { carrierCode : VALID_KEY })) {
                                toSupported = true;
                            }
                        }
                    }
                    else {
                        toSupported = true;
                    }
                }
            }
            if(fromSupported && toSupported) {
                if(fromError || toError) {
                    setFromError("");
                    setToError("");
                }
                if(localStorage.getItem("courierData")) {
                    localStorage.removeItem("courierData");
                }
                if(localStorage.getItem("driveFileIds")) {
                    localStorage.removeItem("driveFileIds");
                }
                try {
                    if(values.files.length) {
                        handleUploadFilesToTmp(values.files);
                    }
                    const response = await addToCart({
                        variables: {
                            item: {
                                sku: values.type.sku,
                                qty: 1,
                                fromMagento: true
                            },
                            customerToken: customerData.customerToken
                            ? customerData.customerToken
                            : "",
                            cartToken: cartToken ? cartToken : "",
														zoneCode: getZoneCode()
                        },
                    });
                    if(response && response.data && response.data.addToCart) {
                        dispatch(actions.addCartToken(response.data.addToCart.cartToken));
                        dispatch(actions.addCart(response.data.addToCart));
                        dispatch(actions.setIsActiveCart(true));
                        const data = {
                            service: "Courier",
                            phoneNumber: values.phone,
                            contactName: values.contactName,
                            companyName: values.companyName,
                            orderReferenceNumber: values.orderNumber,
                            deliveryTimeRange: values.day + ",  " + values.time,
                            fromAddress: values.from,
                            toAddress: values.to,
                            note: values.notes
                        }
                        setDays([]);
                        resetForm();
                        if(afterClear) {
                            setSubmittingClear(false);
                        }
                        else {
                            setIsSubmittingCourier(false);
                        }
                        localStorage.setItem("courierData", JSON.stringify({...data, type: values.type}));
                        if(localeId === "default") {
                            history.replace("/courier_checkout", {
                                state: {
                                    data: JSON.stringify(data),
                                    type: values.type
                                }
                            });
                        }
                        else {
                            history.replace(`/courier_checkout${codeSplitter(localeId)}`, {
                                state: {
                                    data: JSON.stringify(data),
                                    type: values.type
                                }
                            });
                        }
                    }
                } catch (error) {
                    if(afterClear) {
                        setSubmittingClear(false);
                    }
                    else {
                        setIsSubmittingCourier(false);
                    }
                    const parseError = JSON.parse(JSON.stringify(error));
                    const code = parseError.graphQLErrors[0].code;
                    if (code === 31) {
	                      dispatch(actions.clearCart());
                        window.scrollTo(0, 0);
                    } else {
                        setGraphqlError("Unexpected server error. Please try again.");
                    }
                }
            }
            else 
            if(!fromSupported && !toSupported) {
                setFromError("Unfortunately we currently don't operate in your selected location.");
                setToError("");
                if(isOpen) {
                    setIsOpen(false);
                }
                if(afterClear) {
                    setSubmittingClear(false);
                }
                else {
                    setIsSubmittingCourier(false);
                }
            }
            else {
                if(!fromSupported) {
                    setFromError("Unfortunately we currently don't operate in your selected location.");
                    setToError("");
                }
                else 
                if(!toSupported) {
                    setToError("Unfortunately we currently don't operate in your selected location.");
                    setFromError("");
                }
                if(isOpen) {
                    setIsOpen(false);
                }
                if(afterClear) {
                    setSubmittingClear(false);
                }
                else {
                    setIsSubmittingCourier(false);
                }
            }
        }
        else {
            setIsOpen(true);
        }        
    };

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
                customerToken: customerData.customerToken,
                itemId: item.itemId
            }})
        })
        dispatch(actions.clearCart());
        addProductToCart(formik.values, formik.resetForm, true)
    }
    
    const goToCart = () => {
        if(localeId === "default") {
            history.replace("/cart");
        }
        else {
            history.replace(`/cart${codeSplitter(localeId)}`);
        }
    }

    useEffect(() => {
        getServiceProducts();
    },[]);

    useEffect(() => {
        if(formik.values.from) {
            if(formik.values.zip) {
                getDeliveryDates(formik.values.zip);
            }
            else {
                getDeliveryDates("90001");
            }
        }
    }, [formik.values.zip]);

    useEffect(() => {
        if(selectedType && products.length) {
            const selected = products.find(el => el.sku === selectedType);
            formik.setFieldValue("type", selected);
        }
    }, [selectedType, products]);

    return {
        __,
        formik,
        days,
        products,
        isSubmitting,
        graphqlError,
        isOpen,
        setIsOpen,
        clearCartData,
        goToCart,
        submittingClear,
        isSubmittingCourier,
        fromError,
        setFromError,
        toError,
        setToError,
        sizeError,
        setSizeError
    }
};