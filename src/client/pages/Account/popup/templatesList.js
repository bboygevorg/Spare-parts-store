import Typo from 'ui/Typo';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import classes from './templatesList.css';
import Template from '../CartTemplates/template';
import isEmpty from 'lodash/isEmpty';
import CheckBox from 'components/CheckBox';
import QuantityInput from 'components/QuantityInput';
import Button from 'components/Button';
import Loading from 'components/Loading';

const TemplateItem = ({ __, item, width, selectedTemplate, handleSelect }) => {
    const [qty, setQty] = useState(item.qty);
    const [selected, setSelected] = useState(false);

    const handleChangeQty = (e, value) => {
        e.preventDefault();
        setQty(value);
        handleSelect(item, value);
    }

    useEffect(() => {
        if(!isEmpty(selectedTemplate) && selectedTemplate.selectedItems && selectedTemplate.selectedItems.length) {
            const elem = selectedTemplate.selectedItems.find(el => el.sku === item.sku);
            if(elem) {
                setSelected(true);
                setQty(elem.qty);
            }
            else {
                setSelected(false);
                setQty(item.qty);
            }
        }
        else {
            setSelected(false);
            setQty(item.qty);
        }
    }, [selectedTemplate, item]);

    return (
        <div className={classes.rowData}>
            <div>
                <CheckBox
                    label={""}
                    value={selected}
                    onChange={() => {
                        if(qty !== item.qty) {
                            handleSelect(item, "", qty);
                        }
                        else {
                            handleSelect(item);
                        }
                    }}
                    isCheckout={true}
                />
            </div>
            <div className={classes.imageWrapper}>
                <img src={item.imageUrl} className={classes.pic}/>
            </div>
            {width <= 784 ? 
                <div>
                    <Typo as="p" variant="p" font="light" className={classes.name}>{item.name}</Typo>
                    <Typo as="p" variant="p" font="light">{item.price ? "$" + item.price.toFixed(2) : ""}</Typo>
                    <QuantityInput
                        className={classes.quantityInput}
                        value={qty}
                        setValue={handleChangeQty}
                    />
                    <Typo as="p" variant="p">{__("Total price")}: ${(item.price * qty).toFixed(2)}</Typo>
                </div> 
            : 
                <Fragment>
                    <Typo as="p" variant="p" font="light" className={classes.name}>{item.name}</Typo>
                    <Typo as="p" variant="p" font="light">{item.price ? "$" + item.price.toFixed(2) : ""}</Typo>
                    <QuantityInput
                        className={classes.quantityInput}
                        value={qty}
                        setValue={handleChangeQty}
                    />
                    <Typo as="p" variant="p">${(item.price * qty).toFixed(2)}</Typo>
                </Fragment>
            }
        </div>
    );
};


const TemplatesList = (props) => {
    const { 
        __,
        width,
        templates, 
        selectedTemplate,
        setSelectedTemplate,
        handleAddItemsToCart,
        isSubmitting,
        isFetchingTemplates,
        addButtonLabel
    } = props;
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        return () => setSelectedTemplate({});
    }, []);

    const handleSelect = useCallback((selected, qty, changedQty) => {
        if(selectedTemplate.selectedItems && selectedTemplate.selectedItems.length) {
            let arr = [...selectedTemplate.selectedItems];
            const index = selectedTemplate.selectedItems.findIndex(el => el.sku === selected.sku);
            if(index !== -1) {
                if(qty) {
                    arr[index] = {...arr[index], qty}
                }
                else {
                    if(selectAll) {
                        setSelectAll(false);
                    }
                    arr.splice(index, 1);
                }
                setSelectedTemplate({...selectedTemplate, selectedItems: arr});
            }
            else 
            if(!qty) {
                arr.push({...selected, sku: selected.sku, qty: changedQty || selected.qty});
                setSelectedTemplate({...selectedTemplate, selectedItems: arr});
                if(arr.length === selectedTemplate.products.length) {
                    setSelectAll(true);
                }
            }
        }
        else 
        if(!qty) {
            setSelectedTemplate({...selectedTemplate, selectedItems: [...selectedTemplate.selectedItems, {...selected, sku: selected.sku, qty: changedQty || selected.qty}]});
        }
    }, [selectedTemplate, selectAll]);

    const changeAll = useCallback((value) => {
        let arr = [...selectedTemplate.products];
        if(selectedTemplate.selectedItems && selectedTemplate.selectedItems.length) {
            if(value) {
                let included = arr.map(product => {
                    const includedItem = selectedTemplate.selectedItems.find(el => el.sku === product.sku);
                    if(includedItem) {
                        return {
                            ...product,
                            sku: product.sku,
                            qty: includedItem.qty
                        }
                    }
                    else {
                        return {
                            ...product,
                            sku: product.sku,
                            qty: product.qty
                        }
                    }
                });
                let updatedItems = [...included];
                setSelectedTemplate({...selectedTemplate, selectedItems: updatedItems});
            }
            else {
                setSelectedTemplate({...selectedTemplate, selectedItems: []});
            }
        }
        else {
            let updatedHits = arr.map(product => {
                return {
                    ...product,
                    sku: product.sku,
                    qty: product.qty
                }
            });
            setSelectedTemplate({...selectedTemplate, selectedItems: updatedHits});
        }
    }, [selectedTemplate]);

    return (
        <div className={classes.root}>
            {isEmpty(selectedTemplate) ? 
                <div className={classes.listView}>
                    <Typo as="h3" variant="h3" className={classes.title}>{__("Add template/s to cart")}</Typo>
                    {isFetchingTemplates ?
                        <div className={classes.loadingWrapper}>
                            <Loading/>
                        </div>
                    :
                        <div className={classes.list}>
                            {templates.filter(el => el.products.length).map(item =>
                                <Template
                                    __={__}
                                    key={item.id}
                                    item={item}
                                    setSelected={setSelectedTemplate}
                                    isPopup={true}
                                />
                            )}
                        </div>
                    }
                </div>
            :
                <div className={classes.templateView}>
                    <Typo as="h3" variant="h3" className={classes.title}>{selectedTemplate.name}</Typo>
                    <div className={classes.itemList}>
                        {width > 784 ?
                            <div className={classes.row}>
                                <div className={classes.selectAll}>
                                    <CheckBox
                                        label={""}
                                        value={selectAll}
                                        onChange={() => {
                                            setSelectAll(!selectAll);
                                            changeAll(!selectAll);
                                        }}
                                        isCheckout={true}
                                    />
                                    <Typo as="p" variant="p">{__("Select all")}</Typo>
                                </div>
                                <Typo as="p" variant="p" className={classes.imageTitle}>{__("cart.template.picture")}</Typo>
                                <Typo as="p" variant="p">{__("cart.template.name")}</Typo>
                                <Typo as="p" variant="p">{__("cart.template.price")}</Typo>
                                <Typo as="p" variant="p">{__("cart.template.qty")}</Typo>
                                <Typo as="p" variant="p" className={classes.totalPrice}>{__("Total price")}</Typo>
                            </div>
                        :
                            <div className={classes.selectAll}>
                                <CheckBox
                                    label={""}
                                    value={selectAll}
                                    onChange={() => {
                                        setSelectAll(!selectAll);
                                        changeAll(!selectAll);
                                    }}
                                    isCheckout={true}
                                />
                                <Typo as="p" variant="p">{__("Select all")}</Typo>
                            </div>
                        }
                        {selectedTemplate.products.length && selectedTemplate.products.map(item => (
                            <TemplateItem
                                __={__}
                                width={width}
                                key={item.sku}
                                item={item}
                                selectedTemplate={selectedTemplate}
                                handleSelect={handleSelect}
                                changeAll={changeAll}
                            />
                        ))}
                    </div>
                    <div className={classes.actions}>
                        <Button 
                            label={__("Cancel")}
                            type="bordered"
                            classes={{ button_bordered: classes.cancelButton }}
                            onClick={() => setSelectedTemplate({})}
                        />
                        <Button
                            label={addButtonLabel}
                            classes={{button_primary: classes.addButton}}
                            onClick={handleAddItemsToCart}
                            disabled={!selectedTemplate.selectedItems.length}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default TemplatesList;