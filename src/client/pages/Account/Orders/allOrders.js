import React, { Fragment } from 'react';
import { useAllOrders } from 'talons/Account/useAllOrders';
import Pagination from 'components/Pagination';
import classes from './allOrders.css';
import Typo from 'ui/Typo';
import Loading from 'components/Loading';
import Order from './order';
import OrderModal from 'components/OrderModal';
import Modal from 'components/Modal';

const AllOrders = (props) => {
    const { __, setOpenedOrder, setView, isShopper } = props;
    const {
        placedOrders,
        getOrderDetails,
        fetchingPending,
        fetchingAll,
        totalPagesAll,
        currentPageAll,
        setCurrentPageAll,
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
            {!isShopper ?
                <Fragment>
                    {fetchingAll ?
                        <div className={classes.loadingWrapper}> 
                            <Loading /> 
                        </div>
                    :
                        placedOrders.length ?
                            <div className={classes.list}>
                                <Typo as="p" variant="h3" font="light" className={classes.title}>{__("Placed orders")}</Typo>
                                {placedOrders.map(order => 
                                    <div key={order.id}
                                        className={classes.orderWrapper}
                                        onClick={() => { setView('orderDetails'); getOrderDetails(order.id)}}
                                    >                                   
                                        <Order order={order} />
                                    </div>
                                )}
                            </div>
                    :
                        <Typo as="p" variant="p" font="regular">{__("No placed orders.")}</Typo>
                    }
                    {totalPagesAll > 1 ? 
                        <div className={classes.paginationWrapper}>
                            <Pagination setCurrentPage={setCurrentPageAll} currentPage={currentPageAll} totalPages={totalPagesAll}/> 
                        </div>
                    : null}
                </Fragment>
            : null}
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

export default AllOrders;