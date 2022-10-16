import React, { useMemo, useState } from "react";
import AppWrapper from "components/UI/AppWrapper";
import Typo from "ui/Typo";
import classes from "./faq.css";
import Search from "icons/Search";
import Close from "icons/Close";
import Arrow from "icons/Arrow";
import Head from "components/Head";
import isEmpty from 'lodash/isEmpty';
import useTranslation from 'talons/useTranslation';
import { STATIC_DESCRIPTION } from 'conf/consts';

const FAQ_QUESTIONS = [
  {
    title: "What is the delivery area?", 
    body:
      "Presently, we are only servicing the greater Los Angeles area, but stay tuned as we roll-out new cities",
    isOpen: false,
  },
  {
    title: "How much does delivery cost?",
    body:
      "Delivery can be as low as $12 for small items. Please see the cost generator in our app for detailed pricing information.",
    isOpen: false,
  },
  {
    title: "How long does delivery take?",
    body:
      "We start shopping your items immediately and deliver once complete, so super fast! We generally leave the store on our way to you in less than 30 minutes.",
    isOpen: false,
  },
  {
    title:
      "Can I order items from multiple stores on the app at the same time?",
    body: "Absolutely! Fast and easy. We do all the work.",
    isOpen: false,
  },
  {
    title: "Delivery fee is per vheicle, so fill it up!",
    body:
      "We don't charge per item for delivery, so you should order lots of stuff and fill the car/truck!",
    isOpen: false,
  },
  {
    title: "Returns",
    body:
      <div className={classes.returnsText}>
        <a href="https://www.homedepot.com/c/Return_Policy" target='blank'>Home Depot Return Policy</a>
        <a href="https://www.lowes.com/l/returns-policy.html" target='blank'>Lowes Return Policy</a>
        <a href="https://www.ferguson.com/content/customer-service/return-policy" target='blank'>Ferguson Return Policy</a>
        <a href="https://www.gemaire.com/returns/" target='blank'>Gemaire Return Policy</a>
        <a href="https://www.acehardware.com/customer-service" target='blank'>Ace Hardware Return Policy</a>
        <a href="https://www.walterswholesale.com/free-returns" target='blank'>Walters Wholesale Electric Return Policy</a>
      </div>,
    isOpen: false,
  },
];

const Accordeon = ({ title, body, isOpen, idx, setCurrentItem }) => {
  const __ = useTranslation();
  return (
    <div className={classes.Accordeon}>
      <div
        onClick={() => setCurrentItem(idx)}
        className={classes.AccordeonTitle}
      >
        <Typo variant={"p"} font="regular">
          {__(title)}
        </Typo>
        <div
          style={{
            transform: `rotate(${isOpen ? "0deg" : "180deg"})`,
            transition: "0.3s",
          }}
        >
          <Arrow />
        </div>
      </div>
      <div
        className={`${isOpen ? classes.AccordeonOpened : ""} ${
          classes.AccordeonBody
        }`}
      >
        <div>
          <Typo variant="px" font="regular">
            {title === "Returns" 
            ? 
              <div className={isOpen ? classes.returnsText : classes.hiddenLinks}>
                <Typo as="p" variant="px" font="regular">{__("The BuildClub does not charge any fees for returns. Returns are subject to the return policies of the sourcing supplier. Please see the following links for additional details.")}</Typo>
                <br/>
                <Typo as="p" variant="px" font="regular">{__("BuildClub delivery costs (if any) may not be refundable, depending on the reason for the return. Please contact The BuildClub customer service to arrange a return.")}</Typo>
                <br/>
                {/* {body} */}
              </div>
            : 
              __(body)}
          </Typo>
        </div>
      </div>
    </div>
  );
};
const Faq = () => {
  const [openElements, setOpenElements] = useState([]);
  const [searchbarActive, setSearchbarActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const __ = useTranslation();
  //   const [currentItem, setCurrentItem] = useState(null);
  const changeCurrentItem = (item, key) => {
    let openelems = [...openElements];
    openelems = [];
    openelems[key] = !openElements[key];
    setOpenElements(openelems);
  };
  const questions = useMemo(() => {
    return FAQ_QUESTIONS.filter((faq) => {
      const buffVal = searchValue.toLowerCase().trim();
      if(faq.title === "Returns") {
        const arr = faq.body.props.children.map(child => {
          if(!isEmpty(child.props)) {
            return (
              faq.title.toLowerCase().includes(buffVal) ||
              child.props.children.toLowerCase().includes(buffVal)
            );
          }
        })
        if(arr.length && arr.includes(true)) {
          return true;
        }
      }
      else {
        return (
          faq.title.toLowerCase().includes(buffVal) ||
          faq.body.toLowerCase().includes(buffVal)
        );
      }
    });
  }, [searchValue]);
  return (
    <div style={{ marginBottom: "-50px" }} className={classes.root}>
      <Head description={STATIC_DESCRIPTION}>FAQ</Head>
      <div className={classes.overlay}></div>
      <AppWrapper>
        {/* <AccordeonWrapper />   */}
        <div className={classes.AccordeonWrapper}>
          <div className={classes.header}>
            {!searchbarActive && (
              <Typo variant="h2" className={classes.AccordeonWrapperTitle}>
                {__("Frequently Asked Questions")}
              </Typo>
            )}

            {!searchbarActive && (
              <div
                onClick={() => setSearchbarActive(true)}
                className={`${classes.withPointer} ${classes.searchIcon}`}
              >
                <Search />
              </div>
            )}

            {/* {searchbarActive && ( */}
            <div
              className={`${classes.searchBar} ${
                searchbarActive ? classes.searchBarActive : ""
              }`}
            >
              <div
                onClick={() => setSearchbarActive(true)}
                className={`${classes.withPointer} ${classes.searchIcon}`}
              >
                <Search />
              </div>
              <div className={classes.searchBarInput}>
                <input
                  className={searchbarActive ? classes.inputActive : ""}
                  placeholder={__("Looking for something?")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoComplete="off" 
                />
              </div>
              <div
                className={`${classes.withPointer}`}
                onClick={() => {
                  setSearchbarActive(false);
                  setSearchValue("");
                }}
              >
                <Close />
              </div>
            </div>
            {/* )}  */}
          </div>
          <div>
            {questions.length ? (
              questions.map((faq, index) => (
                <Accordeon
                  key={index}
                  {...faq}
                  // isOpen={index === currentItem}
                  isOpen={openElements[index]}
                  setCurrentItem={() => changeCurrentItem(faq, index)}
                />
              ))
            ) : (
              <Typo font="regular" className={classes.emptyMessage}>
                {__("Sorry, we could not find any results to match your search criteria.")}
                <br />
                {__("Please try again with some different keywords.")}
              </Typo>
            )}
          </div>
        </div>
      </AppWrapper>
    </div>
  );
};

export default Faq;
