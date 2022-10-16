import React, { Fragment, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import {
  connectHierarchicalMenu,
  // connectStateResults,
  connectCurrentRefinements,
  // Configure,
  connectStateResults
} from "react-instantsearch-dom";
import { useHistory, withRouter } from "react-router-dom";
import classes from "pages/Categories/categories.css";
// import Hits from "algolia/ProductList/productList";
import Cards from "algolia/ProductCategories/cards";
import TopCards from "algolia/ProductCategories/topCards";
import { addSubs, setIsSearching } from "actions/categories";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import CurrentRefinements from "algolia/CurrentRefinements/currentRefinements";
// import { createBrowserHistory } from "history";
import { isPageRefreshed } from "helper/utils";
import Loading from "components/Loading";
import { firstUpperCase } from "../../../../helper/utils";
import View1 from "icons/View1";
import View2 from "icons/View2";
import Typo from "components/UI/Typo/index";
import useWindowDimensions from "talons/useWindowDimensions";
import { MOBILE_SIZE, STORES } from "conf/consts";
import Filter from "icons/Filter";
import AppWrapper from "components/UI/AppWrapper/index";
import FiltersList from "./FiltersList";
import Arrow from "icons/Arrow";
import Head from "components/Head";
// import isArray from 'lodash/isArray';
import { setCurrentStores } from 'actions/categories';
import { actions } from 'actions/topCategories';
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link'
import { useSelector } from 'react-redux';
import { storeUrl } from "components/Algolia/Menu/menu";
// import useVisibleShops from 'talons/useVisibleShops';
import PopularFilters from '../ProductCategories/popularFilters';
import InstantSwitch from "./toggles/instantSwitch";
import CatalogSwitch from './toggles/catalogSwitch';
import InfiniteScroll from "components/InfiniteScroll/";
import { setCatalogChecked } from 'actions/categories';
import Button from "components/Button";

const ResetFilters = connectCurrentRefinements(({ items, refine }) => {
  const history = useHistory();
  const currentStores = useSelector(state => state.categories.currentStores);
  const searchRef = useSelector(state => state.categories.searchRefinement);
  const localeId = useSelector(state => state.language.currentLanguage);
  const __ = useTranslation();

  return (
      <div onClick={() => {
        refine(items);
        if(searchRef) {
          if(localeId === "default") {
            history.push(`/search?query=${searchRef}`, {
              state: {
                isFromSearchBox: false,
                searchRefinement: searchRef
              },
            })
          }
          else
          if(localeId) {
            history.push(`/search?query=${searchRef}${codeSplitter(localeId)}`, {
              state: {
                isFromSearchBox: false,
                searchRefinement: searchRef
              },
            })
          }
        }        
        else {
        if(localeId === "default") {
          history.replace(`${storeUrl({ value: currentStores[0] })}`)
        }
        else {
          localeId && history.replace(`${storeUrl({ value: currentStores[0] })}${codeSplitter(localeId)}`)
        }
      }
      }} className={classes.resetFilters}>
        <Typo variant={"pxs"} font="bold">
          {__("RESET FILTERS")}
        </Typo>
      </div>
  )
});

const ClearAll = connectCurrentRefinements(({ items, refine }) => (
  <div onClick={() => refine(items)} className={classes.clearAllBtn}>
    <Typo>CLEAR ALL</Typo>
  </div>
));

const MainContent =  connectStateResults(
  ({
    searching = false,
    subs,
    items,
    onClickHandler,
    isLast,
    // searchRefinement,
    currentRefinements,
    dispatch,
    match,
    isLarge,
    isSearchStalled
  }) => {
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
      dispatch(setIsSearching(searching));
    }, [searching]);

    return (
      <div>
        <div
          id="blaaa"
          style={{
            display:
              (!searching &&
              ((isLast && match.url !== "/categories") ||
                isSearchPage(match.path))) || (searching && (isSearchPage(match.path) || isLast) && scrolling)
                ? "block"
                : "none",
          }}
        >
          <InfiniteScroll
            large={isLarge}
            searching={isSearchStalled}
            setScrolling={setScrolling}
          />
        </div>
        <div
          style={{
            display: searching ? (isSearchPage(match.path) || isLast) ? !scrolling ? "block" : "none" : "block" : "none",
            width: "60vw",
            height: "80vh",
          }}
        >
          <Loading />
        </div>
        <div
          style={{
            display:
              !searching &&
              !isLast &&
              (subs.items ||
                (!subs.items && items.length) ||
                currentRefinements.find(
                  (el) => el.attribute === "categories.lvl0"
                )) &&
              !isSearchPage(match.path)
                ? "block"
                : "none",
          }}
        >
          {isTopCategoryPage(match.path) ?
              <TopCards
                searching={searching}
                items={items}
                subCategories={subs}
                onClick={onClickHandler}
                isLarge={isLarge}
                isTopCategoryPage={isTopCategoryPage}
            />
          :
            <Cards
              searching={searching}
              items={items}
              subCategories={subs}
              onClick={onClickHandler}
              isLarge={isLarge}
            />
          }
        </div>
      </div>
    );
  })

const FilterModal = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`${classes.filterModal} ${
        isOpen ? classes.filterModalOpen : ""
      }`}
    >
      <AppWrapper>
        <div className={classes.filterTopHeader}>
          <Typo>Filters</Typo>
          <Typo onClick={onClose} className={classes.filterTopHeaderSubmit}>
            DONE
          </Typo>
        </div>
        {children}
      </AppWrapper>

      <div className={classes.clearAllWrapper}>
        <ClearAll />
      </div>
    </div>
  );
};

function findByLabel(array, item) {
  if (array && array !== null) {
    for (const el of array) {
      if (el.isRefined) {
        if (el.label === item.label) {
          return el;
        } else {
          return findByLabel(el.items, item);
        }
      }
    }
  } else {
    return item;
  }
}

export function valueHandler(value, url) {
  const SLASH_SYMBOL = '-s';
  if (url) {
    return valueSplited(value)
      .split(" ")
      .join("_")
      .replace(/\//g, SLASH_SYMBOL);
  } else {
    return value.split("_").join(" ").replace(/-s/g, '/');
  }
}

export function valueSplited(value) {
  const splited = value.split("|");
  return splited[splited.length - 1];
}

export function lastElementOfObject(obj, count) {
  const keys = Object.keys(obj);
  const key = obj[keys[keys.length - count]] || "";
  return valueSplited(key);
}

function connectParamsToValue(params) {
  const values = Object.values(params)
    .map((el) => {
      return valueHandler(el);
    })
    .slice(1);

  return values.join("|");
}

function setTitle(currents) {
  const store = currents.find((el) => el.attribute === "vendorcode");
  const cats = currents.find((el) => el.attribute === "categories.lvl0" || el.attribute === "bc_categories.lvl0");
  if (store && !cats) {
    if(parseInt(store.currentRefinement) || store.currentRefinement === "0") {
      const currentStore = STORES.find(store => store.vendorcode === store.currentRefinement);
      if(currentStore) {
        return currentStore.label;
      }
    }
    else {
      return store.currentRefinement;
    }
  } else if (cats) {
    return firstUpperCase(valueSplited(cats.currentRefinement));
  }
}

// function findLabelByVendorcode(arr = [], visibleLength) { 
//   if (!arr || arr.length === 0 || arr.length === visibleLength) {
//     return ["All stores"];
//   }

//   if (!isArray(arr)) {
//    return [arr];
//   }
  
//   const label = arr.map(
//     (el) => STORES.find((store) => store.vendorcode === el).label
//   ); 
//   return label;
// }

export function isSearchPage(pathname) {
  return pathname.includes("search");
}

export const isTopCategoryPage = pathname => {
  return pathname.includes('topcategories');
}

// const getStoreNameFromParams = (params) => valueHandler(params.store);

const Wrapper = ({
  subCategories,
  items,
  refine,
  dispatch,
  topCategoriesValue,
  currentRefinements,
  storeCats,
  searchRefinement,
  hitsPerPage,
  isSearching,
  match, 
}) => {
  const [isLast, setIsLast] = useState(false);
  const [sub, setSub] = useState({});
  const [filterModal, setFilterModal] = useState(false);
  const [large, setLarge] = useState(typeof window !== "undefined" && JSON.parse(localStorage.getItem('listView')) ? true : false);
  const { width } = useWindowDimensions();
  const history = useHistory();
  const localeId = useSelector(state => state.language.currentLanguage);
  const firebaseValues = useSelector(state => state.firebase.config);
  const filters = useSelector(state => state.topCategories.filters);
  const popularFilters = firebaseValues && JSON.parse(firebaseValues.popular_filters);
  const catalogChecked = useSelector(state => state.categories.catalogChecked)
  // const { searchable } = useVisibleShops();
  const __ = useTranslation();
  const isDesktop = width > 784;

  const handleToggleCatalog = (value) => {
    dispatch(setCatalogChecked(value));
  }

  const handleBackButton = () => {
    dispatch(setCurrentStores([]))
    window.removeEventListener("popstate", handleBackButton);
  };
  useEffect(() => {
    window.addEventListener("popstate", handleBackButton, false);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    // const history = createBrowserHistory();
    if (
      isPageRefreshed &&
      topCategoriesValue &&
      !isSearchPage(history.location.pathname)
    ) {
      const length = history.location.pathname.length;
      const path = history.location.pathname[length - 1] === "/" ? history.location.pathname.slice(0, length - 1) : history.location.pathname;
      if(localeId === 'default') {
        history.replace(path, null);
      }
      else {
        localeId && history.replace(`${path}${codeSplitter(localeId)}`, null);
      }
    }
  }, []);
  useEffect(() => {
    refine(topCategoriesValue.label);
  }, [topCategoriesValue.label]);

  useEffect(() => {
    refine(storeCats.catValue);
  }, [storeCats.catValue]);
 
  useEffect(() => {
    if (items.length) {
      const found = findByLabel(items, sub);
      if (found && !sub.items && found.items && found.label === sub.label) {
        dispatch(addSubs(found));
      }

      if (!isEmpty(topCategoriesValue) && items.length) {
        const found = items.find((el) => el.label === topCategoriesValue.label);
        if (found && found.items && found.label === topCategoriesValue.label) {
          dispatch(addSubs(found));
        }
      }

      if (!isEmpty(storeCats) && items.length) {
        const found = findByLabel(items, { label: storeCats.catValue });
        if (found && found.items && found.label === storeCats.catValue) {
          dispatch(addSubs(found));
        }
      }

      if (!items.filter((el) => el.items).length) {
        setIsLast(false);
        dispatch(addSubs({}));
      }
    }
  }, [JSON.stringify(items)]);

  useEffect(() => {
    if (!isEmpty(sub)) {
      if (match.url !== "/categories" && isEmpty(subCategories)) {
        const found = findByLabel(items, {
          label: valueHandler(lastElementOfObject(match.params, 2)),
        });
        if (found) {
          dispatch(addSubs(found));
          setIsLast(true);
        }
      }
    }
  }, [sub]);

  useEffect(() => {
    if (filterModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [filterModal]);

  const onClickHandler = (item) => {  
    window.scrollTo(0, 0);
    const storeRef = currentRefinements.find(
      (el) => el.attribute === "vendorcode"
    );
    const store = STORES.find(
      (el) => el.label === get(storeRef, "currentRefinement", "")
    );
    const params = { storeCats: { store: store ? store.vendorcode : "" } }; 

    if (isLast) {
      if (
        valueHandler(item.label, true) ===
        valueHandler(lastElementOfObject(match.params, 1), true)
      ) {
        return false;
      }
      const withoutLast = match.url
        .split("/")
        .splice(0, match.url.split("/").length - 1)
        .join("/");
      const length = withoutLast.length;
      const path = withoutLast[length - 1] === "/" ? withoutLast.slice(0, length - 1) : withoutLast;
      if(localeId === 'default') { 
        history.push(`${path}/${valueHandler(item.label, true)}`, params);
      }
      else {
        localeId && history.push(`${path}/${valueHandler(item.label, true)}${codeSplitter(localeId)}`, params);
      }
    } else {
      const length = match.url.length;
      const path = match.url[length - 1] === "/" ? match.url.slice(0, length - 1) : match.url;
      history.push(`${path}/${valueHandler(item.label, true)}`, params);
    } 

  };
  useEffect(() => {
    if (isDesktop) {
      setFilterModal(false);
    }
  }, [isDesktop]);
  useEffect(() => {
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", match.params)
    // const sub = {label: valueHandler(lastElementOfObject(match.params))}
    // const found = findByLabel(items, sub);
    // if (
    //     found &&
    //     !sub.items &&
    //     found.items &&
    //     found.label === sub.label
    // ) {
    //     console.log("found", found)
    //     dispatch(addSubs(found));
    // } 
      if (!isEmpty(match.params) && items.length) { 
      refine(connectParamsToValue(match.params));
      setSub({
        label: valueHandler(lastElementOfObject(match.params, 1)),
        value: valueHandler(lastElementOfObject(match.params, 1)),
      });
    }  
    
  }, [match.url, JSON.stringify(items)]);

  let categoriesTitle = setTitle(currentRefinements);
  setTitle(currentRefinements);

  const openFilterModal = (toggle) => setFilterModal(toggle);
  const getParams = valueHandler(lastElementOfObject(match.params, 2));
  const subTitle = () => {
    const it = valueHandler(lastElementOfObject(match.params, 2));

    if (it) {
      if(isTopCategoryPage(match.path) && it === "building supplies") {
        return (
          <div>
            <Typo>Filter</Typo>
          </div>
        )
      }
      return (
        <div
          className={classes.subTitleElement}
          onClick={() => {
            const l = valueHandler(lastElementOfObject(match.params, 1));
            const splited = history.location.pathname.split("/");
            const index = splited.findIndex((el) => el === l);
            if(localeId === 'default') { 
              history.replace(`${splited.slice(0, index).join("/")}`);
            }
            else {
              localeId && history.replace(`${splited.slice(0, index).join("/")}${codeSplitter(localeId)}`);
            }
          }}
        >
          <Arrow />{" "}
          <Typo style={{ textTransform: "capitalize" }}>
            {firstUpperCase(it)}
          </Typo>
        </div>
      );
    } else {
      return (
        <div>
          <Typo>Filter</Typo>
        </div>
      );
    }
  };
  
  const currCategoryHasFilters = useMemo(() => {
    let hasFilters = false;
    if(currentRefinements && currentRefinements.length) {
      currentRefinements.map(el => {
        if(el.attribute.includes("bc_categories") && el.currentRefinement && popularFilters[el.currentRefinement] && popularFilters[el.currentRefinement].length) {
          if(filters.length && filters.length === popularFilters[el.currentRefinement].length && filters[0].name === popularFilters[el.currentRefinement][0].name) {
            hasFilters = true;
          }
          else {
            const arr = popularFilters[el.currentRefinement].map(el => { return {...el, active: false }});
            dispatch(actions.setFilters(arr));
            hasFilters = true;
          }
        }
      }).length;
    }
    return hasFilters;
    
  }, [currentRefinements, popularFilters, filters]);

  return (
    <div className={classes.Categories}>
      <Head isCategory={true}>
        {!isSearchPage(history.location.pathname)
          ? categoriesTitle
          : `${__("Results for")} "${searchRefinement}"`}
      </Head>
      {/* <Configure hitsPerPage={12} facets={["*"]} filters="in_stock:true" /> */}
      {/* {width > 784 && ( */}
      {/* <StateResult /> */}
      <FiltersList
        hidden={width <= 784}
        className={classes.categoresSidebar}
        subCategories={subCategories}
        storeCats={storeCats}
        items={items}
        onClickHandler={onClickHandler}
        refineCategory={refine}
        match={match}
        isLast={isLast}
        setLarge={setLarge}
        large={large}
      />
      {/* )} */}
      <div className={classes.mainContentWrapper}>
        <div className={classes.topHeader}>
          <div
            className={classes.titleWithButtons}
            style={{
              justifyContent: 'space-between'
                // isLast || searchRefinement ? "space-between" : "flex-end",
            }}>
             <div className={classes.filterWrapper}>
                {!isSearching && (
                  <div>
                    <CurrentRefinements
                      catRefine={refine}
                      match={match}
                      searchRefinement={searchRefinement}
                    />
                  </div>
                )}
            </div>
            {width <= MOBILE_SIZE && (
              <div className={classes.allFilters}>
                <div
                  className={`${classes.mobileFilters} ${
                    getParams ? classes.filterWithParams : ""
                  }`}
                  onClick={() => openFilterModal(true)}
                >
                  {subTitle()}
                  <div className={classes.filterIconWrapper}>
                    <Filter />
                    {getParams && <Typo>Filters</Typo>}
                  </div>
                </div>
                {(searchRefinement || isLast) && 
                  <div>
                    <InstantSwitch
                      classes={{root: classes.instantDeliveryMobile, disabled: classes.disabled, enabled: classes.enabled}}
                    />
                    {!isTopCategoryPage(history.location.pathname) ? 
                      <CatalogSwitch
                        classes={{root: classes.instantDeliveryMobile, disabled: classes.disabled, enabled: classes.enabled}}
                      />
                      : null
                    }
                  </div>
                }
              </div>
            )}
            <div className={classes.resetFilterButtonsDiv}>
              {currentRefinements.filter((el) => el.attribute !== "vendorcode")
                  .length && !isTopCategoryPage(history.location.pathname) ? (
                  <ResetFilters />
                ) : (
                  ""
              )}
              {!isSearching ? (
                // (!isEmpty(subCategories) && isLast) || searchRefinement ? (
                <div className={classes.viewButtons}>
                  <div
                    className={
                      large ? classes.firstViewLight : classes.firstViewDark
                    }
                    onClick={() => {
                      setLarge(false);
                      localStorage.setItem('listView', false);
                    }}
                  >
                    <View1 />
                  </div>
                  <div
                    className={
                      large ? classes.secondViewDark : classes.secondViewLight
                    }
                    onClick={() => {
                      setLarge(true); 
                      localStorage.setItem('listView', true);
                    }}
                  >
                    <View2 />
                  </div>
                </div>
              ) : (
                // ) : (
                //   ""
                // )
                ""
              )}
            </div>
          </div>
          {isLast && isTopCategoryPage(history.location.pathname) && currCategoryHasFilters ?
              <PopularFilters />      
            :
              null
          }
          <div className={classes.filterWrapper}>
          {!isSearching && (searchRefinement || isLast) && (
              <div
                className={width <= 784 ? classes.titleWithButtonsMobile : ""}
                style={{
                  marginBottom: "12px",
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                {searchRefinement ? (
                  <Fragment>
                    <div className={classes.searchResultInfo}>
                      <h2 className={classes.mBottom20}>
                      {hitsPerPage} {__("Results for")}: &quot;{searchRefinement}&quot;
                        {!catalogChecked ? " in top categories" : ""}
                    </h2>
                      {items.length === 0 && hitsPerPage === 0 &&
                      <div className={classes.emptySection}>
                        <span className={classes.mBottom20}>Continue search in entire catalog </span>
                        <Button
                          label={__("CONTINUE")}
                          classes={{button_primary: classes.continueButton}}
                          onClick={() => handleToggleCatalog(true)}
                        />
                      </div>}
                    </div>
                    {width > MOBILE_SIZE &&
                      <div className={classes.toggles}>
                        <CatalogSwitch
                          classes={{root: classes.entireCatalog, disabled: classes.disabled, enabled: classes.enabled}}
                        />
                        <InstantSwitch
                          classes={{root: classes.instantDelivery, disabled: classes.disabled, enabled: classes.enabled}}
                        />
                      </div>
                    }
                  </Fragment>
                ) : (
                  <Fragment>
                    <h1 className={classes.title}>{categoriesTitle}</h1>
                    {width > MOBILE_SIZE &&
                      <div className={classes.toggles}>
                        <InstantSwitch
                          classes={{root: classes.instantDelivery, disabled: classes.disabled, enabled: classes.enabled}}
                        />
                      </div>
                    }
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </div>
        <MainContent
          subs={subCategories}
          items={items}
          onClickHandler={onClickHandler}
          isLast={isLast}
          searchRefinement={searchRefinement}
          dispatch={dispatch}
          match={match}
          currentRefinements={currentRefinements}
          isLarge={large}
        />
          {/* <Hits large={large} isShow={width > 784} /> */}
      </div>
      <FilterModal isOpen={filterModal} onClose={() => setFilterModal(false)}>
        {width <= 784 && (
          <FiltersList
            hidden={isDesktop}
            subCategories={subCategories}
            storeCats={storeCats}
            items={items}
            onClickHandler={onClickHandler}
            className={classes.modalFilterList}
            isLast={isLast}
            setLarge={setLarge}
            large={large}
            match={match}
          />
        )}
      </FilterModal>
    </div>
    // </div>
  );
};

export default connectHierarchicalMenu(
  connect((state) => ({
    subCategories: state.categories.sub,
    refineValue: state.categories.refineValue,
    currentRefinements: state.categories.currentRefinements,
    searchRefinement: state.categories.searchRefinement,
    isSearching: state.categories.isSearching,
    hitsPerPage: state.categories.hitsPerPage,
  }))(withRouter(Wrapper))
)
