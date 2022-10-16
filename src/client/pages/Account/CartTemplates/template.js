import React from 'react';
import classes from './template.css';
import Close from 'icons/Close';
import Typo from 'ui/Typo';
import Folder from 'icons/account/Folder';

const Template = (props) => {
    const { __, item, selectToRemove, setSelected, companyRole, setView, isPopup } = props;

    const quantity = item.products.length && item.products.reduce(function(prev, cur) {
        return prev + cur.qty;
    }, 0);

    const handleSelect = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        setSelected(item);
    }
    
    if(isPopup) {
        return (
            <div className={`${classes.block} ${classes.shadow}`} onClick={() => setSelected({...item, selectedItems: []})}>
                <div className={classes.templateIcon}><Folder/></div>
                <Typo as="p" variant="p" font="bold" className={classes.name}>{item.name}</Typo>
                <Typo as="p" variant="p" font="regular">{quantity} {__("products")}</Typo>
            </div>
        )
    }

    return (
        <div className={classes.block} onClick={() => { setSelected(item); setView("view_template")}}>
            {companyRole !== 1 ?
                <div className={classes.deleteTemplate} onClick={(e) => { handleSelect(e, item); selectToRemove(item) }}>
                    <Close/>
                </div> 
            : null}
            <div className={classes.templateIcon}><Folder/></div>
            <Typo as="p" variant="p" font="bold" className={classes.name}>{item.name}</Typo>
            <Typo as="p" variant="p" font="regular">{quantity} {__("products")}</Typo>
            {companyRole === 1 ? 
                <Typo as="p" variant="p" color="secondary" className={classes.edit} onClick={(e) => { handleSelect(e, item); setView("view_template")}}>{__("View template")}</Typo>
            :
                <Typo as="p" variant="p" color="secondary" className={classes.edit} onClick={(e) => { handleSelect(e, item); setView("edit_template")}}>{__("Edit template")}</Typo>
            }
        </div>
    );
};

export default Template;