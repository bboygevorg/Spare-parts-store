import React, { useState, useEffect } from "react";
import {
  // connectHierarchicalMenu,
  connectStateResults,
  connectMenu,
  Configure,
} from "react-instantsearch-dom"; 
import productCategories from 'store/productCategories.json';
import categoriesImages from 'store/categoriesImages.json';
import Typo from 'ui/Typo';
import AppWrapper from 'ui/AppWrapper';
import classes from './productCategoriesPage.css';
import { firstUpperCase } from 'helper/utils';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { refineStore } from "actions/categories";
import {valueHandler} from "components/Algolia/ProductCategories/wrapper";
import {storeUrl} from "components/Algolia/Menu/menu";
import useShops from "talons/useShops";  
import { setCurrentStores } from "actions/categories";
import useTranslation from 'talons/useTranslation';
import useVisibleShops from 'talons/useVisibleShops';
import { useSelector } from 'react-redux';
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";

const Tabs = connectMenu(({ store, setStore, refine }) => {
  const dispatch = useDispatch();
  const {shops} = useShops()
  const __ = useTranslation()
  useEffect(() => {
    const el = shops[0];
    if(!el) {
      return 
    }
    dispatch(refineStore({label: el.vendorcode, value: el.vendorcode}))
    dispatch(setCurrentStores([el.vendorcode]))
    refine(el.vendorcode)
  },[]);
  return (
    <div className={classes.stores}>
      {shops.map(
        (el) => (
          <div
            key={el.vendorcode}
            className={
              store === el.vendorcode ? classes.clickedStore : classes.store
            }
            onClick={() => {
              setStore(el.vendorcode);
              dispatch(
                refineStore({ label: el.vendorcode, value: el.vendorcode })
              );
              dispatch(setCurrentStores([el.vendorcode]))
              refine(el.vendorcode);
            }}
          >
            <div className={classes.imgWrapper}>
              <img src={el.finalImage} />
            </div>
            <Typo
              as="h3"
              variant="h3"
              font="condensed"
              color="primary"
              className={classes.label}
            >
              {__(el.label)}
            </Typo>
          </div>
        )
        // );
        // }
      )}
    </div>
  );
});

const ProductCategoriesPage = ( ) => {
  const { availableStores } = useVisibleShops();
  const [store, setStore] = useState(availableStores.length && availableStores[0]);
  const isGoogleBot = useSelector(state => state.firebase.isGoogleBot);
  const { currentLanguageName } = useCurrentLanguage();
  const history = useHistory(); 
  const __ = useTranslation();
  const categoryClickHandler = (cat) => {
    const splited = cat.value
      .split("|")
      .map((el) => valueHandler(el, true))
      .join("/");
    history.replace(`${storeUrl({ value: store })}/${splited}`, {
      storeCats: { store: store, catValue: cat.value },
    });
  };
  useEffect(() => {
    // algoliaIndex.search("", {
    //   facetFilters: ["vendorcode:4"]
    // });
    document.body.style.backgroundColor = "var(--global-white-color)";
    return () =>
      (document.body.style.backgroundColor = "var(--global-light-color)");
  }, []);
  return (
    <AppWrapper>
      <Typo
        as="h2"
        variant="h2"
        font="condensed"
        color="primary"
        className={classes.title}
      >
        {__("PRODUCTS BY CATEGORY")}
      </Typo>
      <Configure
        clickAnalytics 
        enablePersonalization={true}
        hitsPerPage={999}
        facets={["categories.lvl0", "categories.lvl1"]}
        filters={"vendorcode:0"}
        analytics={isGoogleBot ? false : true}
        attributesToRetrieve={[...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]}
      />
      <Tabs attribute={"vendorcode"} store={store} setStore={setStore} />
      <div className={classes.items}>
        {Object.values(productCategories).map((el, index) => {
          if (store === index.toString()) {
            return el.map((cat, i) => (
              <div key={i} className={classes.subs}>
                <div className={classes.iconLabelDiv}>
                  {categoriesImages[cat.label] && (
                    <img
                      src={categoriesImages[cat.label]}
                      className={classes.categIcon}
                    />
                  )}
                  <Typo as="h3" variant="h3" font="bold">
                    {firstUpperCase(cat.label)}
                  </Typo>
                </div>
                <div className={classes.subLabels}>
                  {cat.items.map((item, ind) => {
                    if(ind < 12) {
                      return (
                        <Typo
                          key={ind}
                          onClick={() => categoryClickHandler(item)}
                          as="p"
                          variant="px"
                          font="regular"
                          className={classes.subLabel}
                        >
                          {firstUpperCase(item.label.split("|")[1]) ? firstUpperCase(item.label.split("|")[1]) : firstUpperCase(item.label.split("|")[0])}
                        </Typo>
                      )
                    }
                  })}
                  {cat.items.length >= 12 && (
                    <Typo
                      as="p"
                      variant="p"
                      color="secondary"
                      className={classes.viewMore}
                      onClick={() => categoryClickHandler(cat)}
                    >
                      VIEW MORE
                    </Typo>
                  )}
                </div>
              </div>
            ));
          }
        })}
      </div>
    </AppWrapper>
  );
};

export default  
  connectStateResults(ProductCategoriesPage) 
