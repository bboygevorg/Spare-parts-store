import React, {useEffect} from "react";
import propTypes from "prop-types";
import {withRouter, useHistory} from "react-router-dom";
import trim from "helper/trim";
import {connect} from "react-redux";
// import {searchClient} from "config/main";
// import {InstantSearch} from 'react-instantsearch-dom';
import  Wrapper, { isSearchPage, isTopCategoryPage } from "components/Algolia/ProductCategories/wrapper";
// import Wrapper from "./Wrapper";
import get from "lodash/get";
import AppWrapper from "components/UI/AppWrapper";
import CurrentNavigation from "components/Navigation";
import {storeUrl} from "components/Algolia/Menu/menu";
import useWindowDimensions from "talons/useWindowDimensions";
import { MOBILE_SIZE } from "conf/consts";
import { useDispatch } from 'react-redux';
import { actions } from 'actions/topCategories';

const Categories = (props) => {
    const topCategoriesValue = get(props, "location.state.value", {});
    const storeCats = get(props, "location.state.storeCats", {});
    const history = useHistory();
    const {width} = useWindowDimensions();
    const dispatch = useDispatch();

    useEffect(() => { 
        const pathName  = history.location.pathname
        if(pathName === '/categories' || pathName === '/categories/') {
            history.replace(storeUrl({value: "0"}), {storeCats: {store: "0"}})
        }
    }, [ ])

    useEffect(() => {
      return () => {
          dispatch(actions.setFilters([]));
          dispatch(actions.setHits([]));
          dispatch(actions.setFiltersFromList(""));
          dispatch(actions.setFacets({}));
      }
    },[]);

    return (
      // <InstantSearch
      //     searchClient={searchClient}
      //     indexName={"prod_build_club_products"}
      // >
      <AppWrapper>
        {width > MOBILE_SIZE && !isSearchPage(window.location.pathname) && <CurrentNavigation />}
        {/* <Wrapper /> */}
        <Wrapper
          match={props.match}
          limit={10000}
          separator={"|"}
          //  showParentLevel
          topCategoriesValue={topCategoriesValue}
          storeCats={storeCats}
          attributes={
            !isTopCategoryPage(history.location.pathname) ?
              [
                "categories.lvl0",
                "categories.lvl1",
                "categories.lvl2",
                // "categories.lvl3",
                // "categories.lvl4",
              ]
            :
              [
                'bc_categories.lvl0',
                'bc_categories.lvl1',
                'bc_categories.lvl2',
                'bc_categories.lvl3',
                'bc_categories.lvl4'
              ]
            }
        />
      </AppWrapper>
      // </InstantSearch>
    );
};

export const loadData = (store, req) => {
    const slug = trim(req.path, "/");
    console.log("slug", slug);
};

Categories.propTypes = {
    dispatch: propTypes.func.isRequired,
    stores: propTypes.array,
    categories: propTypes.object,
    subCategories: propTypes.object,
};

Categories.defaultProps = {
    stores: [],
    categores: {},
    subCategories: {},
};

export default connect((state) => ({
  categories: state.categories.data,
  isFetchingCategories: state.categories.isFetching,
  subCategories: state.categories.sub,
  stores: state.stores.data,
  isFetchingStores: state.stores.isFetching,
  customerToken: state.signin.customerData.customerToken,
  searchRefinement: state.categories.searchRefinement,
}))(withRouter(Categories));