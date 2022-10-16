import React from "react"
import classes from "./searchBar.css"
import SearchBox from "algolia/SearchBox";
// import MenuSelect from "algolia/MenuSelect";
// import { useSelector } from "react-redux";

const SearchBar = ({isHidden}) => {
    // const subCategories = useSelector(state => state.categories.sub);
    return (
      <div className={`${classes.searchBar} ${isHidden ? classes.hiddenBar : ""}`}>
        {/* <MenuSelect subs={subCategories} attribute={"vendorcode"} /> */}
        <SearchBox />
      </div>
    );
}

export default SearchBar ;
