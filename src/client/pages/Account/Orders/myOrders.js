import React, { Fragment } from 'react';
import classes from './myOrders.css';
import Pagination from 'components/Pagination';
import Order from './order';
import Loading from 'components/Loading';
import Typo from 'ui/Typo';
import { useMyOrders } from 'talons/Account/useMyOrders';
import { GET_ORDERS } from 'api/query';

const MyOrders = (props) => {
    const { __, dateFormat, setOpenedOrder, setView } = props;
    const { 
        orders, 
        getOrderDetails, 
        loading, 
        currentPage, 
        setCurrentPage, 
        totalPages
    } = useMyOrders({getOrdersQuery: GET_ORDERS, setOpenedOrder});

    return (
        <div className={classes.root}>
            {loading ? 
                <div className={classes.loadingWrapper}> <Loading /> </div> 
            : 
                !orders.length 
            ? 
                <Typo as="h3" variant="h3">{__("There are no orders yet.")}</Typo>
            :
                <Fragment>
                    <div className={classes.items}>
                        {orders.slice(0).map((order, index) => 
                                index <= 1 && currentPage === 1
                            ?
                                    index === 0 
                                ?
                                    <div key={index}
                                        className={classes.orderWrapper}
                                        onClick={() => {setView('orderDetails'); getOrderDetails(order.id)}}
                                    >                                   
                                        <Typo as="p" variant="p" font="condensed" className={classes.date}>{__("Latest Orders")}</Typo>
                                        <Order order={order} />
                                    </div>
                                :
                                    <div key={index}
                                        className={classes.orderWrapper}
                                        onClick={() => {setView('orderDetails'); getOrderDetails(order.id)}}
                                    >
                                        <Order order={order} />
                                    </div>
                            :   
                                <div key={index}
                                    className={classes.orderWrapper}
                                    onClick={() => {setView('orderDetails'); getOrderDetails(order.id)}}
                                >                                   
                                    <Typo as="p" variant="p" font="condensed" className={classes.date}>{dateFormat(order.createdAt)}</Typo>
                                    <Order order={order} />
                                </div>
                            )
                        }
                    </div>
                </Fragment>
            }
            {totalPages > 1 ? <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/> : null}
        </div>
    );
};

export default MyOrders;