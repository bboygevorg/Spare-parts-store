import React, { useEffect, useState, useRef, Fragment } from 'react';
import useOnClickOutside from 'talons/useOnClickOutside';
import defaultClasses from './selectDeliveryTime.css';
import Arrow from "icons/Arrow";
import { mergeClasses } from 'helper/mergeClasses';
import useTranslation from 'talons/useTranslation';
import { getArrivalDate, toTimestamp, DATE_OPTIONS, dateWithTimeZone } from 'helper/utils';
import Typo from 'ui/Typo';

const SelectDeliveryTime = (props) => {
    const { items, date, setDate, setTime, isToday, timeToShow, setTimeToShow, range } = props;
    const [times, setTimes] = useState();
    const [isOpenDate, setIsOpenDate] = useState(false);
    const [isOpenTime, setIsOpenTime] = useState(false);
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootRefDate = useRef();
    const rootRefTime = useRef();
    const __ = useTranslation();
    useOnClickOutside(rootRefDate, () => {if(isOpenDate) setIsOpenDate(!isOpenDate)});
    useOnClickOutside(rootRefTime, () => {if(isOpenTime) setIsOpenTime(!isOpenTime)});
    const timeFormat = (first) => {
        const time1 = new Date(first * 1000).toLocaleString('en-US', DATE_OPTIONS).split(',');
        const time1ToShow = time1.length && time1[1];
        const newDate = new Date(first * 1000);
        const sumRange = newDate.setMinutes(newDate.getMinutes() + range/60); // timestamp
        const time2 = new Date(sumRange).toLocaleString('en-US', DATE_OPTIONS).split(',');
        const time2ToShow = time2.length && time2[1];
        return `${time1ToShow} - ${time2ToShow}`;
    }

    useEffect(() => {
        if(items.length) {
            setDate(items[0].date)
        }
    }, [items])

    useEffect(() => {
        if(date) {
            const times = items.find(d => d.date === date);
            if(!times.hours.length) {
                const dateChanged= date.replace(/\./g, '/').split("/");
                setTime(toTimestamp(dateWithTimeZone("America/Los_Angeles", dateChanged[2], parseInt(dateChanged[1])-1, dateChanged[0], 0, 0, 0)).toString());
            }
            else {
                setTimes(times.hours);
                setTimeToShow(timeFormat(times.hours[0]));
                setTime(times.hours[0]);
            }
        }
    }, [date])

    if(!items.length) {
        return false;
    }

    return (
        <Fragment>
            <div
                ref={rootRefDate}
                className={classes.root}
                onClick={() => setIsOpenDate(!isOpenDate)}
            >
                <div className={classes.mainDiv}>
                    <span>{isToday(date) ? __('Today') : getArrivalDate(date)}</span>
                    <span className={classes.arrow}>
                        {" "}
                        <Arrow />
                    </span>
                </div>
                <div 
                    className={isOpenDate ? classes.customOptionsOpen : classes.customOptionsHidden}
                >
                    {items.map((el, index) => {
                        if(date !== el.date) {
                            return (
                                <div className={classes.option} key={index} onClick={() => {setDate(el.date)}}>
                                    <span>{isToday(el.date) ? __('Today') : getArrivalDate(el.date)}</span>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
            {times && times.length  
                ?
                    <div
                        ref={rootRefTime}
                        className={classes.rootTime}
                        onClick={() => setIsOpenTime(!isOpenTime)}
                    >
                        <div className={classes.mainDiv}>
                            <span>{timeToShow}</span>
                            <span className={classes.arrow}>
                                {" "}
                                <Arrow />
                            </span>
                        </div>
                        <div
                            className={isOpenTime ? classes.customOptionsOpen : classes.customOptionsHidden}
                        >
                            {times.map((_, index) => {
                                if(timeToShow !== timeFormat(times[index])) {
                                    return (
                                        <div className={classes.option} key={index} onClick={() => {
                                                setTime(times[index]);
                                                setTimeToShow(timeFormat(times[index]))
                                            }}
                                        >
                                            <span>{timeFormat(times[index])}</span> 
                                        </div>
                                    )}
                                }
                            )}
                        </div>
                    </div>
                :
                    <Typo as="p" variant="p" font="regular" className={classes.deliveryTimeMessage}>{__("Products will be delivered during the day.")}</Typo>
            }
        </Fragment>
    );
};

export default SelectDeliveryTime;