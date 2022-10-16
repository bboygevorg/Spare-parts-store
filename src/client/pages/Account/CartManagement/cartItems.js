import React, { useCallback, useState, useEffect, Fragment } from 'react';
import Typo from 'ui/Typo';
import isEmpty from 'lodash/isEmpty';
import classes from './cartItems.css';
import QuantityInput from 'components/QuantityInput';
import { useSelector } from 'react-redux';
import Button from 'components/Button';
import getZoneCode from "../../../../helper/getZoneCode";
import {getPriceByZip} from "../../../../helper/utils";

const Product = ({
    __, 
    width,
    product,
    handleRemoveItem,
    removingItemLoading,
    updateItemFromCart,
    updateItemLoading,
    openedUser,
    users,
    setUsers,
    setOpenedUser,
    isReports,
    isOrder,
    setChangingOrder,
    cart
}) => {
    const [qty, setQty]= useState(product.qty);
    const [removing, setRemoving] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [updateFromInput, setUpdateFromInput] = useState(false);
    const { customerToken } = useSelector(state => state.signin.customerData);

    const getRemoved = useCallback((id) => {
        return id === product.itemId ? setRemoving(true) : setRemoving(false);
    }, [product]);

    const handleSetQty = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        setQty(value);
        if(isOrder) {
            const arr = [...cart.items];
            const updatedItem = {...product, qty: value};
            const index = arr.findIndex(el => el.itemId === updatedItem.itemId);
            arr[index] = updatedItem;
            const updatedCart = {...cart, items: arr};
            setChangingOrder(updatedCart);
        }
    };
    
    useEffect(() => {
        if (shouldUpdate && qty) {
            updateQuantity(qty);
        }
    }, [shouldUpdate]);

    const updateQuantity = async (qty) => {
        const res = await updateItemFromCart({
          variables: {
            customerToken, 
            customerId: parseInt(openedUser.id), 
            cartToken: openedUser.cart.cartToken, 
            cartItem: { 
                itemId: product.itemId,
                qty
            },
						zoneCode: getZoneCode()
          },
          fetchPolicy: "no-cache",
        });
        if(res && res.data && res.data.companyUpdateItemFromCustomerCart) {
            let arr = [...users];
            const index = arr.findIndex(el => el.id === openedUser.id);
            arr[index] = {...openedUser, cart: res.data.companyUpdateItemFromCustomerCart};
            setUsers(arr);
            setOpenedUser({...openedUser, cart: res.data.companyUpdateItemFromCustomerCart});
            setShouldUpdate(false);
            setUpdateFromInput(false);
        }
    }

    const handleRemove = (id) => {
        if(isOrder) {
            const arr = [...cart.items];
            const index = arr.findIndex(el => el.itemId === id);
            arr.splice(index, 1);
            const updatedCart = {...cart, items: arr};
            setChangingOrder(updatedCart);
        } else {
            if(removingItemLoading || removing) {
                return;
            }
            getRemoved(id);
            handleRemoveItem(id);
        }
    }

    const content = <Fragment>
            <Typo as="p" variant="p" font="light" className={classes.name}>{product.name}</Typo>
            <Typo as="p" variant="p" font="light">{product.price ? "$" + getPriceByZip(product) : ""}</Typo>
            {isReports ?
                <Typo as="p" variant="p" font="light">{product.qty}</Typo>
            :
            isOrder ?
                <QuantityInput
                    className={classes.quantityInput}
                    value={qty}
                    setValue={handleSetQty}
                />
            :
                <div>
                    <QuantityInput
                        isFromCart={true}
                        className={classes.quantityInput}
                        value={qty}
                        setValue={handleSetQty}
                        isSubmitting={shouldUpdate}
                        setShouldUpdate={setShouldUpdate}
                        setUpdateFromInput={setUpdateFromInput}
                        updateFromInput={updateFromInput}
                    />
                    {updateFromInput &&
                        <Button
                            label={__("Update")}
                            onClick={() => updateQuantity(qty)}
                            classes={{button_primary: classes.button}}
                            isSubmitting={updateItemLoading}
                        />
                    }
                </div>
            }
            <Typo as="p" variant="p">{width <= 784 && `${__("Total price")}:`} ${(getPriceByZip(product) * product.qty).toFixed(2)}</Typo>
            {!isReports &&
                <div className={classes.remove}>
                    <Typo as="p" variant="p" className={classes.removeProduct} onClick={() => handleRemove(product.itemId)}>{__("Remove product")}</Typo>
                    <Typo as="p" variant="p">{removingItemLoading && removing && "..."}</Typo>
                </div>
            }
    </Fragment>

    return (
        <div className={isReports ? classes.reportRowData : classes.rowData}>
            <div className={classes.imageWrapper}>
                <img src={product.imageUrl} className={classes.pic}/>
            </div>
            {width > 784 ? content : <div className={classes.info}>{content}</div> }
        </div>
    );
};

const CartItems = (props) => {
    const { 
        __,
        width,
        cart, 
        handleRemoveItem, 
        removingItemLoading, 
        updateItemFromCart,
        updateItemLoading,
        openedUser,
        users,
        setUsers,
        setOpenedUser,
        isReports,
        isOrder,
        setChangingOrder,
        handleUpdateOrder,
        updateLoading
    } = props;

    if(!isEmpty(cart) && cart.items && !cart.items.length) {
        return (
            <div className={classes.noItems}>
                <Typo as="p" variant="p" font="light">{__("No items")}</Typo>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {width > 784 ?
                <div className={isReports ? classes.reportRow : classes.row}>
                    <Typo as="p" variant="p">{__("cart.template.picture")}</Typo>
                    <Typo as="p" variant="p">{__("cart.template.name")}</Typo>
                    <Typo as="p" variant="p">{__("cart.template.price")}</Typo>
                    <Typo as="p" variant="p">{__("cart.template.qty")}</Typo>
                    <Typo as="p" variant="p">{__("Total price")}</Typo>
                </div>
            :
                null
            }
            <div className={classes.list}>
                {cart.items.map(item => {
                    if(isReports || isOrder) {
                        return (
                            <Product 
                                key={item.itemId}
                                __={__}
                                width={width}
                                product={item}
                                isReports={isReports}
                                isOrder={isOrder}
                                setChangingOrder={setChangingOrder}
                                cart={cart}
                                handleUpdateOrder={handleUpdateOrder}
                                updateLoading={updateLoading}
                            />
                        )
                    }
                    else {
                        return (
                            <Product
                                key={item.itemId}
                                __={__}
                                width={width}
                                product={item}
                                handleRemoveItem={handleRemoveItem}
                                removingItemLoading={removingItemLoading}
                                updateItemFromCart={updateItemFromCart}
                                updateItemLoading={updateItemLoading}
                                openedUser={openedUser}
                                users={users}
                                setUsers={setUsers}
                                setOpenedUser={setOpenedUser}
                                isReports={isReports}
                                isOrder={isOrder}
                            />
                        )
                    }
                })}
            </div>
        </div>
    );
};

export default CartItems;