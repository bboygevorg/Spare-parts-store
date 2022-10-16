import React, { Fragment, useCallback, useEffect, useState } from 'react';
import classes from './searchProducts.css';
import Typo from 'ui/Typo';
import QuantityInput from 'components/QuantityInput';
import CheckBox from 'components/CheckBox';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import useWindowDimensions from 'talons/useWindowDimensions';
import {getPriceByZip} from "../../../../helper/utils";

const Product = ({ __, product, handleSetCurrentPageInfo, currentPageInfo }) => {
    const [qty, setQty] = useState(1);
    const [selected, setSelected] = useState(false);
    const { width } = useWindowDimensions();

    const handleSetQty = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        setQty(value);
        handleSetCurrentPageInfo(product, value);
    };

    useEffect(() => {
        if(!isEmpty(currentPageInfo) && currentPageInfo.items && currentPageInfo.items.length) {
            const elem = currentPageInfo.items.find(item => item.objectID === product.objectID);
            if(elem) {
                setSelected(true);
                setQty(elem.qty);
            }
            else {
                setSelected(false);
                setQty(1);
            }
        }
        else {
            setSelected(false);
            setQty(1);
        }
    }, [currentPageInfo, product]);

    useEffect(() => {
        if(!isEmpty(currentPageInfo) && currentPageInfo.items && !currentPageInfo.items.length && !currentPageInfo.all) {
            setQty(1);
        }
    }, [currentPageInfo]);

    return (
        <div className={classes.rowData}>
            <div>
                <CheckBox
                    label={""}
                    value={selected}
                    onChange={() => {
                        if(qty > 1) {
                            handleSetCurrentPageInfo(product, "", qty);
                        }
                        else {
                            handleSetCurrentPageInfo(product);
                        }
                    }}
                    isCheckout={true}
                />
            </div>
            <div className={classes.imageWrapper}>
                <img src={product.images[0].imageURL} className={classes.pic}/>
            </div>
            {width <= 784 ? 
                <div>
                    <Typo as="p" variant="p" font="light" className={classes.name}>{product.name}</Typo>
                    <Typo as="p" variant="p" font="light">{product.price ? "$" + getPriceByZip(product) : "" }</Typo>
                    <QuantityInput
                        className={classes.quantityInput}
                        value={qty}
                        setValue={handleSetQty}
                    />
                    <Typo as="p" variant="p">{__("Total price")}: ${(getPriceByZip(product) * qty).toFixed(2)}</Typo>
                </div> : 
                <Fragment>
                    <Typo as="p" variant="p" font="light" className={classes.name}>{product.name}</Typo>
                    <Typo as="p" variant="p" font="light">{product.price ? "$" + getPriceByZip(product) : "" }</Typo>
                    <QuantityInput
                        className={classes.quantityInput}
                        value={qty}
                        setValue={handleSetQty}
                    />
                    <Typo as="p" variant="p">${(getPriceByZip(product) * qty).toFixed(2)}</Typo>
                </Fragment>
            }
        </div>
    );
};


const SearchProducts = ({ __, hits, itemsPerPage, setItemsPerPage, currentPageInfo, setCurrentPageInfo }) => {
    const { current } = useSelector(state => state.categories.pagination);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if(current && itemsPerPage.length) {
            const info = itemsPerPage.find(el => el.page === current);
            if(info) {
                setCurrentPageInfo(info);
            }
            else {
                let arr = [...itemsPerPage, {all: false, page: current, items: []}];
                setItemsPerPage(arr);
            }
        }
    }, [current, itemsPerPage]);

    const changeAll = useCallback((value) => {
        if(itemsPerPage.length && !isEmpty(currentPageInfo)) {
            const arr = [...currentPageInfo.items];
            let items = [...itemsPerPage];
            if(arr.length) {
                if(value) {
                    let includedItems = hits.map(hit => {
                        const includedElem = arr.find(item => item.objectID === hit.objectID);
                        if(includedElem) {
                            return {
                                ...hit,
                                qty: includedElem.qty
                            }
                        }
                        else {
                            return {
                                ...hit,
                                qty: 1
                            }
                        }
                    });
                    let updatedInfo = {...currentPageInfo, all: value, items: includedItems};
                    const index = items.findIndex(el => el.page === current);
                    items[index] = updatedInfo;
                    setItemsPerPage(items);
                }
                else {
                    let updatedInfo = {...currentPageInfo, all: value, items: []};
                    const index = items.findIndex(el => el.page === current);
                    items[index] = updatedInfo;
                    setItemsPerPage(items);
                }
            }
            else {
                let updatedHits = hits.map(hit => {
                    return {
                        ...hit,
                        qty: 1
                    }
                });
                let updatedInfo = {...currentPageInfo, all: value, items: updatedHits};
                const index = items.findIndex(el => el.page === current);
                items[index] = updatedInfo;
                setItemsPerPage(items);
            }
        }
    }, [itemsPerPage, currentPageInfo, current, hits]);

    const handleSetCurrentPageInfo = useCallback((selected, qty, changedQty) => {
        if(itemsPerPage.length && !isEmpty(currentPageInfo)) {
            let arr = [...currentPageInfo.items];
            if(arr.length) {
                const index = arr.findIndex(el => el.objectID === selected.objectID);
                if(index !== -1) {
                    if(qty) {
                        arr[index] = {...arr[index], qty}
                    }
                    else {
                        arr.splice(index, 1);
                    }
                    const updatedPageInfo = {...currentPageInfo, items: arr, all: qty ? currentPageInfo.all : false }
                    let items = [...itemsPerPage];
                    const removedIndex = items.findIndex(el => el.page === current);
                    items[removedIndex] = updatedPageInfo;
                    setItemsPerPage(items);
                }
                else
                if(!qty) {
                    arr.push({...selected, qty: changedQty || 1});
                    const updatedPageInfo = {...currentPageInfo, items: arr, all: arr.length === hits.length ? true : false};
                    let items = [...itemsPerPage];
                    const removedIndex = items.findIndex(el => el.page === current);
                    items[removedIndex] = updatedPageInfo;
                    setItemsPerPage(items);
                }
            }
            else 
            if(!qty){
                arr.push({...selected, qty: changedQty || 1});
                const updatedPageInfo = {...currentPageInfo, items: arr, all: arr.length === hits.length ? true : false }
                let items = [...itemsPerPage];
                const removedIndex = items.findIndex(el => el.page === current);
                items[removedIndex] = updatedPageInfo;
                setItemsPerPage(items);
            }
        }
    }, [itemsPerPage, current, currentPageInfo, hits]);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                {width > 784 ?
                    <div className={classes.row}>
                        <div className={classes.selectAll}>
                            <CheckBox
                                label={""}
                                value={!isEmpty(currentPageInfo) ? currentPageInfo.all : false}
                                onChange={() => changeAll(!currentPageInfo.all)}
                                isCheckout={true}
                            />
                            <Typo as="p" variant="p">{__("Select all")}</Typo>
                        </div>
                        <Typo as="p" variant="p" className={classes.imageTitle}>{__("cart.template.picture")}</Typo>
                        <Typo as="p" variant="p">{__("cart.template.name")}</Typo>
                        <Typo as="p" variant="p">{__("cart.template.price")}</Typo>
                        <Typo as="p" variant="p">{__("cart.template.qty")}</Typo>
                        <Typo as="p" variant="p">{__("Total price")}</Typo>
                    </div>
                :
                    <div className={classes.selectAll}>
                        <CheckBox
                            label={""}
                            value={!isEmpty(currentPageInfo) ? currentPageInfo.all : false}
                            onChange={() => changeAll(!currentPageInfo.all)}
                            isCheckout={true}
                        />
                        <Typo as="p" variant="p">{__("Select all")}</Typo>
                    </div>
                }
                {hits.length && hits.map(hit => (
                    <Product
                        __={__}
                        key={hit.objectID} 
                        product={hit} 
                        currentPageInfo={currentPageInfo}
                        handleSetCurrentPageInfo={handleSetCurrentPageInfo}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchProducts;