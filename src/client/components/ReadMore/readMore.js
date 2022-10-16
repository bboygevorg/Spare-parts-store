import React, { useState, useMemo, useCallback }  from "react";
import { Link } from "react-scroll";
import Typo from "components/UI/Typo/index";
import classes from './readMore.css';
import useTranslation from 'talons/useTranslation';
import get from 'lodash/get';


const ReadMore = ( props ) => {
    const { product, descriptionHeight, currentLanguageName }  = props;
    const features = useMemo(() => Object.entries(get(product, `features_${currentLanguageName}`) || product.features), [product, currentLanguageName]);
    const [numberItemsShown, setNumberItemsShown] = useState(10);
    const __ = useTranslation();
    const featuresShown = useCallback(() =>
      features
        .sort()
        .slice(0, numberItemsShown)
        .map((feature, index) => (
          <div key={index} className={classes.feature}>
            <div className={classes.featureName}>
              {feature[0].split("_").join(" ")}
            </div>
            <div className={classes.values}>{feature[1]}</div>
          </div>
        )), [features, numberItemsShown]);
    const showMore = () => {
        setNumberItemsShown(numberItemsShown === 10 ? features.length : 10);
    };
      const desc = get(product, `description_${currentLanguageName}`) || product.description;
      const newDesc = desc ?  desc.replace(/{bs}/g, "<li>").replace(/{be}/g, "</li>") : ""; 
    return (
      <div id={props.id} className={classes.root}>
        {descriptionHeight > 240 ? (
          <div className={classes.description}>
            {product.description ? (
              <div>
                <h3 className={classes.title}>{__("Product description")}</h3>
                <p
                  className={classes.desc}
                  dangerouslySetInnerHTML={{
                    __html: newDesc,
                  }}
                >
                  {/* {product.description} */}
                </p>
                <Link to="product-description" smooth={true}>
                  <Typo
                    as="p"
                    variant="p"
                    font="condensed"
                    color="primary"
                    className={classes.readmore}
                  >
                    {__("READ LESS")}
                  </Typo>
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          className={
            descriptionHeight <= 240
              ? classes.onlySpecifications
              : classes.specifications
          }
        >
          <h3 className={classes.specifications_title}>{__("Features & Details")}</h3>
          {product.brand ? 
            <div className={classes.feature}>
              <div className={classes.featureName}>
                {__("Brand")}
              </div>
              <div className={classes.values}>{product.brand}</div>
            </div>
          : 
            null
          }
          {featuresShown()}
          {features.length > 10 && (
            <h2 onClick={showMore}>
              {numberItemsShown === 10 ? __("READ MORE") : __("READ LESS")}
            </h2>
          )}
        </div>
      </div>
    );
};

export default ReadMore;
