import React, { useState, useEffect, useMemo } from 'react'
import defaulClasses from './tabs.css'
import { mergeClasses } from 'helper/mergeClasses'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'store/actions/signIn';
import Confirmation from 'components/Confirmation';
import useTranslation from 'talons/useTranslation';
import Link from 'components/Link';
import { codeSplitter } from 'components/Link/link';
import { setCurrentStep, setBillingAddress, getAddressesFullfield } from "actions/checkoutNew";
import { actions as wishListActions } from'actions/wishList';
import { searchClient } from 'conf/main';
import aa from 'search-insights';
// import Estimations from 'icons/account/Estimations';
import Reports from 'icons/account/Reports';
import Templates from 'icons/account/Templates';
import Profile from 'icons/account/Profile';
import { isEmpty } from 'lodash';
import { GET_PENDING_ORDERS_COUNT } from 'api/query';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { USER_ROLE_ENUM } from 'conf/enums';

const Tabs = (props) => {
    const classes = mergeClasses(defaulClasses, props.classes);
    const active  = props.active || 'profile';
    const dispatch = useDispatch()
    const history = useHistory();
    const __ = useTranslation();
    const localeId = useSelector(state => state.language.currentLanguage);
    const customerData = useSelector(state => state.signin.customerData);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const getPendingOrdersCount = useAwaitQuery(GET_PENDING_ORDERS_COUNT);
    const { pendingOrderCount } = useSelector(state => state.signin);
    const customerToken = typeof window !== "undefined" && localStorage.getItem('customerToken');

    const signOut = () => {
        aa('getUserToken', null, (err, userToken) => {
            if (err) {
              console.error(err);
              return;
            }
            searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
        });
        dispatch(actions.signOut());
        dispatch(setCurrentStep(0));
        dispatch(setBillingAddress({}));
        dispatch(getAddressesFullfield([]));
        dispatch(wishListActions.setWishlists([]));
        dispatch(wishListActions.setItems([]));
        dispatch(wishListActions.setAllItems([]));
        localeId === 'default' ? history.replace("/") : history.replace(codeSplitter(localeId));
    };

    const handleGetOrdersCount = async () => {
        try {
            const res = await getPendingOrdersCount({
                variables: {
                    customerToken,
                    pageSize: 1,
                    currentPage: 1,
                    sortOrders: [{ field: "created_at", direction: "desc" }]
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetShopperOrderRequests && res.data.companyGetShopperOrderRequests.totalCount) {
                dispatch(actions.setPendingOrderCount(res.data.companyGetShopperOrderRequests.totalCount))
            }
        } catch (err) {
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#fff';
        if(!pendingOrderCount) {
            handleGetOrdersCount();
        }
        return () =>
            (document.body.style.backgroundColor = "var(--global-light-color)");
    }, []);

    const isAdmin = useMemo(() => {
        if(!isEmpty(customerData) && customerData.companyRole && customerData.companyRole !== USER_ROLE_ENUM.shopper) {
            return true;
        }
        else {
            return false;
        }
    }, [customerData]);

    const isShopper = useMemo(() => {
        if(!isEmpty(customerData) && customerData.companyRole && customerData.companyRole == USER_ROLE_ENUM.shopper) {
            return true;
        }
        else {
            return false;
        }
    }, [customerData]);

    const isOwnerWithoutCompany = useMemo(() => {
        return (!isEmpty(customerData) && customerData.companyRole === 4 && !customerData.companyName) ? true : false
    }, [customerData]);

    return (
        <div className={classes.root}>
            <div className={classes.tabs}>
                <ul className={classes.list}>
                    <Link to="/account/profile" className={`${classes.link} ${active === "profile" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <Profile/>
                            <span className={classes.title}>{__("Profile")}</span>
                        </li>
                    </Link>
                    <Link to="/account/orders" className={`${classes.link} ${active === "orders" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <span className={`${classes.icons} ${classes.orderIcon}`}></span>
                            <span className={classes.title}>{pendingOrderCount ? `${__("My Orders")} (${pendingOrderCount})` : __("My Orders")}</span>
                        </li>
                    </Link>
                    <Link to="/account/addresses" className={`${classes.link } ${active === "addresses" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <span className={`${classes.icons} ${classes.jobIcon}`}></span>
                            <span className={classes.title}>{__("Job Addresses")}</span>
                        </li>
                    </Link>
                    <Link to="/account/billing_address" className={`${classes.link} ${active === "billing_address" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <span className={`${classes.icons} ${classes.billingIcon}`}></span>
                            <span className={classes.title}>{__("Billing Address")}</span>
                        </li>
                    </Link>
                    {isAdmin ? <Link to="/account/user_management" className={`${classes.link} ${active === "user_management" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <span className={`${classes.icons} ${classes.profileIcon}`}></span>
                            <span className={classes.title}>{__("User management")}</span>
                        </li>
                    </Link> : null}
                    {isAdmin && !isOwnerWithoutCompany ? <Link to="/account/cart_managament" className={`${classes.link} ${active === "cart_management" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <span className={`${classes.icons} ${classes.cartIcon}`}></span>
                            <span className={classes.title}>{__("Cart management")}</span>
                        </li>
                    </Link> : null}
                    {(isAdmin || isShopper) && !isOwnerWithoutCompany ? <Link to="/account/cart_templates" className={`${classes.link} ${active === "cart_templates" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <Templates/>
                            <span className={classes.title}>{__("Cart templates")}</span>
                        </li>
                    </Link> : null}
                    {isAdmin  && !isOwnerWithoutCompany  ? <Link to="/account/reports" className={`${classes.link} ${active === "reports" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <Reports/>
                            <span className={classes.title}>{__("Reports")}</span>
                        </li>
                    </Link> : null}
                    {/* <Link to="#" className={`${classes.link} ${active === "estimations" && classes.active}`}>
                        <li className={classes.item} onClick={props.onClick}>
                            <Estimations/>
                            <span className={classes.title}>{__("Estimations")}</span>
                        </li>
                    </Link> */}
                    <Link to="/account/payment_methods" className={`${classes.link} ${active === "payment" && classes.active}`}>
                        <li className={classes.item}>
                            <span className={`${classes.icons} ${classes.paymentIcon}`}></span>
                            <span className={classes.title}>{__("Payment Method")}</span>
                        </li>
                    </Link>
                    <div className={`${classes.link}`} onClick={() => {setShowSignOutModal(true); window.scrollTo(0,0)}}>
                        <li className={classes.item}>
                            <span className={`${classes.icons} ${classes.signOutIcon}`}></span>
                            <span className={classes.title}>{__("Sign out")}</span>
                        </li>
                    </div>
                </ul>
            </div>
            <Confirmation text={__("Are you sure you want to sign out?")} isShown={showSignOutModal} onClose={() => setShowSignOutModal(false)} action={signOut} />
        </div>
    )
}

export default Tabs
