import React from 'react'; 
import style from './mainSlider.module.css';

 function NextArrow({ onClick }) {
  return (
    <div onClick={onClick} className={style.arrowNext}>
      <span className={style.rightIcon} />
    </div>
  );
}

 function PrevArrow({ onClick }) {
  return (
    <div onClick={onClick} className={style.arrowPrev}>
      <span className={style.leftIcon} />
    </div>
  );
}

// const MainSlider = ({children, ...settings}) => {
//     return (
//         <Slider
//             {...defaultSettings}
//             {...settings}
//             // centerMode={true}
//             className={style.slider}
//             edgeFriction={0}
//             centerMode={true}
//             // centerPadding={}
//         >
//             {children}
//         </Slider>
//     );
// }

// const defaultSettings = {
//     infinite: true,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow/>,
//     prevArrow: <PrevArrow/>,
//     dotsClass: style.customSlickDotsWrapper,
// };

export { NextArrow, PrevArrow}
