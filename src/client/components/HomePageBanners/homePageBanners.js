import React from 'react';
import defaultClasses from './homePageBanners.css';
import {mergeClasses} from 'helper/mergeClasses';
import config from "../../../config";
import Typo from "components/UI/Typo";

const HomePageBanners = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <div className={classes.bannerOne}>
                <img src={`${config.BASE_URL}images/delivery.png`} className={classes.imageBannerOne}/>
                <Typo variant={'h3'}>EXPRESS DELIVERY</Typo>
                <Typo variant={'p'} font={'regular'}>Building materials delivered in about an hour, starting at
                    $12</Typo>
            </div>
            <div className={classes.bannerTwo}>
                <img src={`${config.BASE_URL}images/items.png`} className={classes.imageBannerTwo}/>
                <Typo variant={'h3'}>1 MILLION ITEMS</Typo>
                <Typo variant={'p'} font={'regular'}>Select from over 1 million items and multiple suppliers,
                    with a single checkout</Typo>
            </div>
        </div>
    );
};

export default HomePageBanners;
