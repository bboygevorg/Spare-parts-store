import React, { useState } from 'react';
import Typo from 'ui/Typo';
import classes from './selectWishList.css';
import { useSelector, useDispatch } from 'react-redux';
import CreateWishList from './createWishList';
import { ADD_WISHLIST, ADD_ITEM_TO_WISHLIST, REMOVE_ITEM_FROM_WISHLIST } from 'api/mutation';
import { GET_ALL_WISHLIST_ITEMS, GET_WISHLISTS } from 'api/query';
import { useMutation } from '@apollo/react-hooks';
import { actions } from 'actions/wishList';
import useTranslation from 'talons/useTranslation';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { getMessage } from 'helper/errors';
import Button from 'components/Button';
import isEmpty from 'lodash/isEmpty';

const SelectWishList = (props) => {
    const { product, onClose, setInWishList, type } = props;
    const [value, setValue] = useState("");
    const [selected, setSelected] = useState([]);
    const [addError, setAddError] = useState("")
    const [error, setError] = useState("");
    const wishLists = useSelector(state => state.wishList.categories);
    const customerToken = useSelector(state => state.signin.customerData.customerToken);
    const [ addWishList, { loading: addLoading } ] = useMutation(ADD_WISHLIST);
    const [ addItem, { loading: addItemLoading } ] = useMutation(ADD_ITEM_TO_WISHLIST);
    const [removeItemFromWishlist, { loading: removeItemLoading }] = useMutation(REMOVE_ITEM_FROM_WISHLIST);
    const getAllWishlistItems = useAwaitQuery(GET_ALL_WISHLIST_ITEMS);
    const getWishLists = useAwaitQuery(GET_WISHLISTS);

    const dispatch = useDispatch();
    const __ = useTranslation();

    if(!wishLists.length) {
        return null;
    }

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
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setAddError(message);
        }
    };

    const handleAddItem = async () => {
        try {
            const res = await addItem({
                variables: {
                    customerToken,
                    sku: product.objectID,
                    wishlistIds: selected
                },
                fetchPolicy: "no-cache",
            });
            if(res && res.data && res.data.addItemToWishlist) {
                const allItems = await getAllWishlistItems({
                    variables: {
                    customerToken
                    },
                    fetchPolicy: "no-cache"
                });
                setError("");
                dispatch(actions.setAllItems(allItems.data.getAllWishlistItems));
                setInWishList(true);
                onClose();
            }
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    };

    const handleRemoveItem = async () => {
        try {
            const res = await removeItemFromWishlist({
                variables: {
                  customerToken,
                  wishlistItemIds: selected
      
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.removeItemsFromWishlist) {
                const allItems = await getAllWishlistItems({
                    variables: {
                        customerToken
                    },
                    fetchPolicy: "no-cache"
                });
                setError("");
                dispatch(actions.setAllItems(allItems.data.getAllWishlistItems));
                if(selected.length === product.wishList.length) {
                    setInWishList(false);
                }
                onClose();
            }
        } catch(error) {
            const parseError = JSON.parse(JSON.stringify(error));
            const code = parseError && parseError.graphQLErrors && parseError.graphQLErrors[0] && parseError.graphQLErrors[0].message;
            const message = getMessage(code);
            setError(message);
        }
    }

    const handleSetActive = (id) => {
        if(selected.includes(id)) {
            const arr = [...selected];
            const removedIndex = selected.findIndex(el => el === id);
            arr.splice(removedIndex,1);
            setSelected(arr);
        }
        else {
            let arr = [...selected, id];
            setSelected(arr);
        }
    }

    if(type === 'add') {
        return (
            <div className={classes.root}>
                <div className={classes.top}>
                    <Typo as="h3" variant="h3">{__("Please choose a Wish List for the selected product")}</Typo>
                    <div className={classes.categoryList}>
                        {wishLists.map((category, index) => 
                            <div key={index} className={selected.includes(parseInt(category.id)) ? classes.selectedCategory : classes.category} onClick={() => handleSetActive(parseInt(category.id))}>
                                <Typo as="p" variant="p" font="regular" className={selected.includes(parseInt(category.id)) ? classes.selectedName : classes.name}>{category.name}</Typo>
                            </div>
                        )}
                    </div>
                    {error ? <p className={classes.error}>{__(error)}</p> : null}
                </div>
                <div className={classes.bottom}>
                    <CreateWishList
                        value={value}
                        setValue={setValue}
                        handleAddWishList={handleAddWishList}
                        addLoading={addLoading}
                        fromModal={true}
                        error={addError}
                    />
                </div>
                <Button
                    onClick={handleAddItem}
                    label={__("ADD TO WISHLIST")}
                    classes={{ button_primary: classes.addButton }}
                    disabled={!selected.length}
                    isSubmitting={addItemLoading}
                />
            </div>
        );
    }

    if(type === 'remove') {
        return (
            <div className={classes.root}>
                <div className={classes.top}>
                    <Typo as="h3" variant="h3">{__("Remove product from list")}</Typo>
                    <div className={classes.categoryList}>
                        {!isEmpty(product) && product.wishList && product.wishList.length && product.wishList.map((category, index) => 
                            <div key={index} className={selected.includes(category.itemId) ? classes.selectedCategory : classes.category} onClick={() => handleSetActive(category.itemId)}>
                                <Typo as="p" variant="p" font="regular" className={selected.includes(category.itemId) ? classes.selectedName : classes.name}>{category.wishlistName}</Typo>
                            </div>
                        )}
                    </div>
                    {error ? <p className={classes.error}>{__(error)}</p> : null}
                </div>
                <Button
                    onClick={handleRemoveItem}
                    label={__("REMOVE FROM LIST")}
                    classes={{ button_primary: classes.addButton }}
                    disabled={!selected.length}
                    isSubmitting={removeItemLoading}
                />
            </div>
        );
    }
};

export default SelectWishList;