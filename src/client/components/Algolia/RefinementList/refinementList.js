import React, { useEffect } from "react"
import {connectRefinementList} from 'react-instantsearch-dom';
import classes from "./refinementList.css"
import CheckBox from "components/CheckBox";
import { isTopCategoryPage } from "../ProductCategories/wrapper";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { actions } from 'actions/topCategories';
import isEmpty from "lodash/isEmpty";
import { numericSort } from "helper/utils";


const getLabel = (str) => {
    if(!str) {
        return "";
    }
    const splitted = str.split(".");
    const key = splitted.length && splitted[1];
    return key || ""
}
const RefinementList = ({
                            items,
                            refine,
                            attribute
                        }) =>{
                            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>", items, attribute)
    const filters = useSelector(state => state.topCategories.filters);
    const history = useHistory();
    const dispatch = useDispatch();
    const from = useSelector(state => state.topCategories.settingFilterFrom);

    useEffect(() => {
        if(from === "showcase" && isTopCategoryPage(history.location.pathname)) {
            const filter = filters.find(el => el.name === getLabel(attribute));
            if(!isEmpty(filter)) {
                if(filter.active) {
                    items.map(item => {
                        if(item.label.toUpperCase() === filter.value && !item.isRefined) {
                            refine(item.value);
                        }
                    })
                }
                else {
                    refine([]);
                }
            }
        }

    }, [filters, attribute, from])

    return (
        <div className={classes.productList}>
            {
                numericSort(items).map(el => <CheckBox
                    key={el.label}
                    label={el.label}
                    value={el.isRefined}
                    onChange={() => {
                        dispatch(actions.setFiltersFromList('list'));
                        console.log("vaaaaaaaaaaal >>>>", el.value)
                        if(isTopCategoryPage(history.location.pathname)) {
                            const index = filters.findIndex(el => el.name === getLabel(attribute));
                            if(index !== -1) {
                                const updated = [...filters];
                                updated[index] = {...updated[index], active: !updated[index].active}
                                dispatch(actions.setFilters(updated))
                            }
                        }
                        refine(el.value);
                    }}
                />)
            }
        </div>
    )
}
export default connectRefinementList(RefinementList)
