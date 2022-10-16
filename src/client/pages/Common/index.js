import React from "react";
import { withRouter } from "react-router";
import classes from "./common.css";
import trim from "helper/trim";
import ImageSlider from "components/ImageSlider";
import TopCategories from "components/Algolia/TopCategories";
import SectionBlock from "components/UI/SectionBlock";
import AppWrapper from "ui/AppWrapper";
import ProductCarousel from "components/ProductCarousel";
import useWindowDimensions from "talons/useWindowDimensions";
import Head from "components/Head";
import { BLOCKS } from "./TopBlocks";
// import ShopsWrapper from "./Shops";
import DownloadApp from 'components/DownloadApp';
import FilteredProducts from "components/FilteredProducts";
import { STATIC_DESCRIPTION } from 'conf/consts';

const Common = () => {
  const { width } = useWindowDimensions(); 
  return (
    <div>
      <Head 
        isHomepage={true} 
        description={STATIC_DESCRIPTION}
        canonical="/"
      >
        The Buildclub | Online Shopping | Same Day Delivery
      </Head>
      <div className={classes.root}>
        <div className={classes.content}>
          <AppWrapper className={classes.sliderWrapper}>
            {width <= 784 ? <DownloadApp /> : null}
            <ImageSlider />
          </AppWrapper>
          <SectionBlock title={""} classes={{main: classes.blocksWrapper}}>
            <ProductCarousel
              totalSlides={4}
              items={BLOCKS}
              cardType={"blocks"}
              cardWidth={width < 900 ? 385 : 403}
              typeCenter={46}
            />
          </SectionBlock>
          <AppWrapper> 
            <SectionBlock
              title={"top categories"}
              classes={{ main: classes.topCategories }}
            >
              <TopCategories />
            </SectionBlock>
            <FilteredProducts isFeatured={true} />
            {/* <SectionBlock title={"shops"}>
              <ShopsWrapper />
            </SectionBlock> */}
          </AppWrapper>
        </div>
      </div>
    </div>
  );
};

export const loadData = (store, req) => {
  const slug = trim(req.path, "/");
  console.log("slug", slug);
};

export default withRouter(Common);
