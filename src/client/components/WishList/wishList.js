import React, { Fragment } from 'react';
import { GET_WISHLISTS, GET_WISHLIST_ITEMS } from 'api/query';
import { ADD_WISHLIST, DELETE_WISHLIST, REMOVE_ITEM_FROM_WISHLIST } from 'api/mutation';
import { useWishList } from 'talons/FilteredProducts/useWishList';
import Loading from 'components/Loading';
import classes from './wishList.css';
import Typo from 'ui/Typo';
import AppWrapper from "components/UI/AppWrapper/index";
import Close from 'icons/Close';
import Confirmation from 'components/Confirmation';
import isEmpty from 'lodash/isEmpty';
import CreateWishList from './createWishList';
import ProductCard from "components/ProductCard";

const WishList = () => {
    const { 
        categories,
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
    } = useWishList({
        getWishListsQuery: GET_WISHLISTS,
        addWishListMutation: ADD_WISHLIST,
        deleteWishListMutation: DELETE_WISHLIST,
        getWishListItemsQuery: GET_WISHLIST_ITEMS,
        removeItemFromWishList: REMOVE_ITEM_FROM_WISHLIST
    });

    if(!isAuth) {
        return (
            <Typo as="h1" variant="h1" className={classes.messageForGuest}>{__("Login to your account to see your favorites.")}</Typo>
        );
    }
    else
    if(!categories.length || isEmpty(active)) {
        return (
            <div className={classes.loadingWrapper}>
                <Loading />
            </div>
        )
    }

    if(error) {
        return (
            <div>
                <h3>{error}</h3>
            </div>
        )
    }

    return (
        <AppWrapper>
            <div className={classes.root}>
                <div className={classes.left}>
                    <div className={classes.leftHeader}>
                        <Typo as="h2" variant="h2" className={classes.headerTitle}>{__("MY WISH LIST")}</Typo>
                        {categories.map((category, index) => 
                            <div key={index} className={classes.category}>
                                {active.id === category.id ? <div className={classes.activeBorder}></div> : null}
                                <Typo 
                                    as="p" 
                                    variant="p" 
                                    font={active.id === category.id ? "bold" : "regular"} 
                                    color={active.id === category.id ? "secondary" : "primary"} 
                                    className={classes.name}
                                    onClick={() => setActive(category)}
                                >
                                    {category.name}
                                </Typo>
                                {category.id !== "0" ?
                                    <span className={classes.closeIcon} onClick={() => {
                                            if(category.id === active.id) {
                                                setActive(categories[0]);
                                            }
                                            setRemovedCategory(category); 
                                            handleOpenModal()
                                        }}
                                    >
                                        <Close/>
                                    </span>
                                    :
                                    null
                                }
                            </div>
                        )}
                    </div>
                    <div className={classes.leftFooter}>
                        <CreateWishList
                            value={value}
                            setValue={setValue}
                            handleAddWishList={handleAddWishList}
                            addLoading={addLoading}
                            error={addError}
                        />
                    </div>
                </div>
                <div className={classes.right}>
                    { isFetchingItems || removeItemLoading ?
                            <div className={classes.loadingWrapperProducts}>
                                <Loading />
                            </div>
                        :
                            items.length
                        ?
                            <Fragment>
                                {items.map((product, index) => 
                                    <ProductCard 
                                        key={index} 
                                        product={product} 
                                        large={false} 
                                        isFavorites={true}
                                        removeItem={handleRemoveItem}
                                    />
                                )}
                            </Fragment>
                        : 
                            <Typo as="h2" variant="h2" className={classes.emptyMessage}>{__("This wish list is empty.")}</Typo>
                    }
                </div>
                <Confirmation
                    isShown={isOpenModal}
                    onClose={handleCloseModal}
                    action={handleDeleteWishList}
                    text={`${__("Are you sure you want to delete the wish list")} ${!isEmpty(removedCategory) && removedCategory.name}?`}
                />
            </div>
        </AppWrapper>
    );
};

export default WishList;