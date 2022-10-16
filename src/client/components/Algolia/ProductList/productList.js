import React, { useEffect, useState} from "react";
import {
  connectHits,
  connectStats,
  connectPagination,
  Configure,
} from "react-instantsearch-dom";
import classes from "./productList.css";
import { useDispatch, useSelector } from "react-redux";
import { setPaginationData } from "actions/categories";
import Typo from "components/UI/Typo/index";
import Arrow from "icons/Arrow";
import lodashRange from "lodash/range";
import { setHitsPerPage } from "actions/categories";
import HelpModal from "./HelpModal/index";
import Modal from "components/Modal/modal";
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";
import SearchProducts from "pages/Account/CartTemplates/searchProducts";

const Stats = connectStats(({ nbHits }) => {
  const searchRefinement = useSelector(state => state.categories.searchRefinement)

  // const paginationData = useSelector(
  //   (state) => state.categories.pagination.current
  // );
  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(setHitsPerPage(nbHits))
  }, [nbHits])
  return (
    <div style={{display: !searchRefinement ? "block" : "none" }}>
      {nbHits} Result{nbHits > 1 ? "s" : ""}
    </div>
  );
});

const decimate = (page, array) => {
  const visiblePages = 3;
  const arrayLength = array.length;
  if (arrayLength <= visiblePages) {
    return array;
  }
  const half = Math.floor(visiblePages / 2);
  if (page <= half) {
    return array.slice(0, visiblePages);
  } else if (page > arrayLength - half) {
    return array.slice(arrayLength - visiblePages, arrayLength);
  }
  const mark = visiblePages % 2 === 1 ? -1 : 0;
  return array.slice(
    arrayLength - (arrayLength - page) - half + mark,
    arrayLength - (arrayLength - page) + half
  );
};

const Pagination = connectPagination(
  ({ currentRefinement, nbPages, refine, createURL }) => {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(setPaginationData({ current: currentRefinement }));
    }, [currentRefinement]);

    const renderPage = (pageNum) => (
      <div
        key={`page_${pageNum}`}
        className={`${classes.paginationItem} ${
          currentRefinement === pageNum && classes.paginationItemActive
        }`}
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo(0, 0);
          refine(pageNum);
        }}
      >
        <a href={createURL(pageNum)}>
          <Typo font="regular">{pageNum}</Typo>
        </a>
      </div>
    );

    const renderNumbers = () => {
      const range = lodashRange(nbPages || 1);
      const decimated = decimate(currentRefinement, range);
      return decimated.map((page) => renderPage(page + 1));
    };
    const isNearToEnd = () => currentRefinement > nbPages / 2;
    return (
      <div className={classes.paginationWrapper}>
        <div
          style={{ transform: "rotate(180deg)" }}
          className={classes.paginationArrow}
          onClick={(event) => {
            event.preventDefault();
            if (currentRefinement > 1) {
              window.scrollTo(0, 0);
              refine(currentRefinement - 1);
            }
          }}
        >
          <Arrow />
        </div>
        {nbPages > 4 ? (
          <React.Fragment>
            {currentRefinement > 2 && (
              <div
                className={`${classes.paginationItem} ${
                  currentRefinement === 1 && classes.paginationItemActive
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  refine(1);
                  window.scrollTo(0, 0);
                }}
              >
                <a href={createURL(1)}>
                  <Typo font="regular">1</Typo>
                </a>
              </div>
            )}
            {isNearToEnd() && <div className={classes.paginationItem}>...</div>}
            {renderNumbers()}
            {!isNearToEnd() && (
              <div className={classes.paginationItem}>...</div>
            )}
            {currentRefinement < nbPages - 1 && (
              <div
                className={`${classes.paginationItem} ${
                  currentRefinement === nbPages && classes.paginationItemActive
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  
                  refine(nbPages);
                  window.scrollTo(0, 0);
                }}
              >
                <a href={createURL(nbPages)}>
                  <Typo font="regular">{nbPages}</Typo>
                </a>
              </div>
            )}
          </React.Fragment>
        ) : (
          new Array(nbPages).fill(null).map((_, index) => {
            const page = index + 1;
            const style = {
              background:
                currentRefinement === page
                  ? "var(--global-body-color)"
                  : "transparent",
            };

            return (
              <div
                key={index}
                style={style}
                className={classes.paginationItem}
                onClick={(event) => {
                  event.preventDefault();
                  window.scrollTo(0, 0);
                  refine(page);
                }}
              >
                <a href={createURL(page)}>
                  <Typo font="regular">{page}</Typo>
                </a>
              </div>
            );
          })
        )}

        {/* {renderNumbers(nbPages, currentRefinement)} */}
        <div
          className={classes.paginationArrow}
          onClick={(event) => {
            event.preventDefault();
            if (currentRefinement < nbPages) {
              refine(currentRefinement + 1);
              window.scrollTo(0, 0);
            }
          }}
        >
          <Arrow />
        </div>
      </div>
    );
  }
);

const ProductList = ({ __, hits, itemsPerPage, setItemsPerPage, currentPageInfo, setCurrentPageInfo}) => {
  // console.log(hits, "my hits <<<<<") 
  // console.log(facets, "my facets")
  const [isOpen, setIsOpen] = useState(false);
  const isGoogleBot = useSelector(state => state.firebase.isGoogleBot);
  const { currentLanguageName } = useCurrentLanguage();

  return (
    <div
      className={classes.productListWrapper}
    >
      <Configure
        hitsPerPage={12}
        filters="in_stock:true"
        clickAnalytics 
        enablePersonalization={true}
        analytics={isGoogleBot ? false : true}
        attributesToRetrieve={[...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]}
      />
      <Stats />
      {hits.length ?
        <SearchProducts
          __={__}
          hits={hits} 
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPageInfo={currentPageInfo}
          setCurrentPageInfo={setCurrentPageInfo}
        />
      :
        <Typo as="p" variant="p" font="light" className={classes.noResult}>{__("No results.")}</Typo>
      }
      {hits.length ? <Pagination /> : null}
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
  );};
export default connectHits(ProductList);
