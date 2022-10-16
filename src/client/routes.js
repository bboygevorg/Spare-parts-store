/* eslint-disable react/display-name */
import Common from "./pages/Common"
import ProductPage from "./pages/Product"
import Categories from "./pages/Categories"
import EstimateDelivery from "./pages/EstimateDelivery"
import WishListPage from"./pages/WishListPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Addresses from "./pages/Addresses"
import Profile from "./pages/Account/profile"
import Orders from "./pages/Account/Orders"
import Cart from "./pages/Cart"
import CheckoutPage from "./pages/CheckoutPage/checkoutPage"
import ProductCategories from "./pages/ProductCategories"
import BillingAddress from "./pages/Account/billingAddress"
import PaymentMethods from "./pages/Account/paymentMethods"
import Checkout from "./pages/Checkout"
import Faq from "./pages/Faq"
import Privacy from "./pages/Privacy"
import Return from "./pages/Return"
import NotFound from './pages/NotFound'
import CourierOrderPage from "./pages/CourierOrderPage";
import CourierCheckout from './pages/Checkout/courierCheckout';
import UserManagement from "./pages/Account/UserManagement";
import CartTemplates from "./pages/Account/CartTemplates";
import CartManagement from "./pages/Account/CartManagement";
import FreeGas from "./pages/FreeGas";
import Reports from "./pages/Account/Reports";

const Routes = [
  {
    path: "/courier_checkout",
    component: CourierCheckout
  },
  {
    path: "/order_courier",
    component: CourierOrderPage,
    exact: true
  },
  {
    path: "/account/payment_methods",
    component: PaymentMethods,
    exact: true

  },
  {
    path: "/checkout-new",
    component: Checkout,
  },
  {
    path: "/faq",
    component: Faq,
    exact: true

  },
  {
    path: "/privacy",
    component: Privacy,
    exact: true

  },
  {
    path: "/checkout",
    component: CheckoutPage,
    exact: true

  },
  {
    path: "/return",
    component: Return,
    exact: true

  },
  {
    path: "/topcategories/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5",
    component: Categories,
    exact: true
  },
  {
    path: "/topcategories/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4",
    component: Categories,
    exact: true
  },
  {
    path: "/topcategories/:catlvl0/:catlvl1/:catlvl2/:catlvl3",
    component: Categories,
    exact: true
  },
  {
    path: "/topcategories/:catlvl0/:catlvl1/:catlvl2",
    component: Categories,
    exact: true
  },
  {
    path: "/topcategories/:catlvl0/:catlvl1",
    component: Categories,
    exact: true
  },
  {
    path: "/topcategories/:catlvl0",
    component: Categories,
    exact: true
  },
  // {
  //   path:
  //     "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5/:catlvl6",
  //   component: Categories.component,
  // },
  // {
  //   path:
  //     "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5",
  //   component: Categories.component,
  // },
  // {
  //   path: "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4",
  //   component: Categories.component,
  // },
  {
    path:
      "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5/:catlvl6/:catlvl7/:catlvl8",
    component: Categories,
    exact: true

  },
  {
    path:
      "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5/:catlvl6/:catlvl7",
    component: Categories,
    exact: true

  },
  {
    path:
      "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5/:catlvl6",
    component: Categories,
    exact: true

  },
  {
    path:
      "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4/:catlvl5",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3/:catlvl4",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store/:catlvl0/:catlvl1/:catlvl2/:catlvl3",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store/:catlvl0/:catlvl1/:catlvl2",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store/:catlvl0/:catlvl1",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store/:catlvl0",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:store",
    component: Categories,
    exact: true

  },
  {
    path: "/categories/:catlvl0",
    component: Categories,
    exact: true

  },
  {
    path: "/search",
    component: Categories,
    exact: true

  },
  {
    path: "/product-categories",
    component: ProductCategories,
    exact: true

  },
  {
    path: "/product/:productId",
    component: ProductPage.component,
    loadData: ProductPage.loadData,
    exact: true

  },
  {
    path: "/estimate-delivery",
    component: EstimateDelivery,
    exact: true

  },
  {
    path: "/favorites",
    component: WishListPage,
    exact: true

  },
  {
    path: "/signin",
    component: SignInPage,
    exact: true

  },
  {
    path: "/signup",
    component: SignUpPage,
    exact: true

  },
  {
    path: "/account/profile",
    component: Profile,
    exact: true

  },
  {
    path: "/account/orders",
    component: Orders,
    exact: true

  },
  {
    path: "/account/addresses",
    component: Addresses,
    exact: true

  },
  {
    path: "/account/billing_address",
    component: BillingAddress,
    exact: true
  },
  {
    path: "/account/user_management",
    component: UserManagement,
    exact: true
  },
  {
    path: "/account/cart_managament",
    component: CartManagement,
    exact: true
  },
  {
    path: "/account/cart_templates",
    component: CartTemplates,
    exact: true
  },
  {
    path: "/account/reports",
    component: Reports,
    exact: true
  },
  {
    path: "/account/estimations",
    // component: BillingAddress,
    exact: true
  },
  {
    path: "/cart",
    component: Cart,
    exact: true

  },
  {
    path: "/",
    component: Common,
    exact: true

  },
	{
		path: "/free_gas",
		component: FreeGas,
		exact: true
	},
  {
    path: "*",
    component: NotFound,
    exact: true
  }
];

export default Routes;
