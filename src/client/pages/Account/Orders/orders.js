import React from 'react';
import defaultClasses from './orders.css';
import {mergeClasses} from 'helper/mergeClasses';
import Tabs from '../tabs';
import Order from './order';
import { STATIC_DESCRIPTION } from 'conf/consts';
import BackStep from '../backStep';
import AppWrapper from 'components/UI/AppWrapper/index';
import Head from 'components/Head';
import OrdersContent from './ordersContent';
import { useOrders } from 'talons/Account/useOrders';
import ShopperOrder from './shopperOrder';
import { useAllOrders } from 'talons/Account/useAllOrders';

const Orders = props => {
    const {
        __,
        width,
        dateFormat,
        isShopper,
        isMobile,
        view,
        setView,
        section,
        setSection,
        openedOrder,
        setOpenedOrder,
        isOwnerWithoutCompany
    } = useOrders();
    const {
        setShouldGetOrders
    } = useAllOrders({ setOpenedOrder });

    const classes = mergeClasses(defaultClasses, props.classes);

    let content;
    if(isMobile){
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="orders" onClick={() => setView("orders")}/>
                          </div>
                break;
            case "orders":
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            <OrdersContent
                                __={__}
                                width={width}
                                setView={setView}
                                dateFormat={dateFormat}
                                isShopper={isShopper}
                                section={section}
                                setSection={setSection}
                                setOpenedOrder={setOpenedOrder}
                                isOwnerWithoutCompany={isOwnerWithoutCompany}
                            />
                          </div>
                break;
            case "orderDetails":
                content =  <div>
                                <div className={classes.backStep} onClick={() => setView('orders')}>
                                    <BackStep/>
                                </div>
                                {openedOrder && openedOrder.requestStatus
                                ?
                                    <div className={classes.orderDetails}>
                                        <ShopperOrder __={__} order={openedOrder} inOrderDetails={true} setView={setView} view={view} inMobile={true} isShopper={isShopper} setShouldGetOrders={setShouldGetOrders}/> 
                                    </div>
                                :
                                    <div className={classes.orderDetails}>
                                        <Order order={openedOrder} inOrderDetails={true} setView={setView} view={view} inMobile={true}/> 
                                    </div>
                                }
                            </div> 
                break;
            default:
                content = <div className={classes.tabs}>
                            <Tabs active="orders" onClick={() => setView("orders")}/>
                          </div>
        }
    } else {
        content = <div className={classes.body}>
                    <div className={classes.tabs}>
                        <Tabs active="orders"/>
                    </div>
                    <OrdersContent
                        __={__}
                        width={width}
                        setView={setView}
                        dateFormat={dateFormat}
                        isShopper={isShopper}
                        section={section}
                        setSection={setSection}
                        setOpenedOrder={setOpenedOrder}
                        isOwnerWithoutCompany={isOwnerWithoutCompany}
                    />
                  </div>
    }
    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                My orders
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                    {content}
                </div>
            </AppWrapper>
        </div>
    )
}

export default Orders