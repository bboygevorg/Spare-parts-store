import React, { useState, useEffect } from "react";
import classes from "./menuSelect.css";
import Arrow from "icons/Arrow";
import { useDispatch, useSelector } from "react-redux";
import Typo from "components/UI/Typo";
import { ALL_STORES_VALUE } from "components/Algolia/Menu/menu";
import useVisibleShops from 'talons/useVisibleShops';
import { setCurrentStores } from "actions/categories";
import useTranslation from 'talons/useTranslation';

const MenuSelect = () => {
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const { storeElements } = useVisibleShops();
  const __ = useTranslation();
  const currentStores = useSelector(state => state.categories.currentStores);
  useEffect(() => {
    if(storeElements.length) {
      const arr = [
        { label: "All Stores", value: ALL_STORES_VALUE },
        ...storeElements
        ];
      setStores(arr);
    }
  }, [storeElements])

  const isSelectedStore = (item) => {
    let selected;
    if(item.label === "All Stores" && (!currentStores.length)) {
      return true;
    }
    else {
      selected = (currentStores.includes(item.value) && currentStores.length !== storeElements.length)
    }
    return selected;
  }
  return (
    <div className={classes.menuSelect}>
      <div className={classes.menuSelectHeader}>
        <Typo font={"bold"}>{__("SHOP BY STORE")}</Typo>
        <span className={classes.headerIcon}>
          {" "}
          <Arrow />
        </span>
      </div>
      <div className={classes.menuSelectList}>
        {stores.length ? stores.map((item) => {
          const selected = isSelectedStore(item);
          return <div
            key={item.label}
            className={selected ? classes.menuSelectedItem : classes.menuSelectItem}
            onClick={() => {
              if (item.value !== ALL_STORES_VALUE) { 
                if(!currentStores.includes(item.value)) {
                  if(currentStores.length === storeElements.length - 1) {
                    dispatch(setCurrentStores([]));
                  }
                  else {
                    dispatch(setCurrentStores([...currentStores, item.value]))
                  }
                }
                else {
                  const arr = [...currentStores];
                  const removedIndex = currentStores.findIndex(el => el === item.value);
                  arr.splice(removedIndex,1);
                  dispatch(setCurrentStores(arr))
                }
              }
              else 
              if(currentStores.length){
                dispatch(setCurrentStores([]))
              }
            }}
          >
            <span>{__(item.label)}</span>
            {selected && <span className={classes.checkbox}></span>}
          </div>
        }) : null}
      </div>
    </div>
  );
};

export default MenuSelect;
