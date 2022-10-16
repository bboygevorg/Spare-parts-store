import React from "react";
import {
  connectStateResults
} from "react-instantsearch-dom";
import get from "lodash/get";
import omit from "lodash/omit";
import Accordion from "components/Accordion";
import RefinementList from "algolia/RefinementList";
import { useSelector } from "react-redux"; 
import { firstUpperCase } from "helper/utils";
import orderBy  from 'lodash/orderBy';
import classes from './dynamicFacets.css';
import { isTopCategoryPage } from "../ProductCategories/wrapper";
import { useHistory } from "react-router-dom";

const OMIT_KEYS = [
  "categories.lvl0",
  "categories.lvl1",
  "categories.lvl2",
  "categories.lvl3",
  "categories.lvl4",
  "categories.lvl5",
  "categories.lvl6",
  "categories.lvl7",
  "vendorcode",
  "bc_categories.lvl0",
  "bc_categories.lvl1",
  "bc_categories.lvl2",
  "bc_categories.lvl3",
  "bc_categories.lvl4"
];

export const handleFacetTitle = (str) => {
    return firstUpperCase(str.split(".").pop().split("_").join(" "));
}

const DynamicFacets = (props) => {
  const history = useHistory();
  const currentRefinements = useSelector(state => state.categories.currentRefinements);
  const resFacets = props.facets ? props.facets : get(props, "searchResults._rawResults[0].facets", "");
  if (!resFacets && !props.searching) {
    return "";
  } 
  const withoutFixedFacets = omit(resFacets, OMIT_KEYS);
  const facets = Object.keys(withoutFixedFacets)
  .filter(
    (key) => { 
      return (
        Object.keys(withoutFixedFacets[key]).length > 1 ||
        (Object.keys(withoutFixedFacets[key]).length === 1 &&
          currentRefinements.filter((el) => el.attribute === key)).length ||
            isTopCategoryPage(history.location.pathname)
      );
    }
  );
  const facetsByOrder = orderBy(facets);

  return (
    <div
      className={classes.root}
    >
      {facetsByOrder.map((facet) => (
        <Accordion
          key={facet}
          title={handleFacetTitle(facet)}
          defaultStatus={false}
          component={() => (
            <div>
              <RefinementList attribute={facet} />
            </div>
          )}
        />
      ))}
    </div>
  );
};

export default connectStateResults(DynamicFacets);
