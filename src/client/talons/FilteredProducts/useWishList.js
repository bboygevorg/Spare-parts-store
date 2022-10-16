import { useEffect, useState } from 'react'
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { actions } from 'actions/wishList';
import isEmpty from 'lodash/isEmpty';
import { algoliaIndex } from "conf/main";
import useTranslation from 'talons/useTranslation';
import { GET_ALL_WISHLIST_ITEMS } from 'api/query';
import { getMessage } from 'helper/errors';
import { ATTRIBUTES } from 'conf/consts';
import useCurrentLanguage from 'talons/useCurrentLanguage';

export const useWishList = (props) => {
    const { 
        getWishListsQuery, 
        addWishListMutation, 
        deleteWishListMutation, 
        getWishListItemsQuery, 
        removeItemFromWishList 
    } = props;
    const wishLists = useSelector(state => state.wishList.categories);
    const items = useSelector(state => state.wishList.items);
    const [value, setValue] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isFetchingItems, setIsFetchingItems] = useState(false);
    const [active, setActive] = useState({});
    const [removedCategory, setRemovedCategory] = useState({});
    const [addError, setAddError] = useState('');
    const [error, setError] = useState('');
    const getWishLists = useAwaitQuery(getWishListsQuery);
    const customerToken = useSelector(state => state.signin.customerData.customerToken);
    const isAuth = useSelector(state => state.signin.isAuth);
    const [ addWishList, { loading: addLoading } ] = useMutation(addWishListMutation);
    const [ deleteWishList ] = useMutation(deleteWishListMutation);
    const getWishListItems = useAwaitQuery(getWishListItemsQuery);
    const getAllItems = useAwaitQuery(GET_ALL_WISHLIST_ITEMS);
    const [ removeItem, { loading: removeItemLoading} ] = useMutation(removeItemFromWishList);
    const dispatch = useDispatch();
    const __ = useTranslation();
    const { currentLanguageName } = useCurrentLanguage();

    useEffect(() => {
        if(wishLists.length && isEmpty(active)) {
            setActive(wishLists[0]);
        }
    }, [wishLists, active]);

    useEffect(() => {
        if(customerToken) {
            handleGetWishlistItems(0);
        }
    }, [customerToken]);

    useEffect(() => {
        if(isAuth && customerToken) {
            handleGetWishLists();
        }
    }, [isAuth, customerToken]);

    useEffect(() => {
        if(!isEmpty(active) && active.id) {
            handleGetWishlistItems(active.id);
        }
    }, [active]);

    const handleGetWishLists = async () => {
        try {
            const res = await getWishLists({ 
                variables: {
                    customerToken
                },
                fetchPolicy: "no-cache",
            });
            dispatch(actions.setWishlists(res.data.getWishlists));
            setError("");
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    };

    const handleAddWishList = async () => {
        try {
            await addWishList({
                variables: {
                    customerToken,
                    name: value
                },
                fetchPolicy: "no-cache",
            });
            setValue("");
            setAddError("");
            handleGetWishLists();
        }
        catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setAddError(message);
        }
    };

    const handleDeleteWishList = async () => {
        try {
            const res = await deleteWishList({
                variables: {
                    customerToken,
                    wishlistId: parseInt(removedCategory.id)
                },
                fetchPolicy: "no-cache",
            });
            if(res && res.data && res.data.deleteWishlist) {
                const removedIndex = wishLists.findIndex(category => category.id === removedCategory.id);
                if(removedIndex) {
                    handleGetWishLists();
                    setRemovedCategory({});
                }
                setError("");
            }
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    };

    const handleGetWishlistItems = async (id) => {
        try {
            setIsFetchingItems(true)
            const res = await getWishListItems({
                variables: {
                    customerToken,
                    wishlistId: id
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.getWishlistItems) {
                setError("");
                const productIds = res.data.getWishlistItems.map(el => el.sku);
                if(productIds.length) {
                    const products = await algoliaIndex.getObjects(productIds, {
                        attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]
                    });
                    if(products && products.results && products.results.length) {
                        const updatedProductList = products.results.map(prod => {
                            if(!isEmpty(prod)) {
                                const matchedObj = res.data.getWishlistItems.find(el => el.sku === prod.objectID);
                                if(!isEmpty(matchedObj)) {
                                    return { ...prod, itemId: matchedObj.itemId }
                                }
                            }
                        })
                        dispatch(actions.setItems(updatedProductList));
                        setIsFetchingItems(false);
                    }
                    else {
                        dispatch(actions.setItems([]));
                        setIsFetchingItems(false);
                    }
                }
                else {
                    dispatch(actions.setItems([]));
                    setIsFetchingItems(false);
                }
            }
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            const res = await removeItem({
                variables: {
                    customerToken,
                    wishlistItemIds: [id]
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.removeItemsFromWishlist) {
                setError("");
                handleGetWishlistItems(active.id);
                handleGetAllItems();
            }
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    };

    const handleGetAllItems = async () => {
        try {
            const allItems = await getAllItems({
                variables: {
                customerToken,
                },
                fetchPolicy: "no-cache"
            });
            if(allItems && allItems.data && allItems.data.getAllWishlistItems && !allItems.data.getAllWishlistItems.length) {
            localStorage.removeItem("allWishListItems")
            }
            dispatch(actions.setAllItems(allItems.data.getAllWishlistItems));
            setError("");
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    }

    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    const handleOpenModal = () => {
        setIsOpenModal(true);
    };

    return {
        categories: wishLists,
        items,
        value,
        setValue,
        handleAddWishList,
        addLoading,
        handleDeleteWishList,
        isOpenModal,
        handleCloseModal,
        handleOpenModal,
        removedCategory,
        setRemovedCategory,
        active,
        setActive,
        isFetchingItems,
        handleRemoveItem,
        removeItemLoading,
        isAuth,
        __,
        addError,
        error
    }
};