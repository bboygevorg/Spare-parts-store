import React from "react"
import {connectMenu} from 'react-instantsearch-dom';
import classes from "./categoriesWithStores.css"
import Arrow from "icons/Arrow";
import categories from "store/categories.json"
import {Link, useHistory} from "react-router-dom";
import {firstUpperCase} from "helper/utils";
import {refineStore} from "actions/categories";
import {useDispatch, useSelector} from "react-redux";
import Typo from "components/UI/Typo";
import {valueHandler} from "components/Algolia/ProductCategories/wrapper";
import {storeUrl} from "components/Algolia/Menu/menu";
import useVisibleShops from 'talons/useVisibleShops';
import { setCurrentStores } from "actions/categories";
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link';
import TopCategoriesWithSubs from "algolia/TopCategoriesWithSubs";

const CategoriesWithStores = ({refine, top}) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const localeId = useSelector(state => state.language.currentLanguage);
    const { storeElements } = useVisibleShops();
    const __ = useTranslation();
    return (
      <div className={classes.menuSelect}>
        <div className={classes.menuSelectHeader}>
          <Typo font={"bold"} className={classes.menuSelectHeaderTitle}>
           {__("By category")}
          </Typo>
          <span className={classes.headerIcon}>
            {" "}
            <Arrow />
          </span>
        </div>
        <div className={classes.menuSelectListWrapper}>
          {top ? 
            <TopCategoriesWithSubs/>
          : 
            <div className={classes.menuSelectList}>
              {storeElements.length ? storeElements.map((item) => { 
                if (!categories[item.value]) {
                  return ""
                }
                  return (
                    <div key={item.label} className={classes.menuSelectItem}>
                      {item.label}
                      <div className={classes.storeCats}>
                        {categories[item.value].slice(0, 2).map((el, index) => (
                          <Link
                            to={{
                              pathname: `${storeUrl(item)}/${valueHandler(
                                el.name,
                                true
                              )}`,
                              state: {
                                storeCats: {
                                  store: item.value,
                                  catValue: el.name,
                                },
                              },
                            }}
                            key={["categorylink", index].join("_")}
                            onClick={() => {
                              dispatch(refineStore(item));
                              dispatch(setCurrentStores([item.value]))
                              refine(item.value);
                            }}
                          >
                            {firstUpperCase(el.name)}
                          </Link>
                        ))}
                      </div>
                      <span
                        onClick={() => {
                          dispatch(refineStore(item));
                          dispatch(setCurrentStores([item.value]))
                          refine(item.value);
                          if(localeId === "default") {
                            history.replace(storeUrl(item));
                          }
                          else {
                            history.replace(`${storeUrl(item)}${codeSplitter(localeId)}`);
                          }
                        }}
                      >
                        {__("View more")}
                      </span>
                    </div>
                  ); }) 
                : null}
            </div>
          }
        </div>
      </div>
    );
};
export default connectMenu(CategoriesWithStores)
