import React from "react"
import { connectStateResults } from 'react-instantsearch-dom';

const StateResults = ({ allSearchResults}) =>  {
    // const Component = children; 
      // allSearchResults._rawResults[0].facets
      console.log(
        allSearchResults,
        "allSearchResultsallSearchResultsallSearchResults"
      );
    return <div></div>
    //   return  React.cloneElement(children, { allSearchResults })
}

export default connectStateResults(StateResults);
