import React from 'react';
import { withRouter } from "react-router-dom";
import defaultClasses from './cart.css';
import MiniCart from 'components/MiniCart';
import Head from 'components/Head';
import { STATIC_DESCRIPTION } from 'conf/consts';

const Cart = () => {
    return (
        <div>
            <Head canonical="/cart/" description={STATIC_DESCRIPTION}>
                Cart
            </Head>
            <div className={defaultClasses.root}>
                <MiniCart />
            </div>
        </div>
    );
};

export default withRouter(Cart);