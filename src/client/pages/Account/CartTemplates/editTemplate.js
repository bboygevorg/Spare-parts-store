import Typo from 'ui/Typo/index';
import React, { useEffect } from 'react';
import classes from './editTemplate.css';
import Input from 'components/Input';
import Button from 'components/Button';
import isEmpty from 'lodash/isEmpty';
import TemplateItem from './templateItem';

const EditTemplate = (props) => {
    const { 
        __, 
        view,
        setView,
        name, 
        handleChangeName, 
        selected, 
        setSelected, 
        selectToRemove,
        isOpenSearch,
        setIsOpenSearch,
        handleCreateTemplate,
        creatingCartTemplate,
        handleUpdateCartTemplate,
        updatingCartTemplate,
        allSelectedItems,
        handleChangeSelected,
        handleAddTemplateToCart,
        templateToCartLoad,
        companyRole
    } = props;

    useEffect(() => {
        if(!isEmpty(selected) && selected.name) {
            handleChangeName(selected.name);
        }
        return () => {
            setSelected({});
            handleChangeName("");
        }
    }, []);

    if(view === "view_template" && !isEmpty(selected)) {
        return (
            <div className={classes.root}>
                <div className={classes.viewTop}>
                    <div className={classes.back} onClick={() => setView("list")}>
                        <span className={classes.backIcon}></span>
                        <Typo as="h3" variant="h3">{selected.name}</Typo>
                    </div>
                    <Button
                        label={__("Add template to cart")}
                        classes={{button_primary: classes.templateToCartBtn}}
                        onClick={() => handleAddTemplateToCart(selected.id)}
                        isSubmitting={templateToCartLoad}
                        disabled={!selected.products.length}
                    />
                </div>
                {companyRole !== 1 ? 
                    <Button
                        label={__("Edit template")}
                        classes={{button_primary: classes.editTemplateBtn}}
                        onClick={() => setView("edit_template")}
                    /> 
                : null}
                <div className={classes.productList}>
                    {selected.products && selected.products.length  ?
                        selected.products.map(item => 
                            <TemplateItem
                                __={__}
                                key={item.sku}
                                product={item}
                                view={view}
                            />
                        )
                    :
                        null
                    }
                </div>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {view === "edit_template" ?
                <Button
                    label={__("Add template to cart")}
                    classes={{button_primary: classes.templateToCartBtn}}
                    onClick={() => handleAddTemplateToCart(selected.id)}
                    isSubmitting={templateToCartLoad}
                    disabled={!selected.products.length}
                />
            :
                null
            }
            <div className={`${classes.top} ${view === "edit_template" && classes.editTop}`}>
                <div className={classes.nameContent}>
                    <Typo as="h3" variant="h3" font="bold">{__("What's the name of your template?")}</Typo>
                    <Input
                        placeholder={__("Type template name")}
                        value={name}
                        onChange={(e) => handleChangeName(e.target.value)}
                        classes={{ input: classes.nameField }}
                    />
                </div>
                {view === "edit_template" ? 
                    <div className={classes.actions}>
                        <Button
                            type='delete'
                            label={__("Delete template")}
                            classes={{ button_delete: classes.deleteBtn }}
                            onClick={() => selectToRemove(selected)}
                        />
                        <Button
                            label={__("Save template")}
                            classes={{ button_primary: classes.saveBtn }}
                            disabled={!name}
                            onClick={handleUpdateCartTemplate}
                            isSubmitting={updatingCartTemplate}
                        />
                    </div>
                : 
                null}
                {view === "create_template" ? 
                    <div className={classes.action}>
                        <Button
                            label={__("Create template")}
                            classes={{ button_primary: classes.saveBtn }}
                            disabled={!name}
                            onClick={handleCreateTemplate}
                            isSubmitting={creatingCartTemplate}
                        />
                    </div>
                :null}
            </div>
            <div className={classes.searchContent}>
                <Typo as="p" variant="p" font="bold">{`${view === "create_template" ? __("Your template is empty.") : ""} ${__("Search products to add them in template.")}`}</Typo>
                <Button
                    type={view === "create_template" ? "primary" : "bordered"}
                    label={__("SEARCH")}
                    classes={{[`button_${view === "create_template" ? "primary" : "bordered"}`]: classes[view === "create_template" ? "primarySearch" : "borderedSearch"]}}
                    onClick={() => setIsOpenSearch(true)}
                />
            </div>
            {view === "create_template" && <div className={classes.goBack} onClick={() => setView("list")}>
                <div className={classes.icon}>
                    <span className={classes.backListIcon}></span>
                </div>
                <div>
                    <span className={classes.backText}>{__("Back")}</span>
                </div>
            </div>}
            <div className={classes.productList}>
                {!isOpenSearch && allSelectedItems.length ?
                    allSelectedItems.map(item => 
                        <TemplateItem
                            __={__}
                            key={item.objectID}
                            product={item}
                            isSelected={true}
                            handleChangeSelected={handleChangeSelected}
                        />
                    )
                :
                    null
                }
                {selected && selected.products && selected.products.length ?
                    selected.products.map((product, index) => 
                        <TemplateItem
                            __={__}
                            key={index}
                            product={product}
                            handleChangeSelected={handleChangeSelected}
                        />
                    ) 
                :
                    null
                }
            </div>
        </div>
    );
};

export default EditTemplate;