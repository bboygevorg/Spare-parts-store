import React from "react";
import classes from "./topBlocks.css";
import Typo from "ui/Typo";
import config from "../../../../config";
import useTranslation from 'talons/useTranslation';
import { useSelector } from 'react-redux';
import CourierDelivery from "components/CourierDelivery";
import FlatbedButton from "components/CourierDelivery/flatbedButton";

export const BLOCKS = [
  {
    img: "flatbedDelivery.jpeg",
    title: "Order courier title",
    desc: "Book one of our Vans for same day or scheduled delivery of your Building and Construction Materials.", 
    component: <CourierDelivery/>,
    type: "van"
  },
  {
    img: "vanDelivery.jpeg",
    title: "Order courier title",
    desc: "Book one of our Flatbed Trucks for same day or scheduled delivery of your Building and Construction Materials from any supplier to your job site.",
    component: <FlatbedButton/>,
    type: "flatbed"
  },
  {
    img: "delivery.png",
    title: "Immediate Delivery",
    desc: "Building materials delivered in about an hour, starting at $12",
  },
  // {
  //   img: "zip.png",
  //   title: "ENTER ZIP CODE FOR INSTANT DELIVERY QUOTE",
  //   desc: "Los Angeles County addresses only, during Beta", 
  //   component: <EstimateDeliveryCharge />,
  //   type: "zip"
  // },
  {
    img: "return.svg",
    title: "FREE RETURNS",
    desc:
      "The BuildClub does not charge any fees for a return.",
  }
];

export const Block = ({product}) => { 
  const __ = useTranslation();
  const firebaseValues = useSelector(state => state.firebase.config);
  const shipping_text = firebaseValues && firebaseValues.shipping_flat_rate_text;

  if(!product) {
    return ""
  }
  const { img, title, desc, component, type } = product
  const Component = () => component;
  return (
    <div className={classes.rootBlock}>
      <div className={classes.top}>
        <div className={classes.imgWrapper}>
          <img src={`${config.BASE_URL}images/${img}`} alt={title} className={type === "zip" ? classes.image : type === "van" || type === "flatbed" ? classes.courierImage : ""}/>
        </div>
        <Typo variant="h3" className={classes.customTitle}>
          {component && shipping_text && type === "zip" ? shipping_text : __(title)}
        </Typo>
        <Typo font="regular" className={`${classes.customDesc} ${type === "van" || type === "flatbed" ? classes.courierDesc : ""}`}>{__(desc)}</Typo>
      </div>
      {component && <Component />}
    </div>
  );
};

const TopBlocks = () => {
  return (
    <div className={classes.root}>
      {BLOCKS.map((block, index) => (
        <Block key={index} {...block} />
      ))} 
    </div>
  );
};

export default TopBlocks;
