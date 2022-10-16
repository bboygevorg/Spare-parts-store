import { categoriesActions } from "conf/actionKeys";

const initial = {
  isFetching: false,
  data: {},
  sub: {},
  refineValue: {},
  currentRefinements: [],
  currentStores: [],
  currentStore: {},
  mainCategories: [],
  searchRefinement: "",
  isSearching: false,
  pagination: {},
  hitsPerPage: 0,
  instantChecked: false,
  catalogChecked: false
};

export function categories(state = initial, action) {
  switch (action.type) {
    case categoriesActions.START_FETCHING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case categoriesActions.END_FETCHING: {
      return {
        ...state,
        isFetching: false,
      };
    }
    case categoriesActions.GET_CATEGORIES: {
      return {
        ...state,
        data: action.payload,
      };
    }

    case categoriesActions.ADD_SUBS: {
      return {
        ...state,
        sub: action.payload,
      };
    }
    case categoriesActions.REFINE_VALUE: {
      return {
        ...state,
        refineValue: action.payload,
      };
    }
    case categoriesActions.SET_CURRENT_REFINEMENTS: {
      return {
        ...state,
        currentRefinements: action.payload,
      };
    }
    case categoriesActions.SET_CURRENT_STORES: {
      return {
        ...state,
        currentStores: action.payload,
      };
    }
    case categoriesActions.REFINE_STORE: {
      return {
        ...state,
        currentStore: action.payload,
      };
    }

    case categoriesActions.SET_MAIN_CATEGORIES: {
      return {
        ...state,
        mainCategories: action.payload,
      };
    }

    case categoriesActions.SET_SEARCH_REFINEMENT: {
      return {
        ...state,
        searchRefinement: action.payload,
      };
    }

    case categoriesActions.SET_IS_SEARCHING: {
      return {
        ...state,
        isSearching: action.payload,
      };
    }
    case categoriesActions.SET_PAGINATION_DATA: {
      return {
        ...state,
        pagination: action.payload,
      };
    }
    case categoriesActions.SET_HITS_PER_PAGE: {
      return {
        ...state,
        hitsPerPage: action.payload
      }
    }    
    case categoriesActions.SET_INSTANT_CHECKED: {
      return {
        ...state,
        instantChecked: action.payload
      }
    } 
    case categoriesActions.SET_CATALOG_CHECKED: {
      return {
        ...state,
        catalogChecked: action.payload
      }
    }
    default:
      return state;
  }
}
