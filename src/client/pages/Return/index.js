import React from 'react';
import AppWrapper from "components/UI/AppWrapper";
import Typo from "components/UI/Typo/index";
import Head from "components/Head";
import classes from './return.css';
import useTranslation from 'talons/useTranslation';
import { STATIC_DESCRIPTION } from 'conf/consts';

const Return = () => {
    const __ = useTranslation(); 
    return (
        <div style={{ marginBottom: "-50px" }} className={classes.root}>
            <Head description={STATIC_DESCRIPTION}>{__("Return")}</Head>
            <div className={classes.overlay}></div>
            <AppWrapper>
                <Typo variant="h1" className={classes.pageTitle}>
                    {__("RETURN POLICY")}
                </Typo>
                <div className={classes.returnWrapper}>
                    <div className={classes.returnsText}>
                        <Typo as="p" variant="p" font="regular">{__("The BuildClub does not charge any fees for returns. Returns are subject to the return policies of the sourcing supplier. Please see the following links for additional details.")}</Typo>
                        <br/>
                        <Typo as="p" variant="p" font="regular">{__("BuildClub delivery costs (if any) may not be refundable, depending on the reason for the return. Please contact The BuildClub customer service to arrange a return.")}</Typo>
                        <br/>
                        {/* <a href="https://www.homedepot.com/c/Return_Policy" target='blank'>Home Depot Return Policy</a>
                        <a href="https://www.lowes.com/l/returns-policy.html" target='blank'>Lowes Return Policy</a>
                        <a href="https://www.ferguson.com/content/customer-service/return-policy" target='blank'>Ferguson Return Policy</a>
                        <a href="https://www.gemaire.com/returns/" target='blank'>Gemaire Return Policy</a>
                        <a href="https://www.acehardware.com/customer-service" target='blank'>Ace Hardware Return Policy</a>
                        <a href="https://www.walterswholesale.com/free-returns" target='blank'>Walters Wholesale Electric Return Policy</a> */}
                    </div> 
                </div>
            </AppWrapper>
        </div>
    );
};

export default Return;