import React, { useCallback, useMemo } from 'react';
import classes from './user.css';
import Typo from 'ui/Typo';
import isEmpty from 'lodash/isEmpty';
import CartDetails from './cartDetails';
import Dropdown from 'icons/Dropdown';

const User = (props) => {
    const { 
        __,
        width,
        user,
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
    } = props;

    const isSelected = useMemo(() => {
        if(!isEmpty(openedUser) && openedUser.id === user.id) {
            return true;
        }
        else {
            return false;
        }
    }, [openedUser, user]);

    const handleSelect = useCallback((user) => {
        if(isSelected) {
            setOpenedUser({});
        } else { 
            setOpenedUser(user);
            handleGetUserCart(user);
        }
    }, [isSelected]);

    return (
        <div className={classes.root}>
            {width > 784 ?
                <div className={classes.row}>
                    <Typo as="p" variant="p" font="light" color={isSelected ? "darkSecondary" : "primary"} className={classes.name}>{user.name}</Typo>
                    <Typo as="p" variant="p" font="light"  color={isSelected ? "darkSecondary" : "primary"} className={classes.email}>{user.email}</Typo>
                    <Typo as="p" variant="p" font="light"  color={isSelected ? "darkSecondary" : "primary"}>{user.phone}</Typo>
                    <Typo as="p" variant="p"  color={isSelected ? "darkSecondary" : "primary"} className={classes.cartViewTitle} onClick={() => handleSelect(user)}>{isSelected ? __("Close Cart") : __("View Cart")}</Typo>
                </div>
            :
                <div className={classes.header}>
                    <Typo as="p" variant="px" font={isSelected ? "light" : "condensed"}>{user.name}</Typo>
                    <div className={`${classes.dropDown} ${isSelected ? classes.opened : ""}`} onClick={() => handleSelect(user)}>
                        <Dropdown/>
                    </div>
                </div>
            }
            {isSelected
                ? 
                    <CartDetails
                        __={__}
                        width={width}
                        users={users}
                        setUsers={setUsers}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPageInfo={currentPageInfo}
                        setCurrentPageInfo={setCurrentPageInfo}
                        isOpenSearch={isOpenSearch}
                        setIsOpenSearch={setIsOpenSearch}
                        isOpenTemplates={isOpenTemplates}
                        setIsOpenTemplates={setIsOpenTemplates}
                        templates={templates}
                        openedUser={openedUser}
                        setOpenedUser={setOpenedUser}
                        handleAddItemsToCart={handleAddItemsToCart}
                        addingItemLoading={addingItemLoading}
                        handleRemoveItem={handleRemoveItem}
                        removingItemLoading={removingItemLoading}
                        updateItemFromCart={updateItemFromCart}
                        updateItemLoading={updateItemLoading}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        handleTruncateCart={handleTruncateCart}
                        removingAllItems={removingAllItems}
                        isFetchingCart={isFetchingCart}
                        isFetchingTemplates={isFetchingTemplates}
                    />
                :
                    null
            }
        </div>
    );
};

export default User;