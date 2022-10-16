import React, { useState, useEffect } from "react";
import { connectMenu } from "react-instantsearch-dom";
import { useHistory } from "react-router-dom";
import Radio from "components/Radio";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { STORES, storesElements } from "conf/consts";
import { refineStore, setCurrentRefinements, setCurrentStores } from "actions/categories";
import { valueHandler } from "components/Algolia/ProductCategories/wrapper";
import get from "lodash/get";
import useVisibleShops from 'talons/useVisibleShops'
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link';
export const ALL_STORES_VALUE = "all stores";

export function storeUrl(item) {
  return `/categories/${valueHandler(
    item.value === ALL_STORES_VALUE
      ? item.value
      :  get(STORES.find((el) => el.vendorcode === item.value), "label", ALL_STORES_VALUE),
    true
  ).toLowerCase()}`;
}

const Menu = ({ refine, items, match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentStore = useSelector((state) => state.categories.currentStore);
  const localeId = useSelector(state => state.language.currentLanguage);
  const [value, setValue] = useState();
  const { storeElements } = useVisibleShops();
  const __ = useTranslation();
  const setValueFromUrl = () => {
    const storeLabel = match.params.store;
    if (storeLabel) {
      const store = storesElements.find(
        (el) => el.label.toLowerCase() === valueHandler(storeLabel)
      );
        refine(store.value);
        dispatch(refineStore(store));
        dispatch(setCurrentStores([store.value]))
 
      // console.log(store.value, "are you there ? ?  ? ?")
      setValue(store.value);
    }
  };
  useEffect(() => {
    setValueFromUrl();
  }, [JSON.stringify(match.params)]);

  // useEffect(() => {
  //     if (!isEmpty(items) && value && isEmpty(currentStore)) {
  //         if (
  //             isEmpty(subs) &&
  //             items.filter((el) => value === el.label)[0] &&
  //             !items.filter((el) => value === el.label)[0].isRefined
  //         ) {
  //             console.log("blallallalalal")
  //             setValue();
  //         }
  //     }
  // }, [subs]);

  // useEffect(() => {
  //          console.log(storeCats, "blaaaaaaaaaaaaaaaaaaalda,sld,l,")
  //
  //     // if (!storeCats.store && (isEmpty(currentStore) || currentStore)) {
  //     //     refine();
  //     //     setValue();
  //     // } else {
  //         refine(storeCats.store);
  //         setValue(storeCats.store);
  //     // }
  // }, [storeCats.store]);

  // useEffect(() => {
  //     const storeRefinement = currentRefinements.find(
  //         (el) => el.attribute === "vendorcode"
  //     );
  //     if (storeRefinement) {
  //         const storeElement = storesElements.find(
  //             (el) => el.label === storeRefinement.currentRefinement
  //         );
  //         if (storeElement) {
  //             setValue(storeElement.value);
  //         }
  //     } else {
  //         console.log("bla 1 ")
  //
  //         setValue();
  //     }
  // }, [currentRefinements]);

  useEffect(() => {
    if (currentStore && !isEmpty(currentStore)) {
      refine(currentStore.value);
      setValue(currentStore.value);
    }
  }, [currentStore]);

  useEffect(() => {
    // console.log("working 1 ? ?  ? "); 
    // setValueFromUrl();
    return () => {
      //   if (history.location.pathname.indexOf("categories") === -1) {
      console.log("clear storessss ");
      refine("");
      dispatch(refineStore({}));
      dispatch(setCurrentRefinements([]));
      setValue("");
      //   }
    };
  }, []); 
  return (
    <div>
      <Radio
        elements={storeElements.map(elem => {return {...elem, label: __(elem.label) }})}
        value={value}
        name={"stores"}
        onChange={(val) => {
          if (value !== val) {
              refine(val);
              const store = items.find((el) => el.label === val);
            dispatch(refineStore(store));
            dispatch(setCurrentStores([val]))
            setValue(val);
            if(localeId === "default") {
              history.replace(storeUrl({ value: val }), {
                storeCats: { store: val },
              });
            }
            else {
              history.replace(`${storeUrl({ value: val })}${codeSplitter(localeId)}`, {
                storeCats: { store: val },
              });
            }
          }
        }}
      />
    </div>
  );
};

export default connectMenu(Menu);
