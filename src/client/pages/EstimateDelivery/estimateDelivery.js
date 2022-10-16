import React, { useEffect }  from "react";
import { withRouter, useHistory } from "react-router-dom";
import { mergeClasses } from "helper/mergeClasses";
import defaultClasses from './estimateDelivery.css';
import DeliveryPrice from 'components/DeliveryPrice';
import Head from "components/Head";
import get from "lodash/get"
import { useSelector } from 'react-redux';
import { codeSplitter } from 'components/Link/link';
import { STATIC_DESCRIPTION } from 'conf/consts';

const EstimateDelivery = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const localeId = useSelector(state => state.language.currentLanguage);
    const history = useHistory();
    useEffect(() => {
      if(localeId && localeId !== "default") {
        history.replace(`${history.location.pathname}${codeSplitter(localeId)}`)
      }
    }, []);
    return (
      <div>
        <Head description={STATIC_DESCRIPTION}>Get delivery price</Head>
        <div className={classes.root}>
          <DeliveryPrice zipCode={get(props, "location.state.state.zipCode", "" )} />
        </div>
      </div>
    );
};
  
export default withRouter(EstimateDelivery);