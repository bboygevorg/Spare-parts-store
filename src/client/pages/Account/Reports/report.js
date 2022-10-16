import React, { useState, Fragment } from 'react';
import classes from './report.css';
import Typo from 'ui/Typo';
import { handleGetDayString } from 'components/DatePicker/datePicker';
import CartItems from '../CartManagement/cartItems';
import Dropdown from 'icons/Dropdown';

const Report = ({ __, width, report }) => {
    const {
        createdAt,
        totals,
        shippingAddress,
        shipping,
        items
    } = report;
    const [opened, setOpened] = useState(false);

    if(width <= 784) {
        return (
            <div className={classes.root}>
                <div className={classes.block}>
                    <Typo as="p" variant="p" font={opened ? "light" : "condensed"}>{report.customer.firstname} {report.customer.lastname}</Typo>
                    <div className={`${classes.dropDown} ${opened ? classes.opened : ""}`} onClick={() => setOpened(!opened)}>
                        <Dropdown/>
                    </div>
                </div>
                {opened ?
                    <div className={classes.content}>
                        <div className={classes.detail}>
                            <Typo as="p" variant="p" className={classes.title}>{__("Address")}</Typo>
                            {shippingAddress ? 
                                <Typo as="p" variant="p" font="light">
                                    {shippingAddress.street && shippingAddress.street[0]}, {shippingAddress.city}{shippingAddress.region && `, ${shippingAddress.region.name}`} {shippingAddress.postcode}{shippingAddress.country && `, ${shippingAddress.country.name}`}
                                </Typo> 
                            :
                                <Typo as="p" variant="p" font="light">{__(`${items[0].name} delivery`)}</Typo>
                            }
                        </div>
                        <div className={classes.detail}>
                            <Typo as="p" variant="p" className={classes.title}>{__("Date of order")}</Typo>
                            <Typo as="p" variant="p" font="light">{handleGetDayString(new Date(createdAt.replace(/-/g, '/')))}</Typo>
                        </div>
                        <div className={classes.detail}>
                            <Typo as="p" variant="p" className={classes.title}>{__("Date of delivery")}</Typo>
                            <Typo as="p" variant="p" font="light">{shipping && shipping.deliveryTime ? handleGetDayString(new Date(shipping.deliveryTime.replace(/-/g, '/'))) : "-"}</Typo>
                        </div>
                        <div className={classes.detail}>
                            <Typo as="p" variant="p" className={classes.title}>{__("Total")}</Typo>
                            <Typo as="p" variant="p" font="light">{totals && totals.grandTotal ? "$" + totals.grandTotal.toFixed(2) : "-"}</Typo>
                        </div>
                        <div className={classes.items}>
                            <CartItems
                                __={__}
                                width={width}
                                cart={report}
                                isReports={true}
                            />
                        </div>
                    </div>
                : 
                    null
                }
            </div>
        );
    }

    return (
        <Fragment>
            <div className={classes.dataRow}>
                <Typo as="p" variant="p" font="light" color={opened ? "darkSecondary" : "primary"}>{report.customer.firstname} {report.customer.lastname}</Typo>
                {shippingAddress ? 
                    <Typo as="p" variant="p" font="light" color={opened ? "darkSecondary" : "primary"}>
                        {shippingAddress.street && shippingAddress.street[0]}, {shippingAddress.city}{shippingAddress.region && `, ${shippingAddress.region.name}`} {shippingAddress.postcode}{shippingAddress.country && `, ${shippingAddress.country.name}`}
                    </Typo> 
                :
                    <Typo as="p" variant="p" font="light">{items[0].name} delivery</Typo>
                }
                <Typo as="p" variant="p" font="light" color={opened ? "darkSecondary" : "primary"}>{handleGetDayString(new Date(createdAt.replace(/-/g, '/')))}</Typo>
                <Typo as="p" variant="p" font="light" color={opened ? "darkSecondary" : "primary"}>{shipping && shipping.deliveryTime ? handleGetDayString(new Date(shipping.deliveryTime.replace(/-/g, '/'))) : "-"}</Typo>
                <Typo as="p" variant="p" color={opened ? "darkSecondary" : "primary"}>{totals && totals.grandTotal ? "$" + totals.grandTotal.toFixed(2) : "-"}</Typo>
                <Typo as="p" variant="p" className={classes.view} color={opened ? "darkSecondary" : "primary"} onClick={() => setOpened(!opened)}>{opened ? __("See less") : __("View details")}</Typo>
            </div>
            {opened ? 
                <div className={classes.items}>
                    <CartItems
                        __={__}
                        width={width}
                        cart={report}
                        isReports={true}
                    />
                </div>
            :
            null}
        </Fragment>
    );
};

export default Report;