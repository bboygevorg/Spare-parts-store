import React, { useEffect } from "react";
import Routes from "../../routes";
import { renderRoutes } from "react-router-config";
import Root from "components/Root/index";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin, actions } from "store/actions/signIn";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { GET_CUSTOMER_DATA, GET_TRANSLATIONS } from "api/query";
import { useLocation, Route, Switch, Redirect, useHistory } from "react-router-dom";
import Common from "pages/Common";
import { storeUrl, ALL_STORES_VALUE } from "components/Algolia/Menu/menu";
import { InstantSearch, Configure } from "react-instantsearch-dom";
import { searchClient } from "conf/main";
// import withClearCache from "../../ClearCache";
import { getTranslationsAction } from 'actions/language';
import { codeSplitter } from 'components/Link/link';
import { LANGUAGE_KEYS } from 'components/dataLoaders';
import { emptyCache } from 'helper/utils';
import TextCallUs from 'components/TextCallUs';
import { actions as wishListActions } from 'actions/wishList';
import "./appContainer.css";
import {STORAGE_DONT_SHOW_AGAIN} from "../../conf/consts";
// import withURLSync from "../../withUrl";
// const ClearCacheComponent = withClearCache(AppContainer);

// eslint-disable-next-line no-undef
// const remoteConfig = firebase.remoteConfig();
// remoteConfig.settings = {
//   minimumFetchIntervalMillis: 3600000,
// };


// function App() {
//   return <ClearCacheComponent />
// }

function AppContainer() {
  const { pathname } = useLocation();
  const history = useHistory();
  const currentLanguage = useSelector(state => state.language.currentLanguage);
  const wishList = useSelector(state => state.wishList.categories);
  const allWishListItems = useSelector(state => state.wishList.allItems);
  const isGoogleBot = useSelector(state => state.firebase.isGoogleBot);
  const version = typeof window !== "undefined" && localStorage.getItem('version');

  const handleBackButton = () => {
    let previous = '';
    if(history.location.search && history.location.search.includes("query")) {
      const params = history.location.search.split("/");
      previous = new URLSearchParams(params[1]).get('lang')
    }
    else {
      previous =  new URLSearchParams(history.location.search).get('lang');
    }
    const previousLocaleId = previous === null ? 'en' : previous;
    const currentLanguage = LANGUAGE_KEYS.find(el => el.code === localStorage.getItem("language"));
    const currentLocaleId = currentLanguage && currentLanguage.name;
    if(currentLocaleId !== previousLocaleId) {
      window.location.reload();
    }
    window.removeEventListener("popstate", handleBackButton);
  };
  useEffect(() => {
    window.gtag("page_view", pathname)
    window.addEventListener("popstate", handleBackButton, false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const newVersion = "3.7.0";
    if(!version || version !== newVersion) {
      emptyCache(newVersion);
    }
  }, [version])
  const dispatch = useDispatch();
  const getCustomer = useAwaitQuery(GET_CUSTOMER_DATA);
  const getTranslations = useAwaitQuery(GET_TRANSLATIONS);

  useEffect(() => {
    if(history.location.search.includes("lang")) {
      history.replace("/");
    }
    
    document.getElementsByTagName('body')[0].classList.add("reactLoaded");
    window.ga('require', 'ecommerce');
    dispatch(autoLogin(getCustomer));
    if (localStorage.getItem(STORAGE_DONT_SHOW_AGAIN)) {
      dispatch(actions.addDontShow(localStorage.getItem(STORAGE_DONT_SHOW_AGAIN)));
    }
    const wishlist = JSON.parse(localStorage.getItem("wishList"))
    if(!wishList.length && wishlist && wishlist.length) {
      dispatch(wishListActions.setWishlists(wishlist));
    }
    const allItems = JSON.parse(localStorage.getItem("allWishListItems"));
    if(!allWishListItems.length && allItems && allItems.length) {
      dispatch(wishListActions.setAllItems(allItems))
    }
    if(currentLanguage) {
      dispatch(getTranslationsAction(getTranslations));
    }
  }, []);

  useEffect(() => {
    dispatch(getTranslationsAction(getTranslations));
  }, [currentLanguage])

  useEffect(() => {
    if(history.location.pathname === "/" && currentLanguage && currentLanguage !== "default") {
      history.replace(codeSplitter(currentLanguage));
    }
  }, [currentLanguage, history])
  return (
    <InstantSearch
      // searchState={props.searchState}
      searchClient={searchClient}
      indexName={process.env.ALGOLIA_INDEX}
      // createURL={props.createURL}
      // onSearchStateChange={props.onSearchStateChange}
    >
      <Root>
        <Switch>
          <Route
            exact
            path="/categories"
            component={() => (
              <Redirect to={storeUrl({ value: ALL_STORES_VALUE })} />
            )}
          />
            {renderRoutes(Routes)}
          <Route component={Common.component} />
        </Switch>
        <TextCallUs />
      </Root>
      <Configure clickAnalytics enablePersonalization={true} analytics={isGoogleBot ? false : true}/>
    </InstantSearch>
  );
}

// export default withURLSync(AppContainer);
export default AppContainer;
