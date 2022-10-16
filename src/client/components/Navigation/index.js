import React from "react";
import classes from "./navigation.css";
import { useHistory } from "react-router-dom";
import { valueHandler } from "components/Algolia/ProductCategories/wrapper";
import Typo from "components/UI/Typo";
import { firstUpperCase } from "helper/utils";
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link';
// const makeLink = (link) => {
//     return {
//         '': {
//             title: "Home",
//             path: link
//         },
//
//     }
// }
const CurrentNavigation = ({url}) => {
  const history = useHistory();
  const localeId = useSelector(state => state.language.currentLanguage);
  const splited = url ? url.split('/') : history.location.pathname.split("/");
  const length = splited.length
  if(!url && splited[length - 1] === "") {
    splited.pop();
  }
  return (
    <div className={classes.root}>
      {splited.map((l, index) => {
        // if(subPath === ) {
        //
        // }
        if (l === "categories" || l === "topcategories" || l === "bc" || (splited.includes("topcategories") && splited.includes("building_supplies") && l === "building_supplies")) {
          return;
        }
        return (
          <div
            className={`${classes.navItem} ${
              index === splited.length - 1 ? classes.active : ""
            }`}
            key={["link", index].join("_")}
            onClick={() => { 
              if(index === splited.length - 1) {
                return false
              }
              if (splited.find((el) => el === "categories" || el === "topcategories")) {
                if (l === "") {
                  localeId === "default" ? history.replace("") : history.replace(codeSplitter(localeId));
                } else {
                  // const splited = history.location.pathname.split("/");
                  const index = splited.findIndex((it) => it === l);
                  history.replace(splited.slice(0, index + 1).join("/"));
                  // history.replace(`/categories/${l}`)
                }
              }
            }}
          >
            <Typo
              variant="pxs"
              font="regular"
              className={`${classes.title} ${
                index === splited.length - 1 && classes.activeTitle
              }`}
            >
              {l === "" ? "Home" : firstUpperCase(valueHandler(l))}{" "}
              {/* {index !== splited.length - 1 && "/"} */}
            </Typo>
          </div>
        );
      })}
    </div>
  );
};

export default CurrentNavigation;
