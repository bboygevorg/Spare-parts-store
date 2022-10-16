import React, { useEffect, useCallback, useState } from 'react';

import classes from './productSlider.css';
import GalleryItem from '../GalleryAlgoria/item';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import { number } from 'prop-types';
import { algoliaIndex } from "conf/main";
import { ATTRIBUTES } from 'conf/consts';
import useCurrentLanguage from 'talons/useCurrentLanguage';

// Make this false, and it will allow to choose variants and addToCart
const showColorsOnly = true;

const ProductSlider = (props) => {
    const {  visibleItems } = props;
    const [hits, setHits] = useState();
	const { currentLanguageName } = useCurrentLanguage();

    useEffect(() => {
        fetchHits();
    }, []);

    const fetchHits = useCallback(async () => {
        const { hits } = await algoliaIndex.search("Form", {
            attributesToRetrieve: [...ATTRIBUTES, `description_${currentLanguageName}`, `name_${currentLanguageName}`, `features_${currentLanguageName}`]
        });
        setHits(hits);
    }, [setHits]);
 

    return hits ? (
        <div className={classes.root}>
            <CarouselProvider naturalSlideWidth={310} naturalSlideHeight={589} totalSlides={hits.length} visibleSlides={visibleItems} >
                <Slider >
                {hits.map((hit, index) => 
                    <Slide index={index} key={hit.product_id} innerClassName={classes.slide}>
                        <GalleryItem showColorsOnly={showColorsOnly} hit={hit} />
                    </Slide>
                )}
                </Slider>
            </CarouselProvider>
        </div>
    ) : null;
}

ProductSlider.propTypes = {
    id: number,
    pageSize: number,
    visibleItems: number
}

export default ProductSlider;