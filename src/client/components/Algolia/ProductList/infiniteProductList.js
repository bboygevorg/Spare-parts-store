import React, { useEffect, useState } from "react";
import {
  connectHits,
  connectStats,
  connectPagination,
  Configure,
} from "react-instantsearch-dom";
import classes from "./productList.css";
import ProductCard from "components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { setPaginationData, setHitsPerPage } from "actions/categories";
import HelpModal from "./HelpModal/index";
import Modal from "components/Modal/modal";
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";

const Stats = connectStats(({ nbHits }) => {
  const searchRefinement = useSelector(
    (state) => state.categories.searchRefinement
  );

  // const paginationData = useSelector(
  //   (state) => state.categories.pagination.current
  // );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHitsPerPage(nbHits));
  }, [nbHits]);

  return (
    <div style={{ display: !searchRefinement ? "block" : "none" }}>
      {nbHits} Result{nbHits > 1 ? "s" : ""}
    </div>
  );
});

const Pagination = connectPagination(
  ({ refine, currentRefinement, nbPages, next }) => {
    const instantChecked = useSelector(state => state.categories.instantChecked);
    const catalogChecked = useSelector(state => state.categories.catalogChecked)
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (currentRefinement <= nbPages) {
        dispatch(
          setPaginationData({ current: currentRefinement, pagesCount: nbPages })
        );
      }
    }, [currentRefinement]);

    useEffect(() => {
      if (currentRefinement < nbPages) {
        refine(currentRefinement + 1);
      }
    }, [next]);

    useEffect(() => {
      refine(1);
    }, [catalogChecked, instantChecked]);

    useEffect(() => {}, []);
    return <div></div>;
  }
);

const InfiniteProductList = ({ hits, large, isLast, isShow }) => {
  const [allHists, setAllHits] = useState([]);
  const [next, setNext] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const paginationData = useSelector((state) => state.categories.pagination);
  const instantChecked = useSelector(state => state.categories.instantChecked);
  const catalogChecked = useSelector(state => state.categories.catalogChecked)
  const isGoogleBot = useSelector(state => state.firebase.isGoogleBot);
  const { currentLanguageName } = useCurrentLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const searchRefinement = useSelector(
    (state) => state.categories.searchRefinement
  );
  const totalsResult = useSelector((state) => state.categories.hitsPerPage);

  let observer = null;
  const onSentinelIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setNext(true);
      } else {
        setNext(false);
      }
    });
  };
  const handleScroll = () => {
    setScrolling(true);
    window.removeEventListener("scroll", handleScroll);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, [])

  useEffect(() => {
    if (isLast || searchRefinement) {
      if(scrolling) {
        setAllHits([...allHists, ...hits]);
      }
      else {
        setAllHits([...hits]);
      }
    }
    return () => setAllHits([]);
  }, [JSON.stringify(hits), isLast]);

  useEffect(() => {
    observer = new IntersectionObserver(onSentinelIntersection);
    observer.observe(document.querySelector(".ais-InfiniteHits-sentinel"));
    return () => {
      observer.disconnect();
    };
  }, [paginationData]);

  useEffect(() => {
    return () => { 
      setAllHits([]);
    };
  }, []);

  useEffect(() => {
    if(totalsResult <= 12) {
      if(hits.length) {
        setAllHits(hits);
      }
      else {
        setAllHits([]);
      }
    }
  }, [totalsResult, JSON.stringify(hits)]);

  useEffect(() => {
    if(totalsResult > 12) {
      setAllHits([]);
    }
  }, [totalsResult]);

  return (
    <div
      className={`${classes.productListWrapper} ${
        !isShow ? classes.hiddenProductListWrapper : ""
      }`}
    >
      <Configure hitsPerPage={12} facets={["*"]} filters={instantChecked ? `in_stock:true AND delivery_option:0${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}` : `in_stock:true${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}`} clickAnalytics enablePersonalization={true} analytics={isGoogleBot ? false : true} attributesToRetrieve={[...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]}/>
      <Stats />
      <div className={classes.productList}>
        {allHists.map((hit, index) => (
          hit.in_stock &&
          <ProductCard
            key={index}
            product={hit}
            large={large}
            onClickHelpButton={() => setIsOpen(true)}
          />
        ))}
        <div className="ais-InfiniteHits-sentinel"></div>
      </div>
      <Pagination next={next} />
      <Modal
        isShown={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        className={classes.dialog}
      >
        <HelpModal />
        {/* <OrderModal action={orderModalAction} orderPlaced={orderPlaced} /> */}
      </Modal>
    </div>
  );
};
export default connectHits(InfiniteProductList);
