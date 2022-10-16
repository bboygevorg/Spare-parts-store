import React from 'react';
import { useAllOrders } from 'talons/Account/useAllOrders';
import Pagination from 'components/Pagination';
import ShopperOrder from './shopperOrder';
import classes from './allOrders.css';
import Typo from 'ui/Typo';
import Loading from 'components/Loading';
import OrderModal from 'components/OrderModal';
import Modal from 'components/Modal';

const PendingOrders = (props) => {
    const { __, width, setOpenedOrder, setView, isShopper } = props;
    const {
        pendingOrders,
        getOrderDetails,
        fetchingPending,
        fetchingAll,
        currentPagePending,
        setCurrentPagePending,
        totalPagesPending,
        setShouldGetOrders,
        stripeLoad,
        approve3dError,
        approve3dSuccess,
        handleCloseMessageModal
    } = useAllOrders({ setOpenedOrder, setView });

    if(fetchingAll && fetchingPending || stripeLoad) {
        return (
            <div className={classes.loadingWrapper}> 
                <Loading /> 
            </div> 
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.pendingOrders}>
                {fetchingPending ?
                    <div className={classes.loadingWrapper}> 
                        <Loading /> 
                    </div> 
                :
                    pendingOrders.length ?
                        <div className={classes.list}>
                            <Typo as="p" variant="h3" font="light" className={classes.title}>{__("Pending orders")}</Typo>
                            {pendingOrders.map(order => 
                                <div key={order.id}
                                    className={classes.orderWrapper}
                                    onClick={() => { setView('orderDetails'); getOrderDetails(order.id)}}
                                >    
                                    <ShopperOrder 
                                        order={order} 
                                        __={__} 
                                        width={width} 
                                        setView={setView} 
                                        getOrderDetails={getOrderDetails}
                                        setShouldGetOrders={setShouldGetOrders} 
                                        isShopper={isShopper}
                                    />
                                </div>
                            )}
                        </div>
                :
                    <Typo as="p" variant="p" font="regular">{__("No pending orders.")}</Typo>
                }
                {totalPagesPending > 1 ? 
                    <div className={classes.paginationWrapper}>
                        <Pagination setCurrentPage={setCurrentPagePending} currentPage={currentPagePending} totalPages={totalPagesPending}/> 
                    </div>
                : null}
            </div>
            <Modal
                isShown={approve3dError}
                hideClose
                onClose={handleCloseMessageModal}
                className={classes.dialog}
            >
                <OrderModal action={handleCloseMessageModal} orderPlaced={false} message={approve3dError}/>
            </Modal>
            <Modal
                isShown={approve3dSuccess}
                onClose={handleCloseMessageModal}
                className={classes.dialog}
            >
                <div className={classes.messageBlock}>
                    <Typo as="p" variant="p" font="regular">{__(approve3dSuccess)}</Typo>
                </div>
            </Modal>
        </div>
    );
}

export default PendingOrders;