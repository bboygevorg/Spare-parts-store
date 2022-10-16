import React, { useState, useEffect, useCallback } from "react";
import classes from "./searchBox.css";
import { connectSearchBox, InstantSearch } from "react-instantsearch-dom";
import { withRouter } from "react-router-dom";
import CategoriesWithStores from "algolia/CategoriesWithStores/categoriesWithStores";
import Button from "components/Button";
import Input from "components/Input";
import Search from "icons/Search";
import { useDispatch, useSelector } from "react-redux";
import { setSearchRefinement } from "../../../store/actions/categories";
import { isSearchPage } from "../ProductCategories/wrapper";
import useVisibleShops from 'talons/useVisibleShops';
import AutoComplete from '../AutoComplete';
import { searchClient } from "conf/main";
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link';
import { getParameterByName } from "helper/utils";

const titles = {
  all: 'Search all stores...',
  store: 'Search in ',
  stores: 'Search in multiple stores...'
}

const SearchBox = ({
  currentRefinement,
  /*isSearchStalled*/ refine,
  history,
  location,
}) => {
  const [value, setValue] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
	const searchQuery = getParameterByName('query', history.location);
	const { visibleShops } = useVisibleShops();
  const currentStores = useSelector(state => state.categories.currentStores);
  const translations = useSelector(state => state.language.data);
  const localeId = useSelector(state => state.language.currentLanguage);
  const __ = useTranslation();
  useEffect(() => {
    dispatch(setSearchRefinement(currentRefinement));
  }, [currentRefinement]);

  useEffect(() => {
    if (
      (history.location.pathname.indexOf("/categories") === -1 ||
        history.location.pathname === "/") &&
      !isSearchPage(window.location.pathname)
    ) {
      refine("");
      setValue("");
      dispatch(setSearchRefinement(""));
      document.getElementById("searchbox-input").value = ""; 

      return;
    }
    if (isSearchPage(history.location.pathname) && searchQuery) {
      setIsOpen(false);
      refine(searchQuery);
      setValue(searchQuery);
      dispatch(setSearchRefinement(searchQuery));
    }

  }, [location]);
  useEffect(() => {
    if(isSearchPage(history.location.pathname) && !focused) {
      setIsOpen(false);
    }
  }, [location, focused])

  const getPlaceholder = useCallback(() => {
    if(!currentStores.length) {
      return __(titles.all);
    }
    else
    if(currentStores.length === 1 && visibleShops.length) {
      const shop = visibleShops.find(store => store.vendorcode === currentStores[0]);
      return `${__(titles.store)} ${__(shop.label)}...`;
    }
    else {
      return __(titles.stores);
    }
  }, [currentStores, visibleShops, translations])

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

  return (
    <div className={classes.searchbox}>
      <div className={classes.searchSuggestions}>
        <div className={classes.searchboxWrapper}>
          <div className={classes.iconWrapper}>
            <Search />
          </div>
          <Input
            id="searchbox-input"
            placeholder={__("Search") + "..." || getPlaceholder()}
            value={value ? value : ''}
            classes={{ custom: classes.searchInput }}
            onChange={(event) => {setValue(event.currentTarget.value)}}
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                if (e.target.value === "") {
                  return;
                } else {
                  setCurrentSearchQuery(e.target.value);
                  document.activeElement.blur();
                  setIsOpen(false);
                  setFocused(false);
                  if(localeId === "default") {
                    history.push(`/search?query=${e.target.value}`, {
                      state: {
                        isFromSearchBox: true,
                      },
                    });
                  }
                  else {
                     localeId && history.push(`/search?query=${e.target.value}${codeSplitter(localeId)}`, {
                      state: {
                        isFromSearchBox: true,
                      },
                    });
                  }
                }

                setValue(e.target.value);
                refine(e.target.value);
              }
            }}
            onFocus={() => {
              if(value) {
                setIsOpen(true);
              }
              setFocused(true);
            }}
          />
          <CategoriesWithStores attribute={"vendorcode"} top={true}/>
        </div>
        { value ? <InstantSearch
          searchClient={searchClient}
          indexName="query_suggestions">
            <AutoComplete
              setIsOpen={setIsOpen}
              value={value}
              isOpen={isOpen}
              setValue={setValue}
              focused={focused}
              setFocused={setFocused}
              setCurrentSearchQuery={setCurrentSearchQuery}
            />
          </InstantSearch> : null }
      </div>
      <Button
        label={__("SEARCH")}
        onClick={() => {
          if (value === "") {
            return;
          } else {
            setCurrentSearchQuery(value)
            setIsOpen(false);
            setFocused(false);
            if(localeId === "default") {
              history.push(`/search?query=${value}`, {
                state: {
                  isFromSearchBox: true,
                },
              });
            }
            else {
              localeId && history.push(`/search?query=${value}${codeSplitter(localeId)}`, {
                state: {
                  isFromSearchBox: true,
                },
              });
            }
          }
          setValue(value);
          refine(value);
        }}
      />
    </div>
  );
};

export default connectSearchBox(withRouter(SearchBox));
