import React from "react";
import defaultClasses from "./productCarousel.css";
import Carousel from "react-multi-carousel";
// import algoliasearch from "algoliasearch/lite";
// import {mergeClasses} from "helper/mergeClasses";
// import {
//     CarouselProvider,
//     Slider,
//     ButtonBack,
//     ButtonNext,
// } from "pure-react-carousel";
// import Slide from "./slide";
import useWindowDimensions from "talons/useWindowDimensions";
// import ProductList from './productList';
import ShopCard from "./ShopCard";
import { NextArrow, PrevArrow } from "components/UI/MainSlider/MainSlider";
import "../../../../node_modules/react-multi-carousel/lib/styles.css";
import { Block } from "pages/Common/TopBlocks";
import ProductCard from "components/ProductCard"
const types = {
  shop: <ShopCard />,
  product: <ProductCard 
    classes={{
      productBox: defaultClasses.productBox, 
      positionedProductBox: defaultClasses.positionedProductBox
    }}/>,
  blocks: <Block />,
};

const renderSlideByType = (type) => types[type] || types.product;

const responsive = (width) => { 
  return {
  desktop: {
    breakpoint: { max: 3000, min: 1640 },
    items: 4,
    // paritialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1640, min: 484 },
    items: width > 1300 && width < 1640 ? 3 : width < 900 ? 1 : 2,
    // paritialVisibilityGutter: 0,
  },
  mobile: {
    breakpoint: { max: 484, min: 0 },
    items: 1,
    paritialVisibilityGutter: width < 335 ? 40 : width < 350 ? 50 : width < 385 ? 70 : width < 410 ? 90 : width < 435 ? 100 : width < 460 ? 125 : 150,
  },
}
};

const visibleSlides = (width) => {
  switch (true) {
    case width < 1641 && width >= 1300:
      return {
        count: 3,
      };
    case width < 1300 && width >= 900:
      return {
        count: 2,
      };
    case width < 900:
      return {
        count: 1,
      };
    default:
      return {
        count: 4,
      };
  }
};

const ProductCarousel = (props) => {
  // items,
  // cardType = "shop", "product"
  // cardWidth shop = , product = 417
  // orientation
  // typeCenter

  const { items = [], cardType, cardWidth, isFavorites, isLastViewed, isFeatured } = props;
  // // const [hits, setHits] = useState();
  const { width } = useWindowDimensions();
  // // const fetchHits = useCallback(() => {
  // //   index
  // //     .search("Form")
  // //     .then((res) => setHits(res.hits))
  // //     .catch((err) => setHits(err.message));
  // // }, [setHits]);
  // // useEffect(() => {
  // //   fetchHits();
  // // }, []);

  // const classes = mergeClasses(defaultClasses, props.classes);
  // const {totalSlides = 20} = props;
  // const sliderContent =
  //   products && products.length
  //     ? products.map((product) => (
  //         <Slide key={product.product_id} item={product} />
  //       ))
  //     : hits && hits.length
  //     ? hits.map((product) => (
  //         <Slide key={product.product_id} item={product} />
  //       ))
  //     : null;
  // const itemLength = products && products.length || hits && hits.length

  // if(visibleSlides(width).count >= items.length) {
  //   const items = products && products.length ? products : hits
  //   return <ProductList items = {items}/>
  // }

  const renderSliderContent = () => {
    return items.map((el, index) =>
    { 
      return React.cloneElement(renderSlideByType(cardType), {
        product: el,
        key: index,
        isFavorites,
        isLastViewed,
        isFeatured
      });}
    );
  };

  // useEffect(() =>{
  //     const el = document.querySelector('.slick-track');
  //     if(el) {

  //         el.style.width = el.getBoundingClientRect().width + items.length * 55;
  //         console.log('wiiiiidth' ,el.style.width);
  //     }
  //     console.log(document.querySelector('.slick-track'));

  // })
  if (!items.length || width === undefined) {
    return null;
  }
  return (
    <div
      className={defaultClasses.sliderWrapper}
      style={{
        margin: "0 auto",
        width: width < 484 ? "100%" : `calc(${(visibleSlides(width).count * cardWidth)}px + 62px)`
      }}
    >
      {/*<CarouselProvider*/}
      {/*    className={classes.carouselWrapper}*/}
      {/*    naturalSlideWidth={400}*/}
      {/*    naturalSlideHeight={400}*/}
      {/*    totalSlides={items.length}*/}
      {/*    orientation="horizontal"*/}
      {/*    dragStep={1}*/}
      {/*    infinite={true}*/}
      {/*    visibleSlides={visibleSlides(width).count}*/}
      {/*>*/}
      {/*    <Slider className={classes.products}>{*/}
      {/*        renderSliderContent()*/}
      {/*    }</Slider>*/}
      {/*    <div className={classes.buttons} style={{top: `calc(50% - ${typeCenter}px`}}>*/}
      {/*        <ButtonBack className={classes.backBtn}>*/}
      {/*            <span className={classes.leftIcon}></span>*/}
      {/*        </ButtonBack>*/}
      {/*        <ButtonNext className={classes.nextBtn}>*/}
      {/*            <span className={classes.rightIcon}></span>*/}
      {/*        </ButtonNext>*/}
      {/*    </div>*/}

      {/*</CarouselProvider>*/}
      {/* <MainSlider
        slidesToShow={
          visibleSlides(width).count >= items.length
            ? items.length
            : visibleSlides(width).count
        } */}
      {/* // centerMode={true}
        // centerPadding={"60px"}
        // infinite={false}
        // arrows={width < TABLET_SIZE ? false : true}
        // variableWidth={true}
        // centerMode={width >= TABLET_SIZE ? false : true}
      // > */}
      {/* //   {renderSliderContent()}
      // </MainSlider> */}
      {items.length === 1 ?
        renderSliderContent()
      :
        <Carousel
          ssr
          partialVisible
          deviceType={"desktop"}
          arrows={true}
          // draggable={false}
          itemClass={defaultClasses.sliderItem}
          removeArrowOnDeviceType={["mobile"]}
          responsive={responsive(width)}
          customRightArrow={<NextArrow />}
          customLeftArrow={<PrevArrow />}
        >
          {renderSliderContent()}
        </Carousel>
      }
    </div>
  );
};

// const CustomRightArrow = ({ onClick, ...rest }) => {
//   const {
//     onMove,
//     carouselState: { currentSlide, deviceType },
//   } = rest;
//   // onMove means if dragging or swiping in progress.
//   return <button onClick={() => onClick()}>sdfsafsa s</button>;
// };
{/* <Carousel customRightArrow={<CustomRightArrow />} />; */}

export default ProductCarousel;
