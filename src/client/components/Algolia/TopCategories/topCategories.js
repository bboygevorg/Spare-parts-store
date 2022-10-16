import React, { useCallback } from "react";
import classes from "./topCategories.css";
import Link from "components/Link";
import config from "../../../../config";
import Typo from "components/UI/Typo";
import { useSelector } from 'react-redux';
import useWindowDimensions from "talons/useWindowDimensions"; 

export const getTopCategoryUrl = (value) => {
  if(!value) {
    return;
  }
  let replaced = value.split("|").join("/").replace(/ /g, "_");
  return `/topcategories/bc/${replaced}`;
}

export const getCategoryName = (value) => {
  if(!value) {
    return;
  }
  const splitted = value.split("|");
  const label = splitted && splitted.length ? splitted[splitted.length - 1] : ""
  return label;
}

export const getCategoryImagePath = (value) => {
  if(!value) {
    return;
  }
  const imageUrlPath = value.split("|").join("-").replace(/ /g, "_");
  return encodeURIComponent(imageUrlPath);
}

const TopCategories = () => {
  const firebaseValues = useSelector(state => state.firebase.config)
  const topCategories = firebaseValues && JSON.parse(firebaseValues.top_categories);
  const { width } = useWindowDimensions();

  const getImageUrlByMode = useCallback((category, isDefault) => {
    if(width > 784) {
      return isDefault ? `${config.IMAGE_BASE_URL_DESKTOP}default-icon.png` : `${config.IMAGE_BASE_URL_DESKTOP}${getCategoryImagePath(category)}.png`;
    }
    else {
      return isDefault ? `${config.IMAGE_BASE_URL_MOBILE}default-icon.png` : `${config.IMAGE_BASE_URL_MOBILE}${getCategoryImagePath(category)}.png`;
    }
  }, [width, getCategoryImagePath, config]);

  return (
    <div className={classes.topCategories}>
      {topCategories && topCategories.length ?
        topCategories.map((category, index) => (
          <Link key={index} to={getTopCategoryUrl(category)}>
            <div className={classes.cardItem}>
              <img
                id={`icon_${index}`}
                onError={() => document.getElementById(`icon_${index}`).src = getImageUrlByMode(category, true)}
                src={getImageUrlByMode(category)}
              />
              <Typo as="p" variant="p" font="bold" className={classes.cardTitle}>
                {getCategoryName(category)} 
              </Typo>
            </div>
          </Link>
      ))
      : null}
    </div>
  );
};
export default TopCategories;
