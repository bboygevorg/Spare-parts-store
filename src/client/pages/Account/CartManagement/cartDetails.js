import React, { Fragment } from 'react';
import CompanySearch from '../CartTemplates/companySearch';
import classes from './cartDetails.css';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Typo from 'ui/Typo';
import TemplatesList from '../popup/templatesList';
import isEmpty from 'lodash/isEmpty';
import CartItems from './cartItems';
import Loading from 'components/Loading';

const CartDetails = (props) => {
    const {
        __,
        width,
        users,
        setUsers,
        itemsPerPage,
        setItemsPerPage,
        currentPageInfo,
        setCurrentPageInfo,
        isOpenSearch,
        setIsOpenSearch,
        isOpenTemplates,
        setIsOpenTemplates,
        templates,
        openedUser,
        setOpenedUser,
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
        isFetchingTemplates
    } = props;

    return (
        <div className={classes.root}>
            {width <= 784 ?
                <div className={classes.details}>
                   <div className={classes.rowMobile}>
                        <Typo as="p" variant="px">{__("company.user.email")}</Typo>
                        <Typo as="p" variant="px" font="light">{openedUser.email}</Typo>
                    </div>
                    <div className={classes.rowMobile}>
                        <Typo as="p" variant="px">{__("company.user.phone")}</Typo>
                        <Typo as="p" variant="px" font="light">{openedUser.phone}</Typo>
                    </div>
                </div>
            :
                null
            }
            <div className={classes.top}>
               <Button
                    label={__("Search")}
                    onClick={() => setIsOpenSearch(true)}
                    classes={{button_primary: classes.searchBtn}}
               />
               <div className={`${classes.topRight} ${openedUser.cart && openedUser.cart.items && openedUser.cart.items.length && classes.withRemove}`}>
                   <Typo as="p" variant="p" font="light" className={classes.addFromTemplate} onClick={() => setIsOpenTemplates(true)}>{__("Add products from templates")}</Typo>
                   {openedUser.cart && openedUser.cart.items && openedUser.cart.items.length ?
                        <Button
                            label={__("Remove all products")}
                            type="bordered"
                            classes={{button_bordered: classes.removeAllButton}}
                            onClick={handleTruncateCart}
                            isSubmitting={removingAllItems}
                        />
                    : null}
               </div>
            </div>
            <div className={classes.cartContent}>
                {isFetchingCart ?
                    <div className={classes.loadingWrapper}>
                        <Loading/>
                    </div>
                :
                    !isEmpty(openedUser) && openedUser.cart ?
                        <Fragment>
                            <CartItems
                                __={__}
                                width={width}
                                cart={openedUser.cart}
                                handleRemoveItem={handleRemoveItem}
                                removingItemLoading={removingItemLoading}
                                updateItemFromCart={updateItemFromCart}
                                updateItemLoading={updateItemLoading}
                                openedUser={openedUser}
                                users={users}
                                setUsers={setUsers}
                                setOpenedUser={setOpenedUser}
                            />
                           {openedUser.cart.totals && openedUser.cart.totals.grandTotal ?
                                <div className={classes.data}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <div className={classes.grandTotal}>
                                        <Typo as="p" variant="p" className={classes.totalTitle}>{__("Grand total")}</Typo>
                                        <Typo as="p" variant="p">{'$' + openedUser.cart.totals.grandTotal.toFixed(2)}</Typo>
                                    </div>
                                    <span></span>        
                                </div>
                            :
                                null
                            }
                        </Fragment>
                : null}
            </div>
            <Modal
                isShown={isOpenSearch}
                onClose={() => { setItemsPerPage([{all: false, page: 1, items: []}]); setIsOpenSearch(false)}}
                className={classes.searchModal}
            >
                <CompanySearch
                    __={__}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    currentPageInfo={currentPageInfo}
                    setCurrentPageInfo={setCurrentPageInfo}
                    addAction={handleAddItemsToCart}
                    onClose={() => { setIsOpenSearch(false); setItemsPerPage([{all: false, page: 1, items: []}])}}
                    addButtonLabel={__("ADD TO CART")}
                    isSubmitting={addingItemLoading}
                />
            </Modal>
            <Modal
                isShown={isOpenTemplates}
                onClose={() => setIsOpenTemplates(false)}
                className={classes.templatesModal}
            >
                <TemplatesList
                    __={__}
                    width={width}
                    templates={templates} 
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    handleAddItemsToCart={handleAddItemsToCart}
                    isSubmitting={addingItemLoading}
                    isFetchingTemplates={isFetchingTemplates}
                    addButtonLabel={__("Add products to cart")}
                />
            </Modal>
        </div>
    );
};

export default CartDetails;