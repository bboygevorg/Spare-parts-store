import React, { useState, useCallback, Fragment } from 'react';
import Link from 'components/Link';
import classes from './templateItem.css';
import { createMask, VENDORS, SERVICE_OFF_KEY } from 'conf/consts';
import Typo from 'ui/Typo';
import QuantityInput from 'components/QuantityInput';
import Button from 'components/Button';
import aa from 'search-insights';
import { searchClient } from 'conf/main';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_TO_CART } from "api/mutation";
import { useMutation } from "@apollo/react-hooks";
import { actions } from "store/actions/signIn";
import Modal from 'components/Modal';
import LicenseModal from 'components/Algolia/ProductList/LicenseModal';
import DeclineAddToCartModal from 'components/Algolia/ProductList/DeclineAddToCartModal';
import ServiceShutDownModal from 'components/Algolia/ProductList/ServiceShutDownModal';
import ZipcodeVerificationModal from 'components/Algolia/ProductList/ZipcodeVerificationModal';
import {replaceId} from "../../../../helper/replaceId";
import getZoneCode from "../../../../helper/getZoneCode";
import {getPriceByZip} from "../../../../helper/utils";

const TemplateItem = ({ product, __, isSelected, handleChangeSelected, view }) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(product.qty || 1);
    const [isOpenServiceoff, setIsOpenServiceOff] = useState(false);
    const [isOpenDecline, setIsOpenDecline] = useState(false);
    const [declineText, setDeclineText] = useState('');
    const [licenseData, setLicenseData] = useState([]);
    const [isOpenLicense, setIsOpenLicense] = useState(false);
    const [isOpenZipcode, setIsOpenZipcode] = useState(false);
    const [graphqlError, setGraphqlError] = useState("");
    const firebaseValues = useSelector(state => state.firebase.config);
    const serviceOff = firebaseValues && firebaseValues[SERVICE_OFF_KEY]
    const customerData = useSelector((state) => state.signin.customerData);
    const cartToken = useSelector((state) => state.signin.cartToken);
    const isAuth = useSelector((state) => state.signin.isAuth);
    const [ addToCart, { loading: addItemLoader }] = useMutation(ADD_TO_CART);

    const handleSetCount = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        setCount(value);
        if(view === "view_template") {
            return;
        }
        if(isSelected) {
            handleChangeSelected(product.objectID, value);
        }
        else {
            handleChangeSelected(product.sku, value)
        }
    };

    const addProductToCart = async () => {
        try {
            const response = await addToCart({
                variables: {
                    item: {
                        sku: product.sku,
                        qty: count,
                    },
                    customerToken: customerData.customerToken ? customerData.customerToken : "",
                    cartToken: cartToken ? cartToken : "",
										zoneCode: getZoneCode()
                }
            });
            setCount(1);
            dispatch(actions.addCartToken(response.data.addToCart.cartToken));
            dispatch(actions.addCart(response.data.addToCart));
            dispatch(actions.setIsActiveCart(true));
        } catch (err) {
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError.graphQLErrors[0].code;
            if (code === 31) {
	              dispatch(actions.clearCart());
                window.scrollTo(0, 0);
            } else {
                setGraphqlError("Unexpected server error. Please try again.");
            }
        }
    };

    const checkLicenses = useCallback(() => {
        const hv = product.hvac_license_required;
        const ep = product.epa_certification_required;
        if(!isAuth) {
            if(hv && ep) {
                setDeclineText('HVAC License and EPA Certification are');
                setIsOpenDecline(true);
            }
            else
            if(hv) {
                setDeclineText('HVAC License');
                setIsOpenDecline(true);
            }
            else
            if(ep) {
                setDeclineText('EPA Certification');
                setIsOpenDecline(true);
            }
            else {
                addProductToCart();
            }
        }
        else {
            if(hv && ep && !customerData.hvacLicense && !customerData.epaCertification) {
                setLicenseData([
                    {
                        title: 'hvac',
                        placeholder: 'HVAC License',
                    },
                    {
                        title: 'epa',
                        placeholder: 'EPA Certification',
                    }
                ]);
                setIsOpenLicense(true);
                window.scrollTo(0, 0);
            }
            else
            if(hv && !customerData.hvacLicense) {
                setLicenseData([{  
                    title: 'hvac', 
                    placeholder: 'HVAC License', 
                }])
                setIsOpenLicense(true);
                window.scrollTo(0, 0);
            }
            else
            if(ep && !customerData.epaCertification) {
                setLicenseData([{
                    title: 'epa',
                    placeholder: 'EPA Certification',
                }]);
                setIsOpenLicense(true);
                window.scrollTo(0, 0);
            }
            else {
                addProductToCart();
            }
        }
    }, [product, customerData, isAuth, serviceOff, count, cartToken]);
    
    const checkDestination = () => {
        setIsOpenZipcode(true);
        window.scrollTo(0, 0);
    }
    
    return (
        <Fragment>
            <Link
                to={`/product/${VENDORS[isSelected ? product.objectID.split("_")[0] : product.sku.split("_")[0]]}_${isSelected ? createMask(replaceId(product.objectID), 1) : createMask(replaceId(product.sku), 1)}`}
                className={`${classes.cardWrapper} ${view === "view_template" && classes.viewCardWrapper}`}
            >
                <div className={classes.productBox}>
                    {isSelected ? product.delivery_option === 0 : product.deliveryOption === 0 ?
                        <img
                            className={classes.instantImg}
                            src={require(`../../../assets/icons/instant.svg`)}
                        />
                    :
                    null}
                    <div className={classes.productImg}>
                        <img src={product.imageUrl || product.images[0].imageURL} />
                    </div>
                    <div className={classes.productContent}>
                        <Typo font="regular" variant="p" className={classes.productName}>{product.name}</Typo>
                        <Typo
                            variant="h3"
                            className={classes.productCost}
                        >
                            {`$${getPriceByZip(product)}`}
                        </Typo>
                        {graphqlError && (
                            <Typo variant="px" color="error" font="regular">
                                {graphqlError}
                        </Typo>
                        )}
                        {view === "view_template" ? 
                            <div className={classes.qtyAddButtons}>
                                <QuantityInput
                                    className={classes.quantityInputView}
                                    value={count}
                                    setValue={handleSetCount}
                                />
                                <Button
                                    label={__("ADD TO CART")}
                                    type="bordered"
                                    classes={{ button_bordered: classes.buttonComponent }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.fbq('track', 'AddToCart', {
                                            productId: product.product_id,
                                            value: product.price,
                                            currency: 'USD'
                                        });
                                        aa('convertedObjectIDs', {
                                            index: process.env.ALGOLIA_INDEX,
                                            eventName: 'Add to basket',
                                            objectIDs: [product.objectID],
                                            userToken: searchClient.transporter.headers['X-Algolia-UserToken']
                                        });
                                        if(serviceOff === 'true') {
                                            setIsOpenServiceOff(true);
                                            window.scrollTo(0, 0);
                                            return;
                                        }
                                        if(!localStorage.getItem('askedforzipcode')) {
                                            checkDestination();
                                        }
                                        else {
                                            checkLicenses();
                                        }
                                    }}
                                    disabled={addItemLoader}
                                    isSubmitting={addItemLoader}
                                />
                            </div>
                        : null}
                        {view !== "view_template" ?
                            <div className={classes.actions}>
                                <QuantityInput
                                    className={classes.quantityInput}
                                    value={count}
                                    setValue={handleSetCount}
                                />
                                <Button
                                    type="bordered"
                                    label={__("Remove from template")}
                                    classes={{button_bordered: classes.removeButton}}
                                    onClick={(e) =>  {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if(isSelected) {
                                            handleChangeSelected(product.objectID, "");
                                        }
                                        else {
                                            handleChangeSelected(product.sku, "");
                                        }
                                    }}
                                />
                            </div>
                        :
                            null
                        }
                    </div>
                </div>
            </Link>
            <Modal
                isShown={isOpenLicense}
                onClose={() => {
                    setIsOpenLicense(false);
                }}
                className={classes.dialog}
            >
                <LicenseModal
                    licenses={licenseData}
                    cancel={() => setIsOpenLicense(false)}
                    add={addProductToCart}
                />
            </Modal>
            <Modal
                isShown={isOpenDecline}
                onClose={() => {
                    setIsOpenDecline(false);
                }}
                className={classes.declineDialog}
            >
                <DeclineAddToCartModal text={declineText}/>
            </Modal>
            <Modal
                isShown={isOpenServiceoff}
                onClose={() => setIsOpenServiceOff(false)}
                className={classes.declineDialog}
            >
                <ServiceShutDownModal/>
            </Modal>
            <Modal
                isShown={isOpenZipcode}
                onClose={() => { setIsOpenZipcode(false); localStorage.setItem('askedforzipcode', true)}}
                className={classes.zipcodeModal}
            >
                <ZipcodeVerificationModal onClose={() => setIsOpenZipcode(false)} checkLicenses={checkLicenses}/>
            </Modal>
        </Fragment>
    );
};

export default TemplateItem;