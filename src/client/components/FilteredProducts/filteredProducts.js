import React from 'react'
import ProductCarousel from '../ProductCarousel';
import {useLastViewed} from 'talons/FilteredProducts/useLastViewed';
import { useFeatured } from 'talons/FilteredProducts/useFeatured';
import SectionBlock from "components/UI/SectionBlock";
import useWindowDimensions from "talons/useWindowDimensions";

const Hits = ({products, isInLastViewed}) => {
  const {width} = useWindowDimensions()
  const content = isInLastViewed ?
    (
      <SectionBlock title={"LAST VIEWED ITEMS"}>
        <ProductCarousel
          items={products}
          cardType={"product"}
          cardWidth={width < 900 ? 385 : 417}
          typeCenter={46}
          isLastViewed={true}
        />
      </SectionBlock>
    ) :
    (
      <SectionBlock title={"FEATURED PRODUCTS"}>
        <ProductCarousel
          items={products}
          cardType={"product"}
          cardWidth={width < 900 ? 385 : 417}
          typeCenter={46}
          isLastViewed={true}
          isFeatured={true}
        />
      </SectionBlock>
    )
    ;
    return <div>{content}</div>
}

const FilteredProducts = (props) => {
    const {isLastViewed, isFeatured} = props
    const {products} = isLastViewed ? useLastViewed() : useFeatured();

    return <Hits products={products} isInLastViewed={isLastViewed} isFeatured={isFeatured}/>
}


export default FilteredProducts
