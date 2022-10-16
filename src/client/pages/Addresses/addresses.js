import React from 'react';
import { withRouter } from "react-router-dom";
import defaultClasses from './addresses.css';
import JobAddresses from 'components/JobAddresses';
import Head from 'components/Head';
import { STATIC_DESCRIPTION } from 'conf/consts';

const Addresses = () => {
    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                Addresses
            </Head>
            <div className={defaultClasses.root}>
                <JobAddresses />
            </div>
        </div>
    );
};

export default withRouter(Addresses);