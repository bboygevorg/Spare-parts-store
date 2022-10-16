import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryName, getTopCategoryUrl } from 'algolia/TopCategories/topCategories';
import Link from 'components/Link';
import Typo from 'ui/Typo';
import classes from './topCategoriesWithSubs.css';

const TopCategoriesWithSubs = () => {
    const firebaseValues = useSelector(state => state.firebase.config)
    const topCategories = firebaseValues && JSON.parse(firebaseValues.top_categories);
    return (
        <div className={classes.root}>
            {topCategories && topCategories.length ?
                topCategories.map((category, index) => (
                <Link key={index} to={getTopCategoryUrl(category)}>
                    <Typo as="p" variant="p" font="bold" className={classes.title}>
                        {getCategoryName(category)} 
                    </Typo>
                </Link>
            ))
            : null}
        </div>
    );
};

export default TopCategoriesWithSubs;