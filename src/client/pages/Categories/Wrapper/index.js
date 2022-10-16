import React from "react";
import FiltersList from "components/Algolia/ProductCategories/FiltersList"
import { useRouteMatch } from "react-router-dom";
import { connectHierarchicalMenu, Configure } from "react-instantsearch-dom";


const Hierachical = connectHierarchicalMenu(() => { 
    return <div>
        hierarchical compoentn 
    </div>
}); 

const Wrapper = () => {
    const match = useRouteMatch();
    return (
      <div>
        <Configure hitsPerPage={12} facets={["*"]} filters="in_stock:true" clickAnalytics enablePersonalization={true}/>
        <FiltersList match={match} />

        <Hierachical attributes={["categories.lvl0"]} limit={10000} />
      </div>
    );
}

export default Wrapper;