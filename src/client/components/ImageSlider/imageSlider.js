import React, {useEffect, useState} from 'react';
import defaultClasses from './imageSlider.css';
import { mergeClasses } from 'helper/mergeClasses';
import { CarouselProvider, Slider, Slide, Image, DotGroup, Dot, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { GET_SLIDER_IMAGES } from "api/query";
import { useQuery } from  "@apollo/react-hooks";
import useWindowDimensions from "talons/useWindowDimensions";
import { useSelector } from 'react-redux';
import Link from "components/Link";

const ImageSlider = ( props ) => {
    const { width } = useWindowDimensions();
    const firebaseValues = useSelector(state => state.firebase.config);
    const title = firebaseValues && firebaseValues.home_screen_banner_title;
    const titleEnabled = firebaseValues && firebaseValues.home_screen_banner_enabled;
    const { data } = useQuery(GET_SLIDER_IMAGES, {variables: {sliderId: width <= 784 ? 2 : 1}});
    const classes = mergeClasses(defaultClasses, props.classes);
    const [isMouseOn, setIsMouseOn] = useState(false);
    const [sliders, setSliders] = useState([]);

    const createMarkup = (content) => {
	    return { __html: content };
    }
    
    useEffect(() => {
    	if (data) {
		    let newSlider = [...data.getSlider.slides]
		    setSliders(newSlider.reverse())
	    }
    }, [data])

    return ( data && firebaseValues ?
            <CarouselProvider
                totalSlides={sliders.length}
                naturalSlideHeight={1690}
                naturalSlideWidth={537}
                orientation='horizontal'
                dragStep={1}
                infinite={true}
                className={classes.myCarousel}
                touchEnabled={sliders.length === 1 ? false : true}
                isPlaying={isMouseOn ? false : true}
                interval={4000}
                onMouseEnter={() => setIsMouseOn(true)}
                onMouseLeave={() => setIsMouseOn(false)}
            >
                <Slider 
                    className={classes.slider}
                >
                    { sliders.map((slide, index) =>
	                    <Link to={`${slide.title === 'Free Gas' ? '/free_gas' : ''}`} key={index}>
                        <Slide  
	                          className={classes.currentSlide}
                            index={index}
                        >
                            <Image
                                className={classes.image} 
                                src={slide.imageUrl} 
                            />
                                <div className={classes.slideContent}>
                                    {titleEnabled && 
                                        <div className="limitedTime">
                                            <p>{title}</p>
                                        </div>
                                    }
                                    <div className={classes.contentHtml} dangerouslySetInnerHTML={createMarkup(slide.content)} />
                                </div>
                        </Slide>
	                    </Link>
                    )}
                </Slider>
                <div className={classes.dots} >
                    <DotGroup className={classes.dotGroup} renderDots={(dotGroup) => 
                            Array(dotGroup.totalSlides).fill("").map((_, index) => 
                                <Dot key={index} slide={index} className={classes.mydot}/>
                            )
                    } />
                </div>
                <div className={classes.buttons}>
                    <ButtonBack className={classes.backBtn}>
                        <span className={classes.leftIcon}></span>
                    </ButtonBack>
                    <ButtonNext className={classes.nextBtn}>
                        <span className={classes.rightIcon}></span>
                    </ButtonNext>
                </div>
            </CarouselProvider>
            :
            <div className={classes.emptySlider}></div>
    );
};

export default ImageSlider;