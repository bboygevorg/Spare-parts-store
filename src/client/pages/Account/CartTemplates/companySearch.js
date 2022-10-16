import React, { useMemo, useState } from 'react';
import { connectSearchBox, InstantSearch } from "react-instantsearch-dom";
import Input from "components/Input";
import classes from './companySearch.css';
import Button from 'components/Button';
import ProductList from 'components/Algolia/ProductList';
import Typo from 'ui/Typo/index';
import { searchClient } from "conf/main";
import AutoComplete from 'algolia/AutoComplete';

const CompanySearch = ({
    __,
    currentRefinement,
    // isSearchStalled,
    refine,
    itemsPerPage,
    setItemsPerPage,
    currentPageInfo,
    setCurrentPageInfo,
    onClose,
    addAction,
    addButtonLabel,
    isSubmitting
}) => {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [focused, setFocused] = useState(false);

    const hasSelectedItems = useMemo(() => {
        return itemsPerPage.some(el => el.items && el.items.length);
    }, [itemsPerPage]);


    const setCurrentSearchQuery = (query) => {
        if(query) {
          const searchHistory = localStorage.getItem('searchHistory');
          const queries = searchHistory && JSON.parse(searchHistory);
        if (!queries) {
            localStorage.setItem("searchHistory", JSON.stringify([query]));
        }
        if (queries) {
          if(!queries.includes(query) && queries.length <= 9) {
            let arr = [query, ...queries];
            localStorage.setItem('searchHistory', JSON.stringify(arr));
          }
          else
          if(queries.includes(query) && queries.length <= 9) {
            const index = queries.findIndex(el => el === query);
            let arr = [...queries];
            arr.splice(index,1);
            arr = [query, ...arr];
            localStorage.setItem('searchHistory', JSON.stringify(arr));
          }
          else
          if(queries.length > 9) {
            queries.pop();
            let arr = [query, ...queries];
            localStorage.setItem('searchHistory', JSON.stringify(arr));
          }
        }
      }
    }

    const handleRevineValue = (value) => {
        if(value) {
            setItemsPerPage([{all: false, page: 1, items: []}]);
            refine(value);
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.top}>
                <Typo as="h3" variant="h3">{__("Search products from entire catalogue")}</Typo>
                <div className={classes.action}>
                    <div className={classes.inputAndSuggestions}>
                        <Input
                            placeholder={__("Search") + "..."}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            classes={{ input: classes.searchInput}}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    if (e.target.value === "") {
                                        return;
                                    } 
                                    else {
                                        setItemsPerPage([{all: false, page: 1, items: []}]);
                                        setIsOpen(false);
                                        setFocused(false);
                                        refine(e.target.value);
                                    }
                                }
                            }}
                            onFocus={() => {
                                if(value) {
                                  setIsOpen(true);
                                }
                                setFocused(true);
                            }}
                        />
                        <InstantSearch
                            searchClient={searchClient}
                            indexName="query_suggestions"
                        >
                            <AutoComplete 
                                setIsOpen={setIsOpen} 
                                value={value} 
                                isOpen={isOpen} 
                                setValue={setValue} 
                                focused={focused} 
                                setFocused={setFocused}
                                setCurrentSearchQuery={setCurrentSearchQuery}
                                classes={{customOptionsOpen: classes.openedSuggestions, option: classes.suggestionOption}}
                                isAccount={true}
                                handleRevineValue={handleRevineValue}
                            />
                        </InstantSearch>
                    </div>
                    <Button 
                        label={__("SEARCH")}
                        onClick={() => {
                            setItemsPerPage([{all: false, page: 1, items: []}]);
                            refine(value);
                        }}
                        classes={{ button_primary: classes.searchButton }}
                    />
                </div>
            </div>
            {currentRefinement ? 
                    <ProductList
                        __={__}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPageInfo={currentPageInfo}
                        setCurrentPageInfo={setCurrentPageInfo}
                    />
            :
                null
            }
            <div className={classes.actions}>
                <Button 
                    label={__("Cancel")}
                    type="bordered"
                    classes={{ button_bordered: classes.cancelButton }}
                    onClick={onClose}
                />
                <Button
                    label={addButtonLabel ? addButtonLabel : __("Add to template")}
                    classes={{button_primary: classes.addButton}}
                    onClick={addAction}
                    disabled={!hasSelectedItems}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default connectSearchBox(CompanySearch);