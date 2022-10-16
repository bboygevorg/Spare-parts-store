import React, { useEffect, useMemo } from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";
import { useHistory } from "react-router-dom";
import classes from "./currentRefinements.css";
import { CurrentRefinementItem } from "./currentRefinementsItem";
import { connect } from "react-redux";
import { setCurrentRefinements } from "actions/categories";
import uniqBy from "lodash/uniqBy";
import Close from "icons/Close";
import { isTopCategoryPage, valueHandler } from "components/Algolia/ProductCategories/wrapper";
import { ALL_STORES_VALUE } from "../Menu/menu";
import useVisibleShops from 'talons/useVisibleShops';

const CurrentRefinements = ({
  items,
  refine,
  dispatch,
  catRefine,
  match,
  searchRefinement,
}) => {
  const { visibleShops, searchable } = useVisibleShops();
  const elements = visibleShops.length && items.map((item) => {
    if (item.attribute === "vendorcode") {
      const storeRefinemenet = visibleShops.find(
        (el) => item.currentRefinement === el.vendorcode
      ); 
        const buffCurrentRefinement = searchRefinement ? item.currentRefinement :  storeRefinemenet
          ? storeRefinemenet.label
          : ALL_STORES_VALUE

      return {
        ...item,
        currentRefinement: buffCurrentRefinement,
      };
    } else {
      return item;
    }
  });
  const refinements = uniqBy(elements, "attribute");
  useEffect(() => {
    dispatch(setCurrentRefinements(refinements));
  }, [JSON.stringify(elements)]);

  // useEffect(() => {
  //   refinements
  //     .filter((el) => el.attribute !== "vendorcode")
  //     .forEach((el) => refine(el.value));
  // }, [JSON.stringify(currentStore)]);

  return (
    <div className={classes.currentRefinementsList}>
      {refinements.map((el, index) => {
        if(!el.attribute.includes("lvl")) {
          if (el.attribute === "categories.lvl0" || el.attribute === "bc_categories.lvl0") {
            return (
              <React.Fragment key={[index, "cats"].join("_")}>
                {Object.keys(match.params)
                  .slice(1)
                  .map((key) => {
                    const category = match.params[key];
                    if(isTopCategoryPage(match.path) && category === "building_supplies") {
                      return;
                    }
                    return (
                      <CurrentCategoryRefinementItem
                        key={[category, index, "cats"].join("_")}
                        // refine={refine}
                        el={{ title: category, cat: key }}
                      />
                    );
                  })}
              </React.Fragment>
            );
          } else {
            if(el.items && el.items.length === searchable.length && el.attribute === "vendorcode") {
              return null;
            }
            else {
              return el.items ? (
                <div
                  style={{ display: "flex", flexWrap: "wrap" }}
                  key={["wrapper", index].join("_")}
                >
                  {" "}
                  {el.items.map((nested, nestedIndex) => {
                    // console.log(el.items, "itemsss", el);
                    return (
                      // <div key={nestedIndex}>fdd</div>
                      <CurrentRefinementItem
                        key={["nested", nestedIndex].join("_")}
                        refine={refine}
                        el={{ ...el, ...nested }}
                        dispatch={dispatch}
                        catRefine={catRefine}
                        searchRefinement={searchRefinement}
                      />
                    );
                  })}
                </div>
              ) : (
                <CurrentRefinementItem
                  key={index}
                  refine={refine}
                  el={el}
                  dispatch={dispatch}
                  catRefine={catRefine}
                />
              );
            }
          }
        }
      })}
    </div>
  );
};

const CurrentCategoryRefinementItem = ({ el }) => {
  const history = useHistory();

  const isTopCategory = useMemo(() => {
    return el.cat.charAt(el.cat.length - 1) <= 2 ? true : false;
  }, [el]);

  return (
    <div className={classes.currentRefinementsItem}>
      {valueHandler(el.title)}
      {/*{el.attribute === "cost"*/}
      {/*    ? `${el.currentRefinement.min || ""}-${el.currentRefinement.max || ""}`*/}
      {/*    : el.attribute === "brand"*/}
      {/*        ? el.currentRefinement[0]*/}
      {/*        : el.currentRefinement.split("|")[*/}
      {/*        el.currentRefinement.split("|").length - 1*/}
      {/*            ]}*/}
      {isTopCategoryPage(history.location.pathname) && isTopCategory ?
        null
      :
        <div
          className={classes.closeIcon}
          onClick={() => {
            const splited = history.location.pathname.split("/");
            const index = splited.findIndex((it) => it === el.title);
            history.replace(splited.slice(0, index).join("/"));
          }}
        >
          <Close />
        </div>
      }
    </div>
  );
};
export default connect((state) => ({
  currentStore: state.categories.currentStore,
}))(connectCurrentRefinements(CurrentRefinements));
