import React from "react";
import classes from "algolia/CurrentRefinements/currentRefinements.css";
import Close from "icons/Close";
import isArray from "lodash/isArray";
import { STORES } from "conf/consts";
import { isSearchPage } from "../ProductCategories/wrapper";
import {refineStore} from "actions/categories";
import {useHistory} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStores } from "actions/categories";
import { codeSplitter } from 'components/Link/link';
import { firstUpperCase } from "helper/utils";


const refinementTitle = (el, searchRefinement) => {
  const { attribute, currentRefinement, label } = el;
  const cases = {
    [attribute]:
      !isArray(currentRefinement) && attribute !== "price"
        ? currentRefinement.split("|")[currentRefinement.split("|").length - 1]
        : "",
    array:
      attribute === "vendorcode" && searchRefinement
        ? STORES.find((store) => store.vendorcode === label).label
        : label,
    price: currentRefinement.min && currentRefinement.max ? `${currentRefinement.min} - ${currentRefinement.max}$` : !currentRefinement.min && currentRefinement.max ? `< ${currentRefinement.max}$` : currentRefinement.min && !currentRefinement.max ? `> ${currentRefinement.min}$` : "" ,
  };
  const attr = isArray(currentRefinement) ? "array" : attribute;
  if(typeof parseInt(cases[attr]) === 'number' && attribute.includes("vendorcode")) {
    const currentStore = STORES.find(store => store.vendorcode === cases[attr]);
    if(currentStore) {
      return currentStore.label;
    }
  }
  const splitted = attribute.split(".");
  const title = splitted.length && splitted.length > 1 ? splitted[1] : splitted[0];
  return `${firstUpperCase(title).replace(/_/g, " ")}: ${cases[attr]}`;
};
const CurrentRefinementItem = ({ refine, el, searchRefinement }) => {
  const history = useHistory(); 
  const dispatch = useDispatch();
  const currentStores = useSelector(state => state.categories.currentStores);
  const localeId = useSelector(state => state.language.currentLanguage);
  return (
    <div className={classes.currentRefinementsItem}>
      {/* {""}
        {el.attribute === "cost"
          ? `${
              (el.currentRefinement.min && `$${el.currentRefinement.min}`) || ""
            }-${
              (el.currentRefinement.max && `$${el.currentRefinement.max}`) || ""
            }`
          : el.attribute === "brand" || el.attribute === "features.texture"
          ? el.currentRefinement[0]
          : el.currentRefinement.split("|")[
              el.currentRefinement.split("|").length - 1
            ]} */}
      {refinementTitle(el, searchRefinement)}
      {(isSearchPage(window.location.pathname)  ||
        !searchRefinement) && (
        <div
          className={classes.closeIcon}
          onClick={() => {
            if(!searchRefinement && el.attribute === 'vendorcode') {
              dispatch(refineStore({}));
              if(localeId === "default") {
                history.replace("/")
              }
              else {
                history.replace(`${codeSplitter(localeId)}`)
              }
            }
            if (el.attribute === "categories.lvl0") {
              localStorage.setItem(
                "cat",
                el.currentRefinement.split("|")[
                  el.currentRefinement.split("|").length - 2
                ]
              );
              // catRefine(
              //   el.currentRefinement.split("|")[
              //     el.currentRefinement.split("|").length - 2
              //   ]
              // );
            }
            const arr = [...currentStores];
            const removedIndex = currentStores.findIndex(elem => elem === el.label);
            arr.splice(removedIndex,1);
            dispatch(setCurrentStores(arr))
            refine(el.value);
          }}
        >
          <Close />
        </div>
      )}
    </div>
  );
};

export { CurrentRefinementItem };
