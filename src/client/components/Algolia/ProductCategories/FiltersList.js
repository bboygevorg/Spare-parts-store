import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Accordion from "components/Accordion/index";
import ProductCategories from "algolia/ProductCategories/productCategories";
import RangeInput from "algolia/RangeInput";
import Menu from "algolia/Menu";
import classes from "pages/Categories/categories.css";
import useWindowDimensions from "talons/useWindowDimensions";
import isEmpty from "lodash/isEmpty";
import Typo from "components/UI/Typo";
import View1 from "icons/View1";
import View2 from "icons/View2";
import DynamicFacets from "../DynamicFacets"; 
// import StoresRefinementList from "../StoresRefinementList";
import { isSearchPage, isTopCategoryPage } from "./wrapper";
// import useVisibleShops from 'talons/useVisibleShops';
import useTranslation from 'talons/useTranslation';


const FiltersList = ({
  className,
  storeCats,
  items,
  onClickHandler,
  isLast,
  setLarge,
  large,
  match,
  hidden,
  // refineCategory,
}) => {
  const { width } = useWindowDimensions();
  const [mouseOn, setMouseOn] = useState(false);
  // const { visibleShops, storeElements, searchable } = useVisibleShops();
  const __ = useTranslation();
  const subCategories = useSelector((state) => state.categories.sub);
  const isSearching = useSelector((state) => state.categories.isSearching);
  const showSeparateScroll = width > 784 && (isSearchPage(match.path) || isLast);
  const facets = useSelector(state => state.topCategories.facets);

  useEffect(() => {
    if(typeof window !== "undefined") {
        if (mouseOn) {
            document.body.style.overflowX = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
  }, [mouseOn]);

  return (
    <div
      className={`${classes.sidebar} ${className} ${
        hidden ? classes.hidden : ""} ${showSeparateScroll && classes.fixed}`}
      onMouseEnter={() => {if(showSeparateScroll) { setMouseOn(true) }}}
      onMouseLeave={() => {if(showSeparateScroll) { setMouseOn(false) }}}
    >
      {typeof window !== 'undefined' && !isSearchPage(window.location.pathname) && !isTopCategoryPage(window.location.pathname) && (
        <Accordion
          title={__("Stores")}
          component={() => (
            <div>
              <Menu
                subs={subCategories}
                attribute={"vendorcode"}
                storeCats={storeCats}
                match={match}
              />
            </div>
          )}
        />
      )}
      {width > 784 && !isSearchPage(match.path) && (
        <Accordion
          title={__("Product Categories")}
          component={() => (
            <div>
              <ProductCategories
                items={items}
                subCategories={subCategories}
                onClick={onClickHandler}
                isSearching={isSearching}
              />
            </div>
          )}
        />
      )}

      {(isSearchPage(match.path) || isLast) && (
        <Fragment>
          <Accordion
            title={"Price $"}
            defaultStatus={false}
            component={() => (
              <div>
                <RangeInput attribute="price" />
              </div>
            )}
          />
          {/* {typeof window !== 'undefined' && isSearchPage(window.location.pathname) && storeElements.length && visibleShops.length &&
            <Accordion
              title={__("Stores")}
              component={() => (
                <div>
                  <StoresRefinementList attribute={"vendorcode"} isSearchPage={true} storeElements={storeElements} visibleShops={visibleShops} searchableStores={searchable}/>
                </div>
              )}
            />
          } */}
          <DynamicFacets />
        </Fragment>
      )}
      {(width > 784 || width <= 784) && isTopCategoryPage(match.path) && !isLast && (
        <Fragment>
          <Accordion
            title={"Price $"}
            defaultStatus={false}
            component={() => (
              <div>
                <RangeInput attribute="price" />
              </div>
            )}
          />
          <DynamicFacets facets={facets}/>
        </Fragment>
      )}
      {width <= 784 &&
        ((!isSearching && !isEmpty(subCategories) && isLast) ||
          isSearchPage(match.path)) && (
          <div className={classes.filterModalView}>
            <Typo variant="p" className={classes.filterModalViewTitle}>
              View
            </Typo>

            <div className={classes.filterViewButtons}>
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
          </div>
        )}
    </div>
  );
};

export default FiltersList;
