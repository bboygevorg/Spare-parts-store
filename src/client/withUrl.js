import React, { useEffect, useState, useRef } from "react";
import qs from "qs";
import { useHistory, useLocation } from "react-router-dom";
import { isSearchPage } from "components/Algolia/ProductCategories/wrapper";

const updateAfter = 400;

const routeStateDefaultValues = {
  query: "",
  page: "0",
  vendorcode: "",
  brands: undefined,
  category: "",
  rating: "",
  price: "",
  free_shipping: "false",
  sortBy: "instant_search",
  hitsPerPage: "20",
};

// const encodedCategories = {
//   Cameras: "Cameras & Camcorders",
//   Cars: "Car Electronics & GPS",
//   Phones: "Cell Phones",
//   TV: "TV & Home Theater",
// };

// const decodedCategories = Object.keys(encodedCategories).reduce((acc, key) => {
//   const newKey = encodedCategories[key];
//   const newValue = key;

//   return {
//     ...acc,
//     [newKey]: newValue,
//   };
// }, {});

// Returns a slug from the category name.
// Spaces are replaced by "+" to make
// the URL easier to read and other
// characters are encoded.
// function getCategorySlug(name) {
//   const encodedName = decodedCategories[name] || name;

//   return encodedName
//     .replace(/ > /g, "/")
//     .split(" ")
//     .map(encodeURIComponent)
//     .join("+");
// }

// Returns a name from the category slug.
// The "+" are replaced by spaces and other
// characters are decoded.
// function getCategoryName(slug) {
//   const decodedSlug = encodedCategories[slug] || slug;

//   return decodedSlug
//     .split("+")
//     .map(decodeURIComponent)
//     .join(" ")
//     .replace(/\//g, " > ");
// }

const searchStateToURL = (searchState) => {
  const routeState = {
    query: searchState.query,
    page: String(searchState.page),
    brands: searchState.refinementList && searchState.refinementList.brand,
    vendorcode:
      searchState.refinementList && searchState.refinementList.vendorcode,
    // category:
    //   searchState.hierarchicalMenu &&
    //   searchState.hierarchicalMenu["hierarchicalCategories.lvl0"],
    // rating:
    //   searchState.range &&
    //   searchState.range.rating &&
    //   String(searchState.range.rating.min),
    // price:
    //   searchState.range &&
    //   searchState.range.price &&
    //   `${searchState.range.price.min || ""}:${
    //     searchState.range.price.max || ""
    //   }`,
    // free_shipping:
    //   (searchState.toggle && String(searchState.toggle.free_shipping)) ||
    //   undefined,
    // sortBy: searchState.sortBy,
    // hitsPerPage:
    //   (searchState.hitsPerPage && String(searchState.hitsPerPage)) || undefined,
  };

  // const { protocol, hostname, port = "" } = location;
  // const portWithPrefix = port === "" ? "" : `:${port}`;
  // const urlParts = location.href.match(/^(.*?)\/search/);
  // const baseUrl = `${protocol}//${hostname}${portWithPrefix}`;

  // const categoryPath = routeState.category
  //   ? `${getCategorySlug(routeState.category)}/`
  //   : "";
  const queryParameters = {};

  if (routeState.query && routeState.query !== routeStateDefaultValues.query) {
    queryParameters.query = encodeURIComponent(routeState.query);
  }
  if (routeState.page && routeState.page !== routeStateDefaultValues.page) {
    queryParameters.page = routeState.page;
  }
  // console.log(searchState, "searchState searchState")
  // Object.keys(searchState.refinementList).map(key => {
  //   const val = searchState.refinementList[key];
  //   queryParameters[key] = val.map(encodeURIComponent);
  // })
  if (
    routeState.brands &&
    routeState.brands !== routeStateDefaultValues.brands
  ) {
    // console.log("brand", routeState.brands.map(encodeURIComponent));  
    queryParameters.brands = routeState.brands.map(encodeURIComponent);
  }
  if (
    routeState.vendorcode &&
    routeState.vendorcode !== routeStateDefaultValues.vendorcode
  ) {
    queryParameters.vendorcode = routeState.vendorcode.map(encodeURIComponent);
  }
  // if (
  //   routeState.rating &&
  //   routeState.rating !== routeStateDefaultValues.rating 
  // ) {
  //   queryParameters.rating = routeState.rating;
  // }
  // if (routeState.price && routeState.price !== routeStateDefaultValues.price) {
  //   queryParameters.price = routeState.price;
  // }
  // if (
  //   routeState.free_shipping &&
  //   routeState.free_shipping !== routeStateDefaultValues.free_shipping
  // ) {
  //   queryParameters.free_shipping = routeState.free_shipping;
  // }
  // if (
  //   routeState.sortBy &&
  //   routeState.sortBy !== routeStateDefaultValues.sortBy
  // ) {
  //   queryParameters.sortBy = routeState.sortBy;
  // }
  // if (
  //   routeState.hitsPerPage &&
  //   routeState.hitsPerPage !== routeStateDefaultValues.hitsPerPage
  // ) {
  //   queryParameters.hitsPerPage = routeState.hitsPerPage;
  // }

  const queryString = qs.stringify(queryParameters, {
    addQueryPrefix: true,
    arrayFormat: "repeat",
  });
  // console.log( queryString , "base url , <<<<<", location);
  // if(location.search !== queryString){
  return `/search${queryString}`;
  // }
};

const urlToSearchState = (location) => {
  // const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);
  // const category = getCategoryName(
  //   (pathnameMatches && pathnameMatches[1]) || ""
  // );
  const queryParameters = qs.parse(location.search.slice(1));
  const {
    query = "",
    page = 0,
    vendorcode = "",
    brands = [],
    // price,
    // free_shipping,
    // hitsPerPage,
    // sortBy,
    // rating,
  } = queryParameters;
  // `qs` does not return an array when there's a single value.
  const allBrands = Array.isArray(brands) ? brands : [brands].filter(Boolean);
  const allVendorcodes = Array.isArray(vendorcode)
    ? vendorcode
    : [vendorcode].filter(Boolean);
  const searchState = { range: {} };
  if (query) {
    searchState.query = decodeURIComponent(query);
  }
  if (page) {
    searchState.page = page;
  }
  // if (category) {
  //   searchState.hierarchicalMenu = {
  //     "hierarchicalCategories.lvl0": category,
  //   };
  // }
  if (allBrands.length) {
    searchState.refinementList = {
      ...searchState.refinementList,
      brand: allBrands.map(decodeURIComponent),
    };
  }
  if (allVendorcodes.length) {
    searchState.refinementList = {
      ...searchState.refinementList,
      vendorcode: allVendorcodes.map(decodeURIComponent),
    };
  }
  // if (rating) {
  //   searchState.range.rating = {
  //     min: Number(rating),
  //   };
  // }
  // if (price) {
  //   const [min, max = undefined] = price.split(":");
  //   searchState.range.price = {
  //     min: min || undefined,
  //     max: max || undefined,
  //   };
  // }
  // if (free_shipping) {
  //   searchState.toggle = {
  //     free_shipping: Boolean(free_shipping),
  //   };
  // }
  // if (sortBy) {
  //   searchState.sortBy = sortBy;
  // }

  // if (hitsPerPage) {
  //   searchState.hitsPerPage = hitsPerPage;
  // }
  // console.log(searchState, "location  ???");

  return searchState;
};

const withURLSync = (App) =>
  function WithURLSync(props) {
    const [state, setState] = useState(urlToSearchState(window.location));
    const setStateId = useRef();
    const history = useHistory();
    const location = useLocation();
    React.useEffect(() => {
      const nextSearchState = urlToSearchState(window.location);

      if (JSON.stringify(state) !== JSON.stringify(nextSearchState)) {
        setState(nextSearchState);
      }

      // eslint-disable-next-line
    }, [location]);

    useEffect(() => {
      window.addEventListener("popstate", onPopState);

      return () => {
        clearTimeout(setStateId.current);
        window.removeEventListener("popstate", onPopState);
      };
    }, []);

    const onPopState = ({ state }) => { 
      const buffState = state.state || state;
      setState(buffState || {});
    };

    const onSearchStateChange = (searchState) => {
      const buffState = searchState.state || searchState;
      clearTimeout(setStateId.current);
      if (isSearchPage(window.location.pathname)) {
        if (
          buffState.configure &&
          JSON.stringify(buffState) !== JSON.stringify(state) && searchStateToURL(buffState) !== `${location.pathname}${location.search}`
        ) {
          setStateId.current = setTimeout(() => {
            console.log(
              searchStateToURL(buffState),
              location,
              buffState,
              "searchStatesearchStatesearchStatesearchStatesearchStatesearchState"
            );
            history.push(searchStateToURL(searchState), buffState);
          }, updateAfter);
        } 
        setState(searchState);
      }
    };

    // console.log(state, "state isn't working <<<<<<<<<*********************")
    return (
      <App
        {...props}
        searchState={state.state || state}
        onSearchStateChange={onSearchStateChange}
        createURL={searchStateToURL}
      />
    );
  };

export default withURLSync;
