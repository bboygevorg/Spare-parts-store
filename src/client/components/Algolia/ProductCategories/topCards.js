import React, { useState, useEffect, useCallback, useMemo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import classes from "./topCards.css";
import { withRouter } from "react-router-dom";
import { algoliaIndex } from "conf/main";
import ProductCard from "components/ProductCard";
import HelpModal from "../ProductList/HelpModal/index";
import Modal from "components/Modal/modal";
import { actions } from 'actions/topCategories';
import Loading from "components/Loading";
import isEmpty from "lodash/isEmpty";
import Button from "components/Button";
import Typo from 'ui/Typo';
import useWindowDimensions from "talons/useWindowDimensions"; 
import config from "../../../../config";
import { getCategoryImagePath } from '../TopCategories/topCategories';
import orderBy from 'lodash/orderBy';
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";

const TopCards = ({ subCategories, onClick, isLarge} ) => {
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const hits = useSelector(state => state.topCategories.hits);
    const filters = useSelector(state => state.topCategories.filters);
    const currentRefinements = useSelector(state => state.categories.currentRefinements);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showMoreSubs, setShowMoreSubs] = useState(false);
    const { currentLanguageName } = useCurrentLanguage();

    const categoryTitle = useMemo(() => {
        if(currentRefinements && currentRefinements.length){
            let title = "";
            currentRefinements.map(ref => {
                if(ref.attribute.includes("categories")) {
                    const splitted = ref.label.split("|");
                    if(splitted.length !== 1) {
                        title  = splitted && splitted.length ? splitted[splitted.length - 1] : "";
                    }
                    else {
                        const spt = ref.label.split(":");
                        title = spt && spt.length ? spt[spt.length - 1] : "";
                    }
                }
            })
            return title;
        }
    }, [currentRefinements]);

    const subs = useMemo(() => {
        if(subCategories && subCategories.items && subCategories.items.length) {
            if(showMoreSubs) {
                return orderBy(subCategories.items, ["count"], ["desc"]);
            }
            else {
                return width > 784 ? orderBy(subCategories.items, ["count"], ["desc"]).slice(0, 6) : orderBy(subCategories.items, ["count"], ["desc"]).slice(0, 4);
            }
        }
        else {
            return [];
        }
    }, [showMoreSubs, JSON.stringify(subCategories), width]);

    const getHits = (cat) => {
        if (!cat.currentRefinement) {
            return false;
        }
        const splitedCat = cat.currentRefinement.split("|");
        const refinedFilters = getFilters();
        setLoading(true);
        algoliaIndex
            .search("", {
                attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`],
                facetFilters: [
                    `bc_categories.lvl${splitedCat.length - 1}: ${cat.currentRefinement}`,
                ],
                filters: `in_stock:true${refinedFilters ? ` AND ${refinedFilters}` : refinedFilters}`,
                facets: ["*"]
            })
            .then((res) => {
                if(res.facets && !isEmpty(res.facets)) {
                    dispatch(actions.setFacets(res.facets));
                }
                dispatch(actions.setHits(res.hits));
                setLoading(false);
            });
        setLoading(false);
    };
 

    const getFilters = useCallback(() => {
        if(!currentRefinements.length) {
            return "";
        }
        const refs = currentRefinements.filter(refinement => !refinement.attribute.includes("categories"));
        let val = "";
        refs.map((ref, i) => {
            const splittedAttribute = ref.attribute && ref.attribute.split(".");
            const label = splittedAttribute.length ? splittedAttribute[1] ? splittedAttribute[1] : splittedAttribute[0] : "";
            let values = "";
            if(ref.items && ref.items.length) {
                if(ref.items.length > 1) {
                    ref.items.map((item, index) => {
                        if(index === ref.items.length - 1) {
                            if(label === "brand") {
                                values = values + `${label}:"${item.label}"`;
                            }
                            else {
                                values = values + `features.${label}:"${item.label}"`;
                            }
                        }
                        else 
                        if(label === "brand") {
                            values = values + `${label}:"${item.label}"` + " OR ";
                        }
                        else {
                            values = values + `features.${label}:"${item.label}"` + " OR ";
                        }
                    });
                    values = `(${values})`
                }
                else 
                if(label === "brand") {
                    values = `${label}:"${ref.items[0].label}"`
                }
                else {
                    values = `features.${label}:"${ref.items[0].label}"`
                }
            }
            else 
            if(ref.currentRefinement && !isEmpty(ref.currentRefinement)){
                if(ref.currentRefinement.min || ref.currentRefinement.max) {
                    values = values + `${label} ${ref.currentRefinement.min ? `>= ${ref.currentRefinement.min}` : ""} ${ref.currentRefinement.max ? `AND ${label} <= ${ref.currentRefinement.max}` : ""}`;
                }
            }
            if(refs.length > 1) {
                if(i === refs.length - 1) {
                    val = val + values;
                }
                else {
                    val = val + values + " AND ";
                }
            }
            else {
                val = values;
            }
        })
        return val;
    }, [currentRefinements]);

    const getImageUrlByMode = useCallback((category, isDefault) => {
        if(width > 784) {
            return isDefault ? `${config.IMAGE_BASE_URL_DESKTOP}default-icon.png` : `${config.IMAGE_BASE_URL_DESKTOP}${getCategoryImagePath(category)}.png`;
        }
        else {
            return isDefault ? `${config.IMAGE_BASE_URL_MOBILE}default-icon.png` : `${config.IMAGE_BASE_URL_MOBILE}${getCategoryImagePath(category)}.png`;
        }
      }, [width, getCategoryImagePath, config]);
    
    useEffect(() => {
        if(currentRefinements && currentRefinements.length) {
            const category = currentRefinements.find(el => el.attribute.includes("bc_categories"));
            if(!isEmpty(category)) {
                getHits(category);
            }
        }
    }, [currentRefinements, filters]);

    if(loading || isEmpty(subCategories)) {
        return <div className={classes.loadingWrapper}>
            <Loading />
        </div>
    }

    return (
        <div>
            <div className={classes.list}>
                {subs && subs.length ?
                    subs.map(item => {
                        return (
                            <div 
                                key={item.label} 
                                className={classes.box}
                                onClick={event => {
                                    event.preventDefault();
                                    onClick(item);
                                }}
                            >
                                <img
                                    id={`icon_${item.label}`}
                                    onError={() => document.getElementById(`icon_${item.label}`).src = getImageUrlByMode(item.value, true)}
                                    src={getImageUrlByMode(item.value)}
                                />
                                <Typo as="p" variant="p" font="bold" className={classes.subLink}>{item.label}</Typo>
                            </div>
                        )
                    }) 
                : 
                    null
                }
            </div>
           {subCategories && subCategories.items && ((width > 784 && subCategories.items.length > 6) || (width <= 784 && subCategories.items.length > 4)) ?
                <div className={classes.showSubs}>
                    <Button
                        type="bordered"
                        label={showMoreSubs ?  "See less" : "See more"}
                        onClick={() => setShowMoreSubs(!showMoreSubs)}
                        classes={{button_bordered: classes.seeButton, button_label: classes.buttonLabel}}
                    />
                </div>
            :
                null
            }
            {categoryTitle ? <Typo as="h1" variant="h2" className={classes.categoryTitle}>{categoryTitle}</Typo> : null}
            {subs.length && hits && hits.length ?
                <div className={isLarge ? classes.productListLarge : classes.productList}>
                    {hits.map((hit, index) => 
                        <ProductCard 
                            key={index} 
                            product={hit} 
                            large={isLarge} 
                            onClickHelpButton={() => setIsOpen(true)}
                        />
                    )}
                </div>
            : 
                null
            }
            {hits && !hits.length ? <span>No products found</span> : null}
            <Modal
                isShown={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                className={classes.dialog}
            >
                <HelpModal />
            </Modal>
        </div> 
    )
};

export default connect((state) => ({
  subCategories: state.categories.sub,
}))(withRouter(TopCards));