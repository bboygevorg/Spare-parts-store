import React from "react";
import classes from "./shops.css";
// import { STORES } from "config/consts"; 
import ShopCard from "components/ProductCarousel/ShopCard";
import useShops from "talons/useShops";
const ShopsWrapper = () => {
const {shops } = useShops();  
return <div className={classes.shopsWrapper}>{
        shops.map((el, index) => (
            <ShopCard  item={el} key={index}/>
        ))
    }</div>
}

export default ShopsWrapper;