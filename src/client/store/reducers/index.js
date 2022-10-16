import { combineReducers } from "redux";
import { categories } from "./categories";
import { stores } from "./stores";
import signin from "./signin";
import products from "./products";
import checkout from "./checkout";
import { checkoutNew, checkoutCourier, checkoutInfo } from "./checkoutNew";
import language from './language';
import product from './product';
import firebase from './firebase';
import wishList from './wishList';
import topCategories from './topCategories';

export default combineReducers({
  categories,
  stores,
  signin,
  products,
  checkout,
  checkoutNew,
  checkoutInfo,
  checkoutCourier,
  language,
  product,
  firebase,
  wishList,
  topCategories
});
