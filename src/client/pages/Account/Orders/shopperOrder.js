import Typo from 'ui/Typo';
import React, { Fragment } from 'react';
import { useShopperOrder } from 'talons/Account/useShopperOrder';
import defaultClasses from './shopperOrder.css';
import { mergeClasses } from 'helper/mergeClasses'
import Arrow from 'icons/Arrow';
import OrderItem from './orderItem';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Reject from '../popup/reject';
import { firstUpperCase, bytesForHuman } from 'helper/utils';
import Pdf from '../pdf.png';
import isEmpty from 'lodash/isEmpty';
import CartItems from '../CartManagement/cartItems';
import CompanySearch from '../CartTemplates/companySearch';
import TemplatesList from '../popup/templatesList';
import Confirmation from 'components/Confirmation';
import OrderModal from 'components/OrderModal';
import Loading from "components/Loading";
import defaulClasses from "./order.css";

const ShopperOrder = ({ __, width, setView, order, getOrderDetails, setShouldGetOrders, isShopper, inOrderDetails }) => {
    const {
        isOpen,
        handleOpen,
        createdAt,
        totals,
        items,
        requestStatus,
        requestPayment,
        shippingAddress,
        billingAddress,
        customer,
        isOpenReject,
        handleCloseReject,
        handleOpenReject,
        handleApproveOrder,
        approveLoading,
        rejectComment,
        setRejectComment,
        handleRejectOrder,
        rejectLoading,
        attachments,
        serviceOrder,
        message,
        handleCloseMessageModal,
        changingOrder,
        setChangingOrder,
        handleUpdateOrder,
        updateLoading,
        isOpenSearch,
        setIsOpenSearch,
        itemsPerPage,
        setItemsPerPage,
        currentPageInfo,
        setCurrentPageInfo,
        isOpenTemplates,
        setIsOpenTemplates,
        templates,
        selectedTemplate,
        setSelectedTemplate,
        isFetchingTemplates,
        handleAddItemsToOrder,
        isOpenDelete,
        setIsOpenDelete,
        handleDeleteOrder,
        deleteLoading,
        isOpenReorderModal,
        setIsOpenReorderModal,
        handleReorder,
        reorderLoading,
        isMerging,
        clearCartData,
        submittingClear,
        approveError,
        isApprove
    } = useShopperOrder({ order, getOrderDetails, setShouldGetOrders, setView });
    const { grandTotal, taxAmount, subtotal, shippingAmount } = totals;
    const endingOfItemsCount = items.length > 1  ? "items" : "item";
    const classes = mergeClasses(defaulClasses, defaultClasses)

    return (
        <div className={`${classes.root} ${inOrderDetails && classes.detailWrapper}`}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <div className={classes.left}>
                        <Typo as="p" variant="px" font="light" className={classes.date}>{createdAt}</Typo>
                        <Typo as="p" variant="px" color="darkSecondary" className={classes.status}>{requestStatus}</Typo>
                    </div>
                    <section className={classes.headerInfo}>
                        <Typo as="p" variant="pxs" color="code" font="regular">
                            {__("Shopper")}: {customer.firstname} {customer.lastname}
                        </Typo>
                        <Typo as="p" variant="pxs" color="code" font="regular">
                            {__("Total")}: {items.length} {__(endingOfItemsCount)}
                        </Typo>
                    </section>
                </div>
                {!inOrderDetails ?
                    <div className={`${classes.arrow} ${isOpen && classes.opened}`} onClick={handleOpen}>
                        <Arrow/>
                    </div>
                :
                    null
                }
            </div>
            {isOpen || inOrderDetails ?
                !shippingAddress && !isEmpty(serviceOrder)
            ?
                <div className={classes.main}>
                    <div className={classes.courierInfo}>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Delivery"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{items[0].name}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Payment"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{requestPayment}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Contact name at pickup location"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.contactName}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Order reference number"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.orderReferenceNumber || "-"}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Phone number at pickup location"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.phoneNumber}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("from"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.fromAddress}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Company name at pickup location"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.companyName || "-"}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("to"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.toAddress || "-"}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Notes"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.note || "-"}</Typo>
                            </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("at"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{serviceOrder.deliveryTimeRange}</Typo>
                        </div>
                        <div className={classes.row}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Billing address"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">{billingAddress.street && billingAddress.street[0]}, {billingAddress.city}, {billingAddress.postcode}
                                {billingAddress.region && `, ${billingAddress.region.name}`}{billingAddress.country && `, ${billingAddress.country.name}`}
                            </Typo>
                        </div>
                    </div>
                    <div className={classes.totals}>
                        <div className={classes.totalRow}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Product Total"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">${subtotal.toFixed(2)}</Typo>
                        </div>
                        <div className={classes.totalRow}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Discount amount"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">-${totals.discountAmount.toFixed(2)}</Typo>
                        </div>
                        <div className={classes.totalRow}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Taxes"))}</Typo>
                            <Typo as="p" variant="px" font="regular">${taxAmount.toFixed(2)}</Typo>
                        </div>
                        <div className={classes.totalRow}>
                            <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Total"))}:</Typo>
                            <Typo as="p" variant="px" font="regular">${grandTotal.toFixed(2)}</Typo>
                        </div>
                    </div>
                    <div className={classes.actions}>
                        {!isShopper ?
                            <Fragment>
                                <Button
                                    type="delete"
                                    label={__("Reject order")}
                                    classes={{button_delete: classes.rejectButton}}
                                    onClick={() => handleOpenReject(order)}
                                />
                                <Button
                                    label={__("Approve order")}
                                    classes={{button_primary: classes.approveButton}}
                                    onClick={() => handleApproveOrder(order.id)}
                                    isSubmitting={approveLoading}
                                />
                            </Fragment>
                        :
                            <Button
                                type="delete"
                                label={__("Remove")}
                                classes={{button_delete: classes.removeButton}}
                                onClick={() => setIsOpenDelete(true)}
                            />
                        }
                    </div>
                    {attachments.length ?
                        <div className={classes.attachments}>
                            <Typo as="p" variant="px" font="bold">{__("Attached files")}:</Typo>
                            <div className={classes.files}>
                                {attachments.map((el, i) =>
                                    <div key={i} className={classes.file}>
                                        {el.name.includes("pdf") ?
                                            <a href={el.url}>
                                                <div className={classes.pdfFile}>
                                                <img src={Pdf} className={classes.pdf}/>
                                                <Typo as="p" variant="pxs" font="bold" className={classes.name}>{el.name}</Typo>
                                                <Typo as="p" variant="pxs" font="regular" className={classes.size}>{bytesForHuman(el.size)}</Typo>
                                                </div>
                                            </a>
                                        :
                                            <a href={el.url}>
                                                <img src={el.url} className={classes.fileImg}/>
                                                <Typo as="p" variant="pxs" font="bold" className={classes.name}>{el.name}</Typo>
                                                <Typo as="p" variant="pxs" font="regular" className={classes.size}>{bytesForHuman(el.size)}</Typo>
                                            </a>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    :
                        null
                    }
                </div>
            :
                <div className={classes.content}>
                    <div className={classes.details}>
                        <div>
                            {shippingAddress && <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold" className={classes.infoTitle}>{__("Delivery address")}:</Typo>
                                <Typo as="p" variant="px" font="regular">{shippingAddress.street && shippingAddress.street[0]}, {shippingAddress.city}, {shippingAddress.postcode}
                                    {shippingAddress.region && `, ${shippingAddress.region.name}`}{shippingAddress.country && `, ${shippingAddress.country.name}`}</Typo>
                            </div>}
                            <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold" className={classes.infoTitle}>{__("Payment method")}:</Typo>
                                <Typo as="p" variant="px" font="regular">{requestPayment}</Typo>
                            </div>
                            <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold" className={classes.infoTitle}>{__("Order date")}:</Typo>
                                <Typo as="p" variant="px" font="regular">{createdAt}</Typo>
                            </div>
                        </div>
                        <div>
                            {shippingAmount ? (
                                <div className={classes.infoBlock}>
                                    <Typo as="p" variant="px" font="bold"
                                          className={classes.title}>{firstUpperCase(__("Delivery"))}:</Typo>
                                    <Typo as="p" variant="px" font="regular">${shippingAmount.toFixed(2)}</Typo>
                                </div>
                            ) : ''}
                            <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold"
                                      className={classes.title}>{firstUpperCase(__("Taxes"))}:</Typo>
                                <Typo as="p" variant="px" font="regular">${taxAmount.toFixed(2)}</Typo>
                            </div>
                            <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold" className={classes.infoTitle}>{__("Total price")}:</Typo>
                                <Typo as="p" variant="px" font="regular">${grandTotal.toFixed(2)}</Typo>
                            </div>
                            <div className={classes.infoBlock}>
                                <Typo as="p" variant="px" font="bold" className={classes.infoTitle}>{__("Order status")}:</Typo>
                                <Typo as="p" variant="px" font="regular" className={classes.status}>{requestStatus}</Typo>
                            </div>
                        </div>
                    </div>
                    <div className={classes.actions}>
                        {isEmpty(changingOrder)
                        ?
                            !isShopper
                            ?
                                <Fragment>
                                    <Button
                                        type="delete"
                                        label={__("Reject order")}
                                        classes={{button_delete: classes.rejectButton}}
                                        onClick={() => handleOpenReject(order)}
                                    />
                                    <Button
                                        label={__("Approve order")}
                                        classes={{button_primary: classes.approveButton}}
                                        onClick={() => handleApproveOrder(order.id)}
                                        isSubmitting={approveLoading}
                                    />
                                </Fragment>
                            :
                                <Button
                                    type="delete"
                                    label={__("Remove")}
                                    classes={{button_delete: classes.removeButton}}
                                    onClick={() => setIsOpenDelete(true)}
                                />
                        :
                            <Button
                                label={__("Cancel")}
                                classes={{button_primary: classes.approveButton}}
                                onClick={() => setChangingOrder({})}
                            />
                        }
                        {!isShopper || requestStatus === "pending" ?
                            <Button
                                type="bordered"
                                label={isEmpty(changingOrder) ? __("Edit order") : __("Save changes")}
                                classes={{button_bordered: classes.editButton}}
                                onClick={() => {if(isEmpty(changingOrder)) { setChangingOrder(order)} else { handleUpdateOrder() }}}
                                isSubmitting={updateLoading}
                                disabled={!isEmpty(changingOrder) && !changingOrder.items.length ? true : false}
                            />
                        : null}
                    </div>
                    {!isEmpty(changingOrder) &&
                        <div className={classes.addActions}>
                            <Button
                                label={__("Search")}
                                onClick={() => setIsOpenSearch(true)}
                                classes={{button_primary: classes.searchBtn}}
                            />
                            <Typo as="p" variant="p" font="light" className={classes.addFromTemplate} onClick={() => setIsOpenTemplates(true)}>{__("Add products from templates")}</Typo>
                        </div>
                    }
                    <div className={classes.items}>
                        {isEmpty(changingOrder) ?
                            <Fragment>
                                <Typo as="p" variant="px" font="bold" className={classes.itemCount}>
                                    {items.length} {__(endingOfItemsCount)}
                                </Typo>
                                <div className={classes.mainItems}>
                                    {items.map((e, i) => (
                                        <OrderItem item={e} key={i} classes={{root: classes.itemRoot}}/>
                                    ))}
                                </div>
                            </Fragment>
                        :
                            <div className={classes.items}>
                                <CartItems
                                    __={__}
                                    width={width}
                                    cart={changingOrder}
                                    isOrder={true}
                                    setChangingOrder={setChangingOrder}
                                />
                            </div>
                        }
                    </div>
                    {isShopper && requestStatus === "rejected"
                        ?
                            <Button
                                label={__("Reorder")}
                                classes={{button_primary: classes.reorderButton}}
                                onClick={() => handleReorder()}
                                isSubmitting={!isMerging && !submittingClear && reorderLoading}
                            />
                        :
                            null
                    }
                </div>
            :
                null
            }
            <Modal
                isShown={isOpenReject}
                onClose={handleCloseReject}
                className={classes.rejectedModal}
            >
                <Reject
                    __={__}
                    rejectComment={rejectComment}
                    setRejectComment={setRejectComment}
                    handleRejectOrder={handleRejectOrder}
                    rejectLoading={rejectLoading}
                />
            </Modal>
            <Modal
              isShown={isApprove}
              hideClose
              onClose={handleCloseMessageModal}
              className={classes.dialog}
            >
              {message ?
                <div className={classes.messageBlock}><Typo as="p" variant="p" font="regular">{__(message)}</Typo></div>
                :
                <div className={classes.loadingWrapper}>
                  <Loading />
                </div>
              }
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
                    addAction={handleAddItemsToOrder}
                    onClose={() => { setIsOpenSearch(false); setItemsPerPage([{all: false, page: 1, items: []}])}}
                    addButtonLabel={__("ADD TO ORDER")}
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
                    handleAddItemsToCart={handleAddItemsToOrder}
                    isFetchingTemplates={isFetchingTemplates}
                    addButtonLabel={__("Add products to order")}
                />
            </Modal>
            <Confirmation
                isShown={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                action={handleDeleteOrder}
                text={__("Are you sure you want to remove this pending order?")}
                isSubmitting={deleteLoading}
            />
            <Modal
                isShown={isOpenReorderModal}
                onClose={() => setIsOpenReorderModal(false)}
                className={classes.reorderDialog}
            >
                <div className={classes.reorderMessagePopup}>
                    <Typo as="h3" variant="h3" className={classes.message}>{__("There are items in your cart.")}</Typo>
                    <div className={classes.reorderActions}>
                        <Button
                            label={__("Merge items")}
                            classes={{button_primary: classes.yesButton}}
                            onClick={() => handleReorder(true)}
                            isSubmitting={isMerging}
                        />
                        <Button
                            label={__("Clear cart and add")}
                            type="bordered"
                            classes={{button_bordered: classes.noButton}}
                            onClick={clearCartData}
                            isSubmitting={submittingClear}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isShown={isApprove}
                hideClose
                onClose={handleCloseMessageModal}
                className={classes.dialog}
            >
              {approveError ?
                <OrderModal action={handleCloseMessageModal} orderPlaced={false} message={approveError}/>
                :
                <div className={classes.loadingWrapper}>
                  <Loading />
                </div>
              }
            </Modal>
        </div>
    );
};

export default ShopperOrder;