import React from 'react';
import classes from './ordersContent.css';
import MyOrders from './myOrders';
import Typo from 'ui/Typo';
import AllOrders from './allOrders';
import PendingOrders from "./pendingOrders";

const OrdersContent = (props) => {
    const { __, width, dateFormat, setOpenedOrder, isShopper, section, setSection, setView, isOwnerWithoutCompany } = props;

    return (
        <div className={classes.root}>
            <Typo as="h2" variant="h2" className={classes.title}>{isOwnerWithoutCompany ? __("My orders") : __("Orders")}</Typo>
            {!isOwnerWithoutCompany ?
                <div className={`${classes.header} ${isShopper && classes.shopperView}`}>
                    <div className={`${classes.section} ${section === "all" && classes.activeBorder}`} onClick={() => setSection("all")}>
                        <Typo as="p" variant="p" font={section === "all" ? "condensed" : "light"}>{!isShopper ? __("All orders") : __("Pending orders")}</Typo>
                    </div>
                    <div className={`${classes.section} ${section === "pending" && classes.activeBorder}`} onClick={() => setSection("pending")}>
                        <Typo as="p" variant="p" font={section === "pending" ? "condensed" : "light"}>{__("Pending orders")}</Typo>
                    </div>
                    <div className={`${classes.section} ${section === "my" && classes.activeBorder}`} onClick={() => setSection("my")}>
                        <Typo as="p" variant="p" font={section === "my" ? "condensed" : "light"}>{__("My orders")}</Typo>
                    </div>
                </div>
            :
                null
            }
            {section === "all" &&
                <AllOrders __={__} width={width} setOpenedOrder={setOpenedOrder} setView={setView} isShopper={isShopper}/>
            }
            {section === "pending" &&
                <PendingOrders __={__} width={width} setOpenedOrder={setOpenedOrder} setView={setView} isShopper={isShopper}/>
            }
            {section === "my" &&
                <MyOrders __={__} dateFormat={dateFormat} setOpenedOrder={setOpenedOrder} setView={setView}/>
            }
        </div>
    );
};

export default OrdersContent; 