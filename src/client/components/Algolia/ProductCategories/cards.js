import React, { useEffect, useMemo, useState } from "react";
import { connect, useSelector } from "react-redux";
import classes from "./cards.css";
import isEmpty from "lodash/isEmpty";
// import images from "store/categoriesImages.json";
// import config from "../../../../config";
import get from "lodash/get";
import { firstUpperCase } from "helper/utils";
import Typo from "components/UI/Typo/index";
import { withRouter } from "react-router-dom";
// import { connectHits } from "react-instantsearch-dom";
import { algoliaIndex } from "conf/main";
import ProductCard from "components/ProductCard";
import useWindowDimensions from "talons/useWindowDimensions"; 
import Loading from "components/Loading";
import HelpModal from "../ProductList/HelpModal/index";
import Modal from "components/Modal/modal";
import { useHistory } from "react-router-dom";
import useTranslation from 'talons/useTranslation';
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";
// function ellipsizeTextBox(classname) {
//   var el = document.querySelectorAll(`.${classname}`);
//   el.forEach((e) => {
//         console.log(e);

//     var wordArray = e.innerHTML.split(" ");
//     while (e.scrollHeight > e.offsetHeight) {
//       wordArray.pop();
//       e.innerHTML = wordArray.join(" ") + "...";
//     }
//   });
// }

const Hits = ({ cat , isLarge, setIsFetching}) => {
  const history = useHistory()
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false)
  const [mainHits, setMainHits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const currStore = useSelector(state => state.categories.currentStore)
  const sub = useSelector(state => state.categories.sub)
  const instantChecked = useSelector(state => state.categories.instantChecked);
  const catalogChecked = useSelector(state => state.categories.catalogChecked)
  const { currentLanguageName } = useCurrentLanguage();

  const getHits = () => {
    if (!cat.value) {
      return false;
    }
    const splitedCat = cat.value.split("|");
    setLoading(true)
    algoliaIndex
      .search("", {
        attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`],
        facetFilters: [
          `categories.lvl${splitedCat.length - 1}: ${cat.value}`,
          `vendorcode:${
            get(currStore, "value", "") === "all stores"
              ? ""
              : get(currStore, "value", "")
          }`,
        ],
        length: 3,
        offset: 0,
        // filters: `category: ${cat.value.split('|').map(el => firstUpperCase(el)).join('|')}`,
        filters: instantChecked ? `in_stock:true AND delivery_option:0${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}` : `in_stock:true${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}`
      })
      .then((res) => {
        setMainHits(res.hits);
        setLoading(false);
      });
      setLoading(false);
  };
  useEffect(() => {
    const arr = history.location.pathname.split('/');
    const length = arr.length;
    if(arr[length - 1] === "") {
      arr.pop();
    }
    const lastItem = arr[arr.length - 1].replace(/_/g," ");
    if(arr.length > 3) {
      if(!isEmpty(sub) && sub.label === lastItem) {
        getHits();
      }
      else {
        return;
      }
    }
    else 
    if(currStore && currStore.value) {
      getHits();
    }
    return () => setHits([])
  }, [JSON.stringify(cat.value), currStore, sub, history, instantChecked]);
  useEffect(() => {  
    if(mainHits.length) {
      setHits(
        mainHits.length > 2
          ?
            isLarge ? mainHits.slice(0, -1) :
          width > 484
            ? mainHits
            : mainHits.slice(0, -1)
          : mainHits
      );
    }
  }, [JSON.stringify(mainHits), width, isLarge, instantChecked]);
  
  useEffect(() => {
    if(hits.length && mainHits.length) {
      setIsFetching(false)
    }
  }, [mainHits, hits])
  return (
    <div className={classes.hitsWrapper}>
      {loading ? (
        <Loading />
      ) : (
        hits.map((hit, index) => (
          <ProductCard key={index} product={hit} large={isLarge} onClickHelpButton={() => setIsOpen(true)} fromCategory={true}/>
        ))
      )} 
      <Modal
        isShown={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        className={classes.dialog}
      >
        <HelpModal />
      </Modal>
    </div>
  );
};

const Cards = ({ subCategories, items, onClick, searching , isLarge}) => {
  let observer = null;
  const COUNT = 3;
  const [pageCount, setPageCount] = useState(COUNT);
  const [isFetching, setIsFetching] = useState(true);
  const currentRefinements = useSelector(state => state.categories.currentRefinements);
  const __ = useTranslation();
  let categories = [];
  if (subCategories.items) {
    categories = subCategories.items;
  } else if (items && isEmpty(subCategories)) {
    categories = items;
  }
  const memoizeCats = useMemo(() => categories);
  // console.log(
  //   memoizeCats,
  //   "itemsitemsitemsitemsitems"
  // );
  // const isSub = useMemo(() => Object.keys(match.params).length > 1);
  // if (searching) {
  //   return "loading ... "
  // }

  useEffect(() => {
    if(items.length) {
      if(subCategories.length && currentRefinements.length === 2) {
        setIsFetching(false);
      }
    }
  }, [JSON.stringify(subCategories), JSON.stringify(items), currentRefinements])
  const onSentinelIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setPageCount((c) => c + COUNT);
      }
    });
  };
  useEffect(() => {
    observer = new IntersectionObserver(onSentinelIntersection);
    observer.observe(document.querySelector(".cards-inifinite-scroll"));
    
  }, []);

  return (
    <div className={classes.cardsWrapper}>
      {memoizeCats.slice(0, pageCount).map((cat, index) => {
        // console.log(cat, "my cat")
        return (
          <div key={index} className={classes.cardItem}>
            {/* {!isSub && (
              <img
                src={`${config.BASE_URL}${get(
                  images,
                  cat.label,
                  get(images, "automotive")
                )}`}
              />
            )} */}
            <div className={classes.titleWrapper}>
              <Typo className={classes.cardTitle} variant="h2">
                {!isFetching && firstUpperCase(cat.label)}
              </Typo>
              <Typo
                className={classes.subTitle}
                variant="h3"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClick(cat);
                }}
              >
                {!isFetching && __("See all products")}
              </Typo>
            </div>
            <Hits cat={cat} onClick={onClick} searching={searching} isLarge={isLarge} setIsFetching={setIsFetching}/>
          </div>
        );
      })}
      <div className="cards-inifinite-scroll"></div>
    </div>
  );
};

export default connect((state) => ({
  subCategories: state.categories.sub,
}))(withRouter(Cards));
