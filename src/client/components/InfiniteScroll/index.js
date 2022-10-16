import ProductCard from "components/ProductCard";
import React, { useEffect, useState } from "react";
import { connectInfiniteHits, Configure, connectStats, connectPagination } from 'react-instantsearch-dom';
import { useSelector, useDispatch } from "react-redux";
import classes from './infiniteScroll.css';
import { setPaginationData, setHitsPerPage } from "actions/categories";
import Loading from 'components/Loading';
import HelpModal from "components/Algolia/ProductList/HelpModal/index";
import Modal from "components/Modal/modal";
import { ATTRIBUTES } from "conf/consts";
import useCurrentLanguage from "talons/useCurrentLanguage";

const Stats = connectStats(({ nbHits }) => {
    const searchRefinement = useSelector(
		(state) => state.categories.searchRefinement
    );
  
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

const InfiniteScroll = ({
	hits,
	// hasPrevious,
	// refinePrevious,
	// hasMore,
	// refineNext,
	large,
	searching,
	setScrolling
}) => {
    const [next, setNext] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
    const instantChecked = useSelector(state => state.categories.instantChecked);
    const catalogChecked = useSelector(state => state.categories.catalogChecked);
    const isGoogleBot = useSelector(state => state.firebase.isGoogleBot);
	const { currentLanguageName } = useCurrentLanguage();

    useEffect(() => {
		const destroyListener = createScrollStopListener(window, () => {
			setScrolling(false);
		});
		return () => destroyListener(); // when App component is unmounted
    }, []);

	const createScrollStopListener = (element, callback, timeout) => {
		let removed = false;
		let handle = null;
		const onScroll = () => {
			setScrolling(true);
			if (handle) {
				clearTimeout(handle);
			}
			handle = setTimeout(callback, timeout || 100); // default 200 ms
		};
		element.addEventListener('scroll', onScroll);
		return () => {
			if (removed) {
				return;
			}
			removed = true;
			if (handle) {
				clearTimeout(handle);
			}
			element.removeEventListener('scroll', onScroll);
		};
	};

	let observer = null;
    const onSentinelIntersection = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setNext(true);
            }
            else {
                setNext(false);
            }
        });
    };

    useEffect(() => {
        observer = new IntersectionObserver(onSentinelIntersection);
        observer.observe(document.querySelector(".ais-InfiniteHits-sentinel"));
        return () => {
            observer.disconnect();
        };
    }, [next]);

    return (
        <div className={`${classes.productListWrapper}`}>
            <Configure hitsPerPage={12} facets={["*"]} filters={instantChecked ? `in_stock:true AND delivery_option:0${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}` : `in_stock:true${catalogChecked ? "" : ' AND bc_categories.lvl0:"building supplies"'}`} clickAnalytics enablePersonalization={true} analytics={isGoogleBot ? false : true} attributesToRetrieve={[...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]}/>
            <Stats/>
            <div className={classes.productList}>
				{hits.map(hit => (
					<ProductCard 
						key={hit.objectID} 
						product={hit}
						large={large}
						onClickHelpButton={() => setIsOpen(true)}
					/>
				))}
				{searching ? <div className={classes.loadingWrapper}><Loading/></div> : null}
            </div>
            <div className="ais-InfiniteHits-sentinel"></div>
            <Pagination next={next} />
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

export default connectInfiniteHits(InfiniteScroll);
