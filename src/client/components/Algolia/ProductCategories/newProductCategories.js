import React, { useEffect, useState, useRef, useMemo } from "react";
// import stateResults from "../SearchResult"
import { connectStateResults } from "react-instantsearch-dom";
import get from "lodash/get";
import pickBy from "lodash/pickBy";
import omit from "lodash/omit";
import isArray from "lodash/isArray";
import { useSelector } from "react-redux";
import Typo from "ui/Typo";
import { STORES } from "conf/consts";
import { valueHandler } from "./wrapper";
import { useHistory, useRouteMatch } from "react-router-dom";

const CATEGORY_ATTRIBUTE = "categories.lvl0";
const LVL_TITLE = "categories.lvl";
export const findCategories = (obj) =>
  pickBy(obj, (val, key) => key.indexOf("categories") > -1);
// console.log(Object.keys(obj).map(key => key.indexOf('categories') > -1 ))

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const handleNestedCategories = (cat, sub, prevCats, isLast) => {
  // console.log(cat, sub, "cat and sub toghether");
  // console.log(prevCats, "my prev categories")
  // if (!cat && !sub) {
  //   return prevCats;
  // }
  // if(!sub ) {

  //   return cat;
  // }
  const obj = {};

  Object.keys(cat).forEach((key) => {
    //   const pickedByKey = pickBy(sub, (v, k) => k.indexOf(key) > -1)
    const pickedByKey = [];
    if (sub) {
      Object.keys(sub).forEach((k) => {
        if (k.indexOf(key) > -1) {
          const buffSplited = splitCat(k);
          pickedByKey.push({
            label: buffSplited[buffSplited.length - 1],
            id: k,
          });
        }
      });
    }
    obj[key] = pickedByKey;
  });
  return obj;
};

const makeUrlFromHierarchicalCategory = (val, params) => {
  const splitedCategories = splitCat(val);
  const buffParamValues = Object.values(omit(params, ["store"]));
  const hasCat = buffParamValues.findIndex((el) =>
    splitedCategories.includes(el)
  );

  let finalUrl = splitCat(val)
    .map((el) => valueHandler(el, true))
    .join("/");
  // console.log(splitedCategories, hasCat);

  // if (hasCat > -1) {
  //   // console.log(
  //   //   "working  ??   ? ?",

  //   //   // splitedCategories[hasCat],
  //   //   // finalUrl.replace(`${buffParamValues[hasCat]}/`, "")
  //   // );
  //   finalUrl = finalUrl.replace(`${buffParamValues.join("/")}/`, "");
  // }

  // console.log(finalUrl, "hell oworlld l sfjksd fslj fsjlfjs");
  // console.log(finalUrl, "final url final url final url")
  return finalUrl;
};

const splitCat = (str) => str.split("|");
const NewProductCategories = ({ searching, allSearchResults }) => {
  // const [cats, setCats] = useState({});
  const currentRefinements = useSelector(
    (state) => state.categories.currentRefinements
  );
  const currentCategory = useSelector(
    (state) => state.categories.currentRefinements
  ).find(({ attribute }) => attribute === CATEGORY_ATTRIBUTE);
  const facets = get(allSearchResults, "_rawResults[0].facets", {});
  const history = useHistory();
  const match = useRouteMatch();
  const CURRENT_CAT_LVL = currentCategory
    ? splitCat(currentCategory.currentRefinement).length
    : 0;
  //   const memoizeFacets = useMemo(() => facets, [facets])
  // console.log(currentCategory, CURRENT_CAT_LVL);
  const onClickHandler = (label) => {
    window.scrollTo(0, 0);
    const storeRef = currentRefinements.find(
      (el) => el.attribute === "vendorcode"
    );
    const store = STORES.find(
      (el) => el.label === get(storeRef, "currentRefinement", "")
    );
    const params = { storeCats: { store: store ? store.vendorcode : "" } };

    

    history.replace(
      `/categories/${match.params.store}/${makeUrlFromHierarchicalCategory(
        label,
        match.params
      )}`,
      params
    ); 
  };
  const cats = useMemo(bla, [facets, prevCats]);
  const prevCats = usePrevious(cats);
  function isLast() {
    const keysArray = Object.keys(
      facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`] || {}
    );

    return keysArray.every((e) => {
      return (
        e.indexOf(currentCategory ? currentCategory.currentRefinement : "") > -1
      );
    });
  }
  function bla() {
    //     console.log(
    //  facets,
    //       "why are you cxing ??? ?"
    //     );
    // if (
    //   JSON.stringify(facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`]) !==
    //     JSON.stringify(facets[`${LVL_TITLE}1`]) &&
    //   CURRENT_CAT_LVL > 1
    // ) {
    //   return false;
    // }
    // if (facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`] !== undefined) {
    // console.log("holalalalalala l");

    if (!isLast()) {
      return facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`];
    }
    //  else {
    // return handleNestedCategories(
    //   facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`],
    //   facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`],
    //   prevCats,
    //   isLast()
    // );
    // }
    //  console.log(prevCats, "asdsadasdad as <<<<< < < < < << << << < < < < < <")
    // console.log(
    //   facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`],
    //   "facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`]"
    // );

    // console.log(
    //   facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`],
    //   facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`],
    //   "hamarya"
    // );

    if (!facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`]) {
      return facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`];
    } else if (
      facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`] &&
      !Object.keys(facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`]).every(
        (e) =>
          e.indexOf(currentCategory ? currentCategory.currentRefinement : "") >
          -1
      )
    ) {
      // console.log("pti vor mtni esi ", prevCats);
      return prevCats;
    } else {
      return handleNestedCategories(
        facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`],
        facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`],
        prevCats,
        isLast()
      );
    }
    // // if (
    // //   !facets[`${LVL_TITLE}${CURRENT_CAT_LVL}`] &&
    // //   !facets[`${LVL_TITLE}${CURRENT_CAT_LVL + 1}`]
    // // ) {
    // //   return false;
    // // }

    // console.log("worked but i don;t know why")
  }
  useEffect(() => {
    // console.log(findCategories(facets), currentCategory, CURRENT_CAT_LVL);

    // }
    bla();
  }, [JSON.stringify(facets)]);
  useEffect(() => {
    bla();
  }, []);

  const renderCategoriesHandler = () => {
    return (
      <div>
        {Object.keys(cats).map((key, catsIdx) => {
          const vals = !isArray(cats[key]) ? [] : cats[key];

          const splitedKey = splitCat(key);
          const title = splitedKey[splitedKey.length - 1];
          return (
            <div key={catsIdx}>
              <Typo
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClickHandler(key);
                }}
              >
                {title}
              </Typo>
              <div>
                {vals.map((el) => (
                  <Typo
                    font="regular"
                    key={el.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClickHandler(el.id);
                    }}
                  >
                    {el.label}
                  </Typo>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  // console.log(prevCats);

  if (searching || !cats) {
    return <div>loading ....</div>;
  }
  console.log(facets , "all search resul sl slsl sl ls ls")
  return (
    <div>
      {" "}
      {/* <Configure
        // hitsPerPage={12}
        facets={[
          `categories.lvl${CURRENT_CAT_LVL + 1}`,
          // `categories.lvl${CURRENT_CAT_LVL + 2}`,
        ]}
        // filters="in_stock:true"
        // responseFields={["hits", "facets"]}
      /> */}
      {renderCategoriesHandler()}
    </div>
  );
};

export default connectStateResults(NewProductCategories);
