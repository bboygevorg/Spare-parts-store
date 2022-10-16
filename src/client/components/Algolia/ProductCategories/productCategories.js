import React, {  useState } from "react";
import classes from "./productCategories.css";
// import isEmpty from "lodash/isEmpty";
// import omit from "lodash/omit";
import get from "lodash/get";
import isArray from "lodash/isArray";
import { connect, useSelector } from "react-redux";
import { isTopCategoryPage, valueHandler } from "./wrapper";
import { useHistory, useRouteMatch } from "react-router-dom";
import { STORES } from "conf/consts";
import Typo from "components/UI/Typo";
import { codeSplitter } from 'components/Link/link';
const splitCat = (str) => str.split("|");
import Loading from "components/Loading";
const makeUrlFromHierarchicalCategory = (val) => {
  // const splitedCategories = splitCat(val);
  // const buffParamValues = Object.values(omit(params, ["store"]));
  // const hasCat = buffParamValues.findIndex((el) =>
  //   splitedCategories.includes(el)
  // );

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

const ProductCategories = (props) => {
  const { items, isSearching } = props;
  const currentRefinements = useSelector(
    (state) => state.categories.currentRefinements
  );
  const localeId = useSelector(state => state.language.currentLanguage);
  // const [subs, setSubs] = useState({});
  const match = useRouteMatch();
  const history = useHistory();
  const [showMore, setShowMore] = useState(false);
  // let categories = [];
  // if (subCategories.items) {
  //     categories = subCategories.items
  // } else if (items && isEmpty(subCategories)) {
  //     categories = items
  // }
  // console.log(items, "asdfasfd lsk lkasd kfsa");
  // const subs = items

  // function findSubHandler() {
  //   const found = items.find((el) => el.isRefined);
  //   if (found) {
  //     setSubs(found);
  //   }
  // }
  // useEffect(() => {
  //   findSubHandler();
  // }, [items]);
  const onClickHandler = (label) => { 
    window.scrollTo(0, 0);
    const storeRef = currentRefinements.find(
      (el) => el.attribute === "vendorcode"
    );
    const store = STORES.find(
      (el) => el.label === get(storeRef, "currentRefinement", "")
    );
    const params = { storeCats: { store: store ? store.vendorcode : "" } };
    if(localeId === "default") {
      console.log('match', match)
      if(isTopCategoryPage(match.url)) {
        history.replace(
          `/topcategories/bc/${makeUrlFromHierarchicalCategory(
            label,
            match.params
          )}`,
          params
        );
      }
      else {
        history.replace(
          `/categories/${match.params.store}/${makeUrlFromHierarchicalCategory(
            label,
            match.params
          )}`,
          params
        );
      }
    }
    else 
    if(isTopCategoryPage(match.url)) {
      history.replace(
        `/topcategories/bc/${makeUrlFromHierarchicalCategory(
          label,
          match.params
        )}${codeSplitter(localeId)}`,
        params
      );
    } 
    else {
      history.replace(
        `/categories/${match.params.store}/${makeUrlFromHierarchicalCategory(
          label,
          match.params
        )}${codeSplitter(localeId)}`,
        params
      );
    }
  };
  // const renderSubs = ()
  const numberOfItems = showMore ? items.length : 10;
  function findIsRefined(arr) {
    const buffArr = arr || [];
    const found = buffArr.find((el) => el.isRefined);
    // const index = '';
    // if(!found) {
    if (!found) {
      return buffArr;
    }

    return {
      cat: buffArr,
      sub: findIsRefined(found.items),
    };
    // }
  }
  const categories = findIsRefined(items);
  // console.log(categories)
  const isSubArray = isArray(categories.sub);
  const main = isArray(categories)
    ? categories
    : isSubArray
    ? categories.cat
    : get(categories, "sub.cat", []);
  const sub = findDeepByKey(categories, "sub"); 

  function findDeepByKey(obj, key) {
    // eslint-disable-next-line no-prototype-builtins
    if (isArray(obj) || !obj.hasOwnProperty(key)) {
      return obj;
    }
    return findDeepByKey(obj[key], key);
  }
 
  if (isSearching) {
    return (
      <div style={{position: "relative", padding: 30, boxSizing: "border-box"}}>
        <Loading />
      </div>
    );
  }

    return (
      <div className={classes.productCategories}>
        <div>
          <div>
            {main.slice(0, numberOfItems).map((item, index) => {
              const ref = currentRefinements.find(
                (el) => el.attribute === "categories.lvl0" || el.attribute === "bc_categories.lvl0"
              );
              const curr = ref ? ref.currentRefinement.split("|") : [];
              // const idx = curr.length > 1 ? 2 : 1;
              const currValue = curr[curr.length - 1];
              return (
                <div
                  key={[index, item.value].join("_")}
                  className={classes.listItem}
                >
                  <Typo
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      //   onClick(item);
                      onClickHandler(item.value || item.label);
                    }}
                  >
                    {item.label}
                  </Typo>

                  <div style={{ marginLeft: 10, marginTop: 10 }}>
                    {/* {subs && item.label === currValue && ( */}
                    {/* // <ProductCategories */}
                    {/* //   items={subs.items}
                    //   // onClick={() => onClickHandler()}
                    // /> */}
                    {item.label === currValue && (
                      <div>
                        {sub.map((el, indx) => {
                          return (
                            <Typo
                              onClick={() =>
                                onClickHandler(el.value || el.label)
                              }
                              key={indx}
                              font="regular"
                            >
                              {el.label}
                            </Typo>
                          );
                        })}
                      </div>
                    )}

                    {/* )} */}
                  </div>
                  {/* {items.items } */}
                </div>
              );
            })}
          </div>
          {main.length > 10 ? (
            <div
              className={classes.viewMore}
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              {showMore ? "View less" : "View more"}
            </div>
          ) : null}
        </div>
      </div>
    );
};

export default connect()(ProductCategories);
