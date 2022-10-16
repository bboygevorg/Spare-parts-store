import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './popularFilters.css';
import { actions } from 'actions/topCategories';
import { handleFacetTitle } from '../DynamicFacets';
import Typo  from 'ui/Typo/';
import useTranslation from 'talons/useTranslation';
import config from "../../../../config";
import useWindowDimensions from "talons/useWindowDimensions"; 


const PopularFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.topCategories.filters);
    const __ = useTranslation();
    const { width } = useWindowDimensions();

    const defaultImgUrlByMode = useMemo(() => {
        if(width > 784) {
            return `${config.IMAGE_BASE_URL_DESKTOP}default-icon.png`;
        }
        else {
            return `${config.IMAGE_BASE_URL_MOBILE}default-icon.png` ;
        }
    }, [width, config]);

    const setFilters = (facet) => {
        if(filters.length) {
           const index =  filters.findIndex(el => el.name === facet.name);
           if(index !== -1) {
               const updatedArr = [...filters];
               updatedArr[index] = {...updatedArr[index], active: !updatedArr[index].active}
               dispatch(actions.setFilters(updatedArr))
           }
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typo as="h2" variant="h2">{__("Popular Filters")}</Typo>
            </div>
            <div className={classes.list}>
                {filters.length ? filters.map((facet, index) => {
                    return (
                        <div key={index} className={`${classes.box} ${facet.active ? classes.selected : null}`} onClick={() => { dispatch(actions.setFiltersFromList('showcase')); setFilters(facet)}}>
                            <img
                                id={`icon_${index}`}
                                onError={() => document.getElementById(`icon_${index}`).src = defaultImgUrlByMode}
                                src={facet.imageURL}
                            />
                            <span className={classes.subLink}>{handleFacetTitle(facet.name)}</span>
                        </div>
                    )
                }) : null}
            </div>
        </div>
    )
}

export default PopularFilters;