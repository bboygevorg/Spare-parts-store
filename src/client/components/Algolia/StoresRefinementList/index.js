import React, { useEffect, useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import classes from "../RefinementList/refinementList.css";
import CheckBox from "components/CheckBox";
import { ALL_STORES_VALUE } from "../Menu/menu";
import get from "lodash/get";
// import isEmpty from 'lodash/isEmpty'
import { valueHandler } from "../ProductCategories/wrapper";
// import { useHistory } from "react-router-dom";
// import { getParamFromQueryString } from "helper/utils";
import { useSelector, useDispatch } from "react-redux"; 
import { setCurrentStores } from "actions/categories";
import useTranslation from 'talons/useTranslation';
// const generateSearchUrl = (key, arr) => {
//   const searchQuery = getParamFromQueryString("q");
//   const params = new URLSearchParams();
//   params.append("q", searchQuery);
//   arr.forEach((el) => params.append(key, el.toLowerCase()));
//   return params.toString();
//   // const arrWithKeys = arr.map(el => `${key}=${el.toLowerCase()}`)
//   // return arrWithKeys.join('&');
// };

const StoresRefinementList = ({ items, refine, isSearchPage, storeElements, visibleShops, searchableStores }) => {
  const dispatch = useDispatch();
  const [storesArray, setStoresArray] = useState([{ label: "All Stores", value: ALL_STORES_VALUE, isRefined: isSearchPage }, ...storeElements]);
  // const storeParamValues = getParamFromQueryString("store", true);
  const currentRefinements = useSelector(state => state.categories.currentRefinements);
  const currentStores = useSelector(state => state.categories.currentStores);
  const __ = useTranslation();
  const getIsRefined = (val) => {
    const countStoreRefined = items.filter(el => el.isRefined === true);
    if(countStoreRefined.length === searchableStores.length) {
      return false;
    }
    if (val !== ALL_STORES_VALUE) {
      const found = items.find((el) => {
        return el.label === val;
      });
      return get(found, "isRefined", false);
    }
  };

  // useEffect(() => {
  //   const vendorcodes = storeParamValues.map((val) => {
  //     const store = STORES.find(
  //       (storeElm) => valueHandler(val) === storeElm.label.toLocaleLowerCase()
  //     );
  //     return store.vendorcode;
  //   });

   
  // }, []);

  useEffect(() => {
    if(currentStores.length) {
      refine(currentStores)
      handleAllStoresCheckbox(false);
    }
    else {
      handleAllStoresCheckbox(true);
      refine(searchableStores);
    }
  }, [currentStores])

  useEffect(() => {
    const isStoreRefined = items.some((el) => el.isRefined === true);
    const foundStore = currentRefinements.find(el => el.attribute === 'vendorcode')
    const countStoreRefined = items.filter(el => el.isRefined === true);
    if(countStoreRefined.length === searchableStores.length) {
      handleAllStoresCheckbox(true);
    }
    else
    if (isStoreRefined && foundStore) {
      handleAllStoresCheckbox(false);
    }
  }, [JSON.stringify(items), currentRefinements]);
  // const refineDefaultStores = useCallback(() => {

  // }, [])
  const handleAllStoresCheckbox = (elRef) => { 
    setStoresArray(
      [...storesArray].map((el) =>
        el.value === ALL_STORES_VALUE ? { ...el, isRefined: elRef } : el
      )
    );

  }

  if(!storesArray.length) {
    return false;
  }
  return (
    <div className={classes.productList}>
      {storesArray.map((el) => (
        <CheckBox
          key={el.label}
          label={__(el.label)}
          value={el.value === ALL_STORES_VALUE ? el.isRefined : getIsRefined(el.value)}
          onChange={() => {
            if(el.value === ALL_STORES_VALUE ) {
                dispatch(setCurrentStores([]))
                handleAllStoresCheckbox(true);
                refine(searchableStores);
              return false
            } 
            const refinedItems = items.filter((it) => it.isRefined);
            const labels = refinedItems.map((refIt) => {
              const label = visibleShops.find((store) => store.vendorcode === refIt.label) ? visibleShops.find((store) => store.vendorcode === refIt.label).label : "";
              if(label) {
                return valueHandler(
                  label,
                  true
                );
              }
             });
            if (
              !labels.find((label) => valueHandler(el.label, true) === label)
            ) {
              labels.push(valueHandler(el.label, true));
            } else {
              const storeIndex = labels.findIndex(
                (store) => store === valueHandler(el.label, true)
              );
              labels.splice(storeIndex, 1);
            }
            const countStoreRefined = items.filter(el => el.isRefined === true);
            if(countStoreRefined.length === visibleShops.length) {
              const values = items.filter(elem => 
                elem.label === el.value && elem.isRefined 
              );
              const labels = values.map(e => e.label);
              dispatch(setCurrentStores(labels))
              refine(labels);
              return;
            }
            const found = items.find((val) => val.label === el.value);

            if (found) {
              // console.log(
              //   generateSearchUrl("store", labels),
              //   labels,
              //   "generateSearchsUrl("
              // );
              // history.push({ search: generateSearchUrl("store", labels) });
             
              if(!currentStores.includes(found.label)) {
                if(currentStores.length === storeElements.length - 1) {
                  dispatch(setCurrentStores([]));
                }
                else {
                  dispatch(setCurrentStores([...currentStores, found.label]))
                }
              }
              else {
                const arr = [...currentStores];
                const removedIndex = currentStores.findIndex(el => el === found.label);
                arr.splice(removedIndex,1);
                dispatch(setCurrentStores(arr))
              }
              refine(found.value);
              // console.log(  generateSearchUrl("store", labels), "buff Url url url ");
              // history.push(buffUrl.toLowerCase(), {
              //   //    storeCats: { store: val },
              // });
            }
            else 
              if(!currentStores.includes(el.value)) {
                if(currentStores.length === storeElements.length - 1) {
                  dispatch(setCurrentStores([]));
                }
                else {
                  dispatch(setCurrentStores([...currentStores, el.value]))
                }
              }
              else {
                const arr = [...currentStores];
                const removedIndex = currentStores.findIndex(el => el === el.value);
                arr.splice(removedIndex,1);
                dispatch(setCurrentStores(arr))
              }            
          }}
        />
      ))}
    </div>
  );
};
export default connectRefinementList(StoresRefinementList);
