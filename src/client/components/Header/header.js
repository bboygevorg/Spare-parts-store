import React, { useState, useEffect, useCallback } from "react";
import classes from "./header.css";
import Link from "components/Link";
import Button from "components/Button";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAwaitQuery } from "talons/useAwaitQuery";
import { addCartData, actions } from "store/actions/signIn";
import { GET_CART } from "api/query";
import AppWrapper from "ui/AppWrapper";
import SearchBar from "components/SearchBar";
import isEmpty from "lodash/isEmpty";
import useWindowDimensions from "talons/useWindowDimensions";
import Hamburger from "icons/Hamburger";
import { FOOTER_MENU, MOBILE_SIZE } from "conf/consts";
import Accordion from "components/Accordion";
import Typo from "components/UI/Typo";
import SearchBox from "algolia/SearchBox";
import LoggedUser from "./loggedUser";
import Confirmation from "components/Confirmation";
import useFirebaseInfo from "talons/useFirebaseInfo";
import Help from 'icons/Help';
import ContactUs from './contactUs';
import { setCurrentStores } from 'actions/categories';
// import LanguageSelector from 'components/LanguageSelector';
import useTranslation from 'talons/useTranslation';
import { codeSplitter } from 'components/Link/link';
import { setCurrentStep, setBillingAddress, getAddressesFullfield } from "actions/checkoutNew";
import { actions as wishListActions } from 'actions/wishList';
import { searchClient } from "conf/main";
import aa from 'search-insights';
import Zones from "components/Zones";

const Header = () => {
  const [drawer, setDrawer] = useState(false);
  const [disableZoneSelector, setDisableZoneSelector] = useState(false);
  const { phone } = useFirebaseInfo();
  const { width } = useWindowDimensions();
  const [showUserInfo, setShowUserInfo] = useState(width >= MOBILE_SIZE);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.signin.isAuth);
  const cartData = useSelector((state) => state.signin.cartData);
  const localeId = useSelector(state => state.language.currentLanguage);
	
	const __ = useTranslation();
  const getCartQuantity = useCallback(
    (items = []) => {
      const quantiy = items.reduce((acc, item) => acc + item.qty, 0);
      return quantiy < 99 ? quantiy : "99+";
    },
    [cartData]
  );
  
  useEffect(() => {
	  document.addEventListener('disableZoneList', function () {
		  setDisableZoneSelector(true)
	  }, false);
	  document.addEventListener('enableZoneList', function () {
		  setDisableZoneSelector(false)
	  }, false);
  }, [])

  const getCartData = useAwaitQuery(GET_CART);
  useEffect(() => {
    if (isAuth) {
      dispatch(addCartData(getCartData));
    }
  }, [cartData.cartToken]);

  useEffect(() => {
    if (width > MOBILE_SIZE) {
      setDrawer(false);
    }
  }, [width]);

  useEffect(() => {
    if (width <= MOBILE_SIZE) {
      setShowUserInfo(false);
    } else {
      setShowUserInfo(true);
    }
  }, [width, MOBILE_SIZE]);

  useEffect(() => {
    if (drawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [drawer]);
  const signOut = () => {
    aa('getUserToken', null, (err, userToken) => {
      if (err) {
        console.error(err);
        return;
      }
      searchClient.transporter.headers['X-Algolia-UserToken'] = userToken;
    });
    dispatch(actions.signOut());
    dispatch(setCurrentStep(0));
    dispatch(setBillingAddress({}));
    dispatch(getAddressesFullfield([]));
    dispatch(wishListActions.setWishlists([]));
    dispatch(wishListActions.setItems([]));
    dispatch(wishListActions.setAllItems([]));
    closeDrawer();
    localeId === "default" ? history.replace("/") : history.replace(codeSplitter(localeId));
  };
  const closeDrawer = () => setDrawer(false);

  const accountLink = isAuth ? (
    showUserInfo ? (
      <span className={classes.accountTrigger}></span>
    ) : (
      <Link to="/account/profile">
        <span className={classes.accountTrigger}></span>
      </Link>
    )
  ) : showUserInfo ? (
    <span className={classes.accountTrigger}></span>
  ) : (
    <Link to="/signin">
      <span className={classes.accountTrigger}></span>
    </Link>
  );
  return (
    <div className={classes.root} id="header">
      <AppWrapper>
        <div className={classes.main}>
          <Link to={""} className={classes.logo} onClick={() => dispatch(setCurrentStores([]))}>
            <img src={"/images/logo.svg"} />
          </Link>
					{width > 900 &&
						<div className={`${classes.zone} ${disableZoneSelector ? classes.disabled : ''}`}>
							<span>{__("You're shopping")}</span>
							<Zones/>
						</div>
					}
          <SearchBar isHidden={width < 1525} />
          <div className={classes.contactsIconsDiv}>
            <ContactUs phone={phone} isHidden={width <= MOBILE_SIZE }/>
            <div className={classes.right}>
              {/* <div className={classes.languageMobile}>
                <LanguageSelector />
              </div> */}
              <div className={classes.account}>
                {accountLink}
                {showUserInfo && (
                  <div className={classes.dialogDiv}>
                    <div className={classes.accountDialog}>
                      {!isAuth ? (
                        <div>
                          <h2 className={classes.getStarted}>{__("Get started now")}</h2>
                            <Button
                              label={__("SIGN UP")}
                              classes={{ button_primary: classes.signUpButton }}
                              onClick={() => history.push("/signup", { state: { previousPath: history.location.pathname }})}
                            />
                            <Button
                              label={__("SIGN IN")}
                              classes={{ button_bordered: classes.signInButton }}
                              type="bordered"
                              onClick={() => history.push("/signin", { state: { previousPath: history.location.pathname }})}
                            /> 
                        </div>
                      ) : (
                        <div>
                          <LoggedUser setShowModal={setShowSignOutModal} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={classes.cart}>
                <Link to="/cart">
                  <span className={classes.cartTrigger}></span>
                  {!isEmpty(cartData) && cartData.items.length !== 0 && (
                    <div className={classes.countDiv}>
                      <span className={classes.productCount}>
                        {getCartQuantity(cartData.items)}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
              <div className={classes.wishlist}>
                <Link to="/favorites">
                  <span className={classes.wishlistTrigger}></span>
                </Link>
              </div>
              <div className={classes.helpIcon}>
                <Link to="/faq">
                  <Help />
                </Link>
              </div>
              {/* <div className={classes.language}>
                <LanguageSelector />
              </div> */}
            </div>
          </div>
        </div>
        <div
          className={`${classes.main} ${classes.mainBottom} ${
            width >= 1525 ? classes.hiddenMain : ""
          }`}
        >
          <SearchBar isHidden={width <= MOBILE_SIZE} />
          <div
            className={`${classes.menuSubHeader} ${
              width > MOBILE_SIZE ? classes.hiddenMenuSubHeader : ""
            }`}
          >
            <div onClick={() => setDrawer(true)}>
              <Hamburger />
            </div>
            <SearchBox />
          </div>
        </div>
				{width < 900 &&
					<div className={`${classes.mobileZone} ${disableZoneSelector ? classes.disabled : ''}`}>
						<span>{__("You're shopping")}</span>
						<Zones/>
					</div>
				}
      </AppWrapper>
      <Menu
        isOpen={drawer}
        onClick={closeDrawer}
        isAuth={isAuth}
        setShowModal={() => {
          setShowSignOutModal(true);
          window.scrollTo(0, 0);
        }}
        signOut={signOut}
      />
      {drawer && <Backdrop onClick={closeDrawer} />}
      <Confirmation
        isShown={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        action={signOut}
        text={__("Are you sure you want to sign out?")}
      />
    </div>
  );
};

const Menu = (props) => {
  const { isAuth, setShowModal } = props;
  const { phone } = useFirebaseInfo();
  const __ = useTranslation();
  const history = useHistory();

  return (
    <div className={`${classes.menu} ${props.isOpen && classes.menuOpen}`}>
      <div className={classes.content}>
        <div className={classes.menuTop}>
          <ContactUs phone={phone}/>
        </div>
        {FOOTER_MENU.map((cat) => (
          <Accordion
            fromHeader={true}
            key={cat.title}
            title={__(cat.title)}
            component={() => (
              <div>
                {cat.items.map((it) =>
                  it.isMail ? (
                    <a href={`mailto:${it.url}`} key={it.label}>
                      <Typo className={classes.footerLinks} font={"regular"}>
                        {__(it.label)} {it.url}
                      </Typo>
                    </a>
                  ) : it.isTel ? (
                    <a href={`tel:${phone}`} key={it.label}>
                      <Typo className={classes.item} font={"regular"}>
                        {__(it.label)}{phone}
                      </Typo>
                    </a>
                  ) : (
                    <Link to={it.url} key={it.label} onClick={props.onClick}>
                      <Typo font={"regular"} className={it.url == "#" ? classes.text : classes.item}>
                        {__(it.label)}
                      </Typo>
                    </Link>
                  )
                )}
              </div>
            )}
          />
        ))}
        {!isAuth ? (
          <div className={classes.menuButtonWrapper}>
            <Button
              label={__("SIGN UP")}
              classes={{
                button_primary: classes.menuSignUpButton,
                button_label: classes.buttonLabel,
              }}
              onClick={() => { props.onClick(); history.push("/signup", {state: { previousPath: history.location.pathname }})}}
            />
            <Button
              label={__("SIGN IN")}
              classes={{
                button_bordered: classes.menuSignInButton,
                button_label: classes.buttonLabel,
              }}
              type="bordered"
              onClick={() => { props.onClick(); history.push("/signin", {state: { previousPath: history.location.pathname }})}}
            />
          </div>
        ) : (
          <div className={classes.signOutButton}>
            <Button
              type="bordered"
              label={__("SIGN OUT")}
              onClick={() => setShowModal(true)}
              classes={{
                button_bordered: classes.menuSignInButton,
                button_label: classes.buttonLabel,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Backdrop = (props) => (
  <div className={classes.backdrop} onClick={props.onClick}></div>
);

export default Header;
