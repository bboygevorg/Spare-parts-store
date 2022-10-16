import React, { useMemo } from 'react';
import Head from 'components/Head';
import AppWrapper from 'ui/AppWrapper';
import Tabs from '../tabs';
import classes from './cartManagement.css';
import { STATIC_DESCRIPTION } from 'conf/consts';
import Typo from 'ui/Typo';
import { useCartManagement } from 'talons/Account/useCartManagement';
import Users from './users';
import BackStep from '../backStep';
import Loading from 'components/Loading';

const CartManagement = () => {
    const { 
        __,
        width,
        view,
        setView,
        isFetchingUsers,
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
    } = useCartManagement();

    const cartContent = useMemo(() => {
        return  (
            <div className={classes.content}>
                <div className={classes.header}>
                    <Typo as="h2" variant="h2" className={classes.title}>{__("Cart management")}</Typo>
                </div>
                {!isFetchingUsers ? users.length ? 
                    <div className={classes.footer}>
                        <Users
                            __={__}
                            width={width}
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
                    </div>
                :
                    <Typo as="p" variant="p" font="regular" className={classes.noResult}>{__("No results.")}</Typo>
                :
                    <div className={classes.loadingWrapper}>
                        <Loading/>
                    </div>
                }
            </div>
        )
    });

    let content;
    if(width <= 784) {
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="cart_management" onClick={() => setView('carts')}/>     
                          </div>       
                break;
            case 'carts':
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            {cartContent}
                          </div>
                break;
            default:
                content = <div className={classes.tabs}>
                            <Tabs active="cart_management" onClick={() => setView('carts')}/>     
                          </div>
                break; 
        }
    } else {
        return (
              <div>
                    <Head description={STATIC_DESCRIPTION}>
                        Cart management
                    </Head>
                    <AppWrapper>
                        <div className={classes.root}>
                            <div className={classes.tabs}>
                                <Tabs active="cart_management"/>     
                            </div>
                            {cartContent}
                        </div>
                    </AppWrapper>
              </div>
              
          )
      }

    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                Cart management
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                   {content}
                </div>
            </AppWrapper>
        </div>
    );
};

export default CartManagement;