import React from 'react';
import { useCartTemplates } from 'talons/Account/useCartTemplates';
import classes from './cartTemplates.css';
import Head from 'components/Head';
import Tabs from '../tabs';
import BackStep from '../backStep';
import { STATIC_DESCRIPTION } from 'conf/consts';
import AppWrapper from 'ui/AppWrapper';
import Typo from 'ui/Typo';
import Templates from './templates';
import Modal from 'components/Modal';
import Delete from '../popup/delete';
import EditTemplate from './editTemplate';
import CompanySearch from './companySearch';

const CartTemplates = () => {
    const {
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
    } = useCartTemplates();

    let content;
    if(width <= 784) {
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="cart_templates" onClick={() => setView('list')}/>     
                        </div>       
                break;
            case 'list':
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            <div className={classes.content}>
                                <Typo as="h2" variant="h2" className={classes.title}>{__("Cart templates")}</Typo>
                                <Templates
                                    __={__}
                                    templates={templates}
                                    isSubmitting={isFetchingTemplates}
                                    setView={setView}
                                    companyRole={companyRole}
                                    selectToRemove={selectToRemove}
                                    setSelected={setSelected}
                                />
                            </div>
                        </div>
                break;
            default:
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('list')}>
                                <BackStep/>
                            </div>
                            <div className={classes.content}>
                                <Typo as="h2" variant="h2" className={classes.title}>{__("Cart templates")}</Typo>
                                <EditTemplate
                                    __={__}
                                    view={view}
                                    setView={setView}
                                    name={name}
                                    handleChangeName={handleChangeName}
                                    selected={selected}
                                    setSelected={setSelected}
                                    selectToRemove={selectToRemove}
                                    isOpenSearch={isOpenSearch}
                                    setIsOpenSearch={setIsOpenSearch}
                                    handleCreateTemplate={handleCreateTemplate}
                                    creatingCartTemplate={creatingCartTemplate}
                                    handleUpdateCartTemplate={handleUpdateCartTemplate}
                                    updatingCartTemplate={updatingCartTemplate}
                                    allSelectedItems={allSelectedItems}
                                    handleChangeSelected={handleChangeSelected}
                                    handleAddTemplateToCart={handleAddTemplateToCart}
                                    templateToCartLoad={templateToCartLoad}
                                    companyRole={companyRole}
                                />
                            </div>
                        </div>
                break;
        }
    } else {
        return (
            <div>
                <Head description={STATIC_DESCRIPTION}>
                    Cart templates
                </Head>
                <AppWrapper>
                    <div className={classes.root}>
                        <div className={classes.tabs}>
                            <Tabs active="cart_templates"/>     
                        </div>
                        <div className={classes.content}>
                            <Typo as="h2" variant="h2" className={classes.title}>{__("Cart templates")}</Typo>
                            {view === "create_template" || view === "edit_template" || view === "view_template" ? 
                                <EditTemplate
                                    __={__}
                                    view={view}
                                    setView={setView}
                                    name={name}
                                    handleChangeName={handleChangeName}
                                    selected={selected}
                                    setSelected={setSelected}
                                    selectToRemove={selectToRemove}
                                    isOpenSearch={isOpenSearch}
                                    setIsOpenSearch={setIsOpenSearch}
                                    handleCreateTemplate={handleCreateTemplate}
                                    creatingCartTemplate={creatingCartTemplate}
                                    handleUpdateCartTemplate={handleUpdateCartTemplate}
                                    updatingCartTemplate={updatingCartTemplate}
                                    allSelectedItems={allSelectedItems}
                                    handleChangeSelected={handleChangeSelected}
                                    handleAddTemplateToCart={handleAddTemplateToCart}
                                    templateToCartLoad={templateToCartLoad}
                                    companyRole={companyRole}
                                /> 
                            : 
                                <Templates
                                    __={__}
                                    templates={templates}
                                    isSubmitting={isFetchingTemplates}
                                    setView={setView}
                                    companyRole={companyRole}
                                    selectToRemove={selectToRemove}
                                    setSelected={setSelected}
                                />
                            }
                        </div>
                        <Modal
                            isShown={isOpenDelete}
                            onClose={() => setIsOpenDelete(false)}
                            className={classes.dialog}
                        >
                            <Delete
                                title={"Delete template"}
                                process={"DELETE"}
                                text={text}
                                onClose={() => setIsOpenDelete(false)}
                                isSubmitting={removingCartTemplate}
                                action={removeTemplate}
                            />
                        </Modal>
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
                                addAction={() => setIsOpenSearch(false)}
                                onClose={() => { setIsOpenSearch(false); setItemsPerPage([{all: false, page: 1, items: []}])}}
                            />
                        </Modal>
                    </div>
            </AppWrapper>
        </div>  
        )
    }

    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                Cart templates
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                   {content}
                </div>
            </AppWrapper>
            <Modal
                isShown={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                className={classes.dialog}
            >
                <Delete
                    title={"Delete template"}
                    process={"DELETE"}
                    text={text}
                    onClose={() => setIsOpenDelete(false)}
                    isSubmitting={removingCartTemplate}
                    action={removeTemplate}
                />
            </Modal>
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
                    addAction={() => setIsOpenSearch(false)}
                    onClose={() => { setIsOpenSearch(false); setItemsPerPage([{all: false, page: 1, items: []}])}}
                />
            </Modal>
        </div>
    );
};

export default CartTemplates;