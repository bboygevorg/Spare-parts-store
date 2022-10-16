import React from 'react';
import classes from './users.css';
import Typo from 'ui/Typo';
import User from './user';

const Users = (props) => {
    const { 
        __,
        width,
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

    return (
        <div className={classes.root}>
            {width > 784 ?
                <div className={classes.row}>
                    <Typo as="p" variant="p">{__("company.user.name")}</Typo>
                    <Typo as="p" variant="p">{__("company.user.email")}</Typo>
                    <Typo as="p" variant="p">{__("company.user.phone")}</Typo>
                    <Typo as="p" variant="p"></Typo>
                </div>
            : 
                null
            }
            {users.map(user => {
                return (
                    <User
                        key={user.id}
                        __={__}
                        width={width}
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        openedUser={openedUser}
                        setOpenedUser={setOpenedUser}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPageInfo={currentPageInfo}
                        setCurrentPageInfo={setCurrentPageInfo}
                        isOpenSearch={isOpenSearch}
                        setIsOpenSearch={setIsOpenSearch}
                        isOpenTemplates={isOpenTemplates}
                        setIsOpenTemplates={setIsOpenTemplates}
                        templates={templates}
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
                        handleGetUserCart={handleGetUserCart}
                        isFetchingTemplates={isFetchingTemplates}
                    />
                )
            })}
        </div>
    )
}

export default Users;