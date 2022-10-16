import React, { Fragment } from 'react';
import defaultClasses from './pagination.css';
import { mergeClasses } from 'helper/mergeClasses';
import Arrow from "icons/Arrow";
import lodashRange from "lodash/range";

const Pagination  = props => {
    const { currentPage, setCurrentPage, totalPages } = props;
  
    const isNearToEnd = () => currentPage > totalPages / 2;

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

    const renderNumbers = () => {
        const range = lodashRange(totalPages || 1);
        const decimated = decimate(currentPage, range);
        return decimated.map((page) => renderPage(page + 1));
    };

    const renderPage = (pageNum) => (
        <div
          key={`page_${pageNum}`}
          className={`${classes.paginationItem} ${
            currentPage === pageNum && classes.paginationItemActive
          }`}
          onClick={() => {
            window.scrollTo(0, 0);
            setCurrentPage(pageNum)
          }}
        >
          <span>
           {pageNum}
          </span>
        </div>
    );
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div
                className={`${classes.paginationArrow} ${classes.prev}`}
                onClick={() => {
                    if (currentPage > 1) {
                        window.scrollTo(0, 0);
                        setCurrentPage(currentPage - 1);
                    }
                }}
            >
                <Arrow />
            </div>
            {
                totalPages > 4 ? (
                    <Fragment>
                        {currentPage > 2 &&
                            <div 
                                onClick={() => {                                        
                                    window.scrollTo(0, 0);
                                    setCurrentPage(1);
                                }} 
                                className={`${classes.paginationItem} ${currentPage === 1 ? classes.paginationItemActive : ''}`}>
                                    <span>
                                        1
                                    </span>
                            </div>
                        }
                        {isNearToEnd() && <div className={classes.paginationItem}>...</div>}
                        {renderNumbers()}
                        {!isNearToEnd() && (
                            <div className={classes.paginationItem}>...</div>
                        )}
                        {currentPage < totalPages - 1 && (
                            <div onClick={() => { window.scrollTo(0, 0); setCurrentPage(totalPages)}} className={`${classes.paginationItem} ${currentPage === totalPages ? classes.paginationItemActive : ''}`}>
                                <span>
                                    {totalPages}
                                </span>
                            </div>
                        )}
                    </Fragment>
                    ) : (
                        new Array(totalPages).fill(null).map((_, index) => {
                            const page = index + 1;
                            const style = {
                            background:
                                currentPage === page
                                ? "var(--global-body-color)"
                                : "transparent",
                            };
                            return (
                                <div
                                    key={index}
                                    style={style}
                                    className={classes.paginationItem}
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        setCurrentPage(page);
                                    }}
                                >
                                    <span>
                                        {page}
                                    </span>
                                </div>
                            );
                        })
                    ) 
                }
            <div
                className={`${classes.paginationArrow} ${classes.next}`}
                onClick={() => {
                    if (currentPage < totalPages) {
                        window.scrollTo(0, 0);
                        setCurrentPage(currentPage + 1)
                    }
                }}
            >
                <Arrow />
            </div>
        </div>
    );
}

export default Pagination;