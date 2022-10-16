import React , {Fragment} from 'react';
import Typo from 'ui/Typo';
// import { getArrivalDate } from 'helper/utils';
import classes from './estimateDeliveryTime.css';
import find from 'lodash/find';
import Button from 'components/Button';
import dayjs from 'dayjs';
import useCalculateNotes from 'talons/useCalculateNotes';
import { VALID_KEY } from 'conf/consts';
const isToday = require("dayjs/plugin/isToday");
const isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow)
dayjs.extend(isToday);

const EstimateDeliveryTime = (props) => {
    const { data, clearFields, startShopping } = props; 
    const { notes } = useCalculateNotes();
    const resObj = find(data.estimateShippingByZipAndType, { carrierCode : VALID_KEY});  
    const estimateDay = dayjs.unix(data.estimateDeliveryTimeByAddress)
    // .format('dddd hh:mm A');
    const dayString = estimateDay.isToday()
      ? "Today"
        : estimateDay.isTomorrow()  ? "Tomorrow" : ""
    const timeString = `${estimateDay.format("hh:mm A")} - ${estimateDay.add(30, 'minute').format(
      "hh:mm A"
    )}`;
    return (
      <div className={classes.rootWrapper}>
        <img className={classes.priceIcon} src="/images/price.png" />
        {!resObj ? (
          <Typo variant="p" className={classes.notSupportedZip}>
            Oops, Currently we operate in LA County only
          </Typo>
        ) : (
          <Fragment>
            {" "}
            <div className={classes.getPrice}>
              <Typo as="p" variant="p" className={classes.priceTitle}>
                Delivery price to your location
              </Typo>
              <Typo
                as="p"
                variant="p"
                className={classes.priceValue}
              >{`$${resObj.price.toFixed(2)}`}</Typo>
            </div>
            <div className={classes.getTime}>
              <Typo as="p" variant="p" className={classes.timeTitle}>
                Estimated arrival time
              </Typo>
              <Typo as="p" variant="p" className={classes.timeValue}>
                {dayString}
                <br />
                {timeString}
                {/* {estimateDay} */}
              </Typo>
            </div>{" "}
            <div className={classes.rulesWrapper}>
              {notes.map((el, idx) => (
                <Typo variant="p" font="regular" key={idx}>
                  {el}
                </Typo>
              ))}

              {/* <Typo variant="p" font="regular">
                * 15% restocking fee, plus return shipping charged for returns.
              </Typo>
              <Typo variant="p" font="regular">
                * All orders after 3pm will be delivered next morning. Any order
                may be canceled at any time by the BuildClub.
              </Typo> */}
            </div>
          </Fragment>
        )}

        <div
          className={`${classes.buttons} ${
            !resObj ? classes.buttonsAbsolute : ""
          }`}
        >
          <Button
            onClick={startShopping}
            label="START SHOPPING"
            classes={{
              button_primary: classes.okButton,
              button_label: classes.okButtonLabel,
            }}
          />
          <Button
            classes={{
              button_bordered: classes.locationButton,
              button_label: classes.locationButtonLabel,
            }}
            type="bordered"
            label="TRY ANOTHER LOCATION"
            onClick={clearFields}
          />
        </div>
      </div>
    );
};

export default EstimateDeliveryTime;