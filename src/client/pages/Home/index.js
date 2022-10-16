import React from 'react';
import classes from './home.css';
import { Helmet } from 'react-helmet';
import EstimateDeliveryCharge from '../EstimateDeliveryCharge';
import {InstantSearch   } from 'react-instantsearch-dom';

import Hits from "components/Algolia/ProductList"
const Home = () => {
    return (
        <div>
            <Helmet>
                <title>{'Home'}</title>
                <meta property="og:title" content={'Home'} />
            </Helmet>
            <div className={classes.body}>
                <div className={classes.content}>
                    <EstimateDeliveryCharge />
                </div>

                <div>

                    <h1>asdasdsadsad sad sa</h1>


                </div>
            </div>


        </div>
    );
}

export default Home;
