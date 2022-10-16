import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { GET_CART_TEMPLATES, COMPANY_GET_USER_CART } from "api/query";
import useTranslation from "talons/useTranslation";
import useWindowDimensions from "talons/useWindowDimensions";
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { REMOVE_CART_TEMPLATE, CREATE_CART_TEMPLATE, UPDATE_CART_TEMPLATE, ADD_TEMPLATE_TO_CART } from "api/mutation";
import { useMutation } from "@apollo/react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { parameterizedString } from "helper/utils";
import { isEmpty } from "lodash";
import { actions } from "store/actions/signIn";
import getZoneCode from "../../../helper/getZoneCode";

export const useCartTemplates = () => {
    const __ = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [view, setView] = useState("list");
    const [templates, setTemplates] = useState([]);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [templateToCartLoad, setTemplateToCartLoad] = useState(false);
    const [selected, setSelected] = useState({});
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState([{all: false, page: 1, items: []}]);
    const [currentPageInfo, setCurrentPageInfo] = useState({});
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const { width } = useWindowDimensions();
    const getCartTemplates = useAwaitQuery(GET_CART_TEMPLATES);
    const getUserCart = useAwaitQuery(COMPANY_GET_USER_CART);
    const [removeCartTemplate, { loading: removingCartTemplate }] = useMutation(REMOVE_CART_TEMPLATE);
    const [createCartTemplate, { loading: creatingCartTemplate }] = useMutation(CREATE_CART_TEMPLATE);
    const [updateCartTemplate, { loading: updatingCartTemplate }] = useMutation(UPDATE_CART_TEMPLATE);
    const [addToCart] = useMutation(ADD_TEMPLATE_TO_CART);
    const customerToken = typeof window !== "undefined" ? localStorage.getItem("customerToken") : "";
    const companyRole = useSelector(state => state.signin.customerData.companyRole);
    const cartData = useSelector(state => state.signin.cartData);
    const searchRef = useSelector(state => state.categories.searchRefinement);

    const handleChangeName = (value) => {
        setName(value);
    }

    const selectToRemove = (item) => {
        const message = 'Are you sure you want to delete "%s1" template?';
        setText(parameterizedString(__(message), item.name));
        setIsOpenDelete(true);
        window.scrollTo(0, 0)
    }

    const removeTemplate = async () => {
        await handleRemoveTemplate(selected.id);
        setText("");
        setSelected({});
        setView("list")
        setIsOpenDelete(false);
    }

    const allSelectedItems = useMemo(() => {
        let arr = [];
        if(itemsPerPage.length) {
            itemsPerPage.map(el => {
                if(el.items && el.items.length) {
                    el.items.map(item => arr.push(item));
                }
            })
        }
        return arr;
    }, [itemsPerPage]);

    const handleChangeSelected = useCallback((id, value) => {
        const arr = [...itemsPerPage];
        arr.map((el, index) => {
            let items = [...el.items];
            if(items.length) {
                const changedIndex = items.findIndex(item => item.objectID === id);
                if(changedIndex !== -1) {
                    if(value) {
                        items[changedIndex] = {...items[changedIndex], qty: value}
                    }
                    else {
                        items.splice(changedIndex, 1);
                    }
                    arr[index] = {...arr[index], items};
                    setItemsPerPage(arr);
                }
                else {
                    if(!isEmpty(selected) && selected.products && selected.products.length) {
                        let arr = [...selected.products];
                        const changedIndex = arr.findIndex(item => item.sku === id);
                        if(value) {
                            arr[changedIndex] = {...arr[changedIndex], qty: value}
                        }
                        else {
                            arr.splice(changedIndex, 1);
                        }
                        setSelected({...selected, products: arr});
                    }
                }
            }
            else {
                if(!isEmpty(selected) && selected.products && selected.products.length) {
                    let arr = [...selected.products];
                    const changedIndex = arr.findIndex(item => item.sku === id);
                    if(value) {
                        arr[changedIndex] = {...arr[changedIndex], qty: value}
                    }
                    else {
                        arr.splice(changedIndex, 1);
                    }
                    setSelected({...selected, products: arr});
                }
            }
        });
    }, [itemsPerPage, selected]);

    const handleGetTemplates = useCallback(async () => {
        try {
            setIsFetchingTemplates(true);
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

    const handleRemoveTemplate = async (id) => {
        try {
            const res = await removeCartTemplate({
                variables: {
                    customerToken,
                    id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyRemoveCartTemplate) {
                handleGetTemplates();
            }
        } catch(err) {
            console.log('err', err)
        }
    }

    const handleCreateTemplate = async () => {
        try {
            const products = allSelectedItems.map(item => {
                return {
                    sku: item.objectID,
                    qty: item.qty || 1
                }
            });
            const res = await createCartTemplate({
                variables: {
                    customerToken,
                    name: name,
                    products 
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyCreateCartTemplate) {
                setView("list");
                setSelected({});
                setItemsPerPage([{all: false, page: 1, items: []}]);
                setCurrentPageInfo({});
                setName("");
                handleGetTemplates();
            }
        } catch (err) {
            console.log('err', err)
        }
    }

    const handleUpdateCartTemplate = async () => {
        try {
            const expectedProducts = allSelectedItems.map(item => {
                return {
                    sku: item.objectID,
                    qty: item.qty || 1
                }
            });
            const expectedExistingProducts = selected.products.map(item => {
                return {
                    sku: item.sku,
                    qty: item.qty || 1
                }
            })
            const res = await updateCartTemplate({
                variables: {
                    customerToken,
                    name: name,
                    id: parseInt(selected.id),
                    products: [...expectedProducts, ...expectedExistingProducts]
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyUpdateCartTemplate) {
                setView("list");
                setSelected({});
                setItemsPerPage([{all: false, page: 1, items: []}]);
                setCurrentPageInfo({});
                setName("");
                handleGetTemplates();
            } 
        } catch (err) {
            console.log('err', err)
        }
    }

    const handleAddTemplateToCart = useCallback(async (id) => {
        if(isEmpty(cartData) && !cartData.cartToken) {
            setTemplateToCartLoad(true);
            const response = await getUserCart({
                variables: {
                    customerToken
                },
                fetchPolicy: "no-cache"
            });
            if(response && response.data && response.data.companyGetCustomerCart && response.data.companyGetCustomerCart.cartToken) {
                dispatch(actions.addCart(response.data.companyGetCustomerCart));
                const cartToken = response.data.companyGetCustomerCart.cartToken;
                const res = await addToCart({
                    variables: {
                        customerToken,
                        templateId: parseInt(id),
                        cartToken,
												zoneCode: getZoneCode()
                    }
                });
                if(res && res.data && res.data.companyAddCartTemplateToCustomerCart) {
                    dispatch(actions.addCart(res.data.companyAddCartTemplateToCustomerCart));
                    setTemplateToCartLoad(false);
                }
            }
        }
        else {
            setTemplateToCartLoad(true);
            const res = await addToCart({
                variables: {
                    customerToken,
                    templateId: parseInt(id),
                    cartToken: cartData.cartToken,
										zoneCode: getZoneCode()
                }
            });
            if(res && res.data && res.data.companyAddCartTemplateToCustomerCart) {
                dispatch(actions.addCart(res.data.companyAddCartTemplateToCustomerCart));
                setTemplateToCartLoad(false);
            }
        }
       
    }, [cartData, customerToken, actions]);

    useEffect(() => {
        if(customerToken) {
            handleGetTemplates();
        }
    }, []);

    useEffect(() => {
        if(typeof window !== "undefined") {
            if (isOpenSearch) {
                if(searchRef) {
                    document.body.style.overflow = 'hidden';
                }
            }
            else {
                document.body.style.overflow = 'auto';
            }
        }
    }, [isOpenSearch, searchRef]);

    return {
        __,
        view,
        setView,
        width,
        templates,
        isFetchingTemplates,
        isOpenDelete,
        setIsOpenDelete,
        removingCartTemplate,
        companyRole,
        selectToRemove,
        removeTemplate,
        text,
        selected,
        setSelected,
        name,
        handleChangeName,
        isOpenSearch,
        setIsOpenSearch,
        itemsPerPage,
        setItemsPerPage,
        currentPageInfo,
        setCurrentPageInfo,
        handleCreateTemplate,
        creatingCartTemplate,
        handleUpdateCartTemplate,
        updatingCartTemplate,
        allSelectedItems,
        handleChangeSelected,
        handleAddTemplateToCart,
        templateToCartLoad
    }
}