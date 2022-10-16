import React from 'react';
import classes from './templates.css';
import AddItem from 'icons/account/AddItem';
import Loading from 'components/Loading';
import Template from './template';
import Typo from 'ui/Typo';

const Templates = (props) => {
    const {
        __,
        templates, 
        isSubmitting, 
        setView, 
        companyRole,
        selectToRemove,
        setSelected
    } = props;

    if(isSubmitting) {
        return (
            <div className={classes.loadingWrapper}>
                <Loading/>
            </div>
        );
    }

    if(!isSubmitting && !templates.length && companyRole === 1) {
        return (
            <Typo as="p" variant="p" font="regular" className={classes.noResult}>{__("No results.")}</Typo>
        );
    }

    return (
        <div className={classes.root}>
            {companyRole !== 1 ?
                <div className={classes.addBlock} onClick={() => setView("create_template")}>
                    <AddItem/>
                </div>
            : null}
            {templates.map(item => 
                <Template 
                    key={item.id} 
                    item={item} 
                    selectToRemove={selectToRemove} 
                    setSelected={setSelected} 
                    companyRole={companyRole} 
                    __={__}
                    setView={setView}
                />
            )}
        </div>
    );
};

export default Templates;