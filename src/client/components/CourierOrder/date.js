import React, { useRef, useEffect, useState } from 'react';
import classes from './date.css';
import Typo from 'ui/Typo';
import Arrow from "icons/Arrow";
import useOnClickOutside from 'talons/useOnClickOutside';
import { getArrivalDate, isToday } from 'helper/utils';

const times = ["08:00 - 12:00 AM", "12:00 - 4:00 PM"];

const Date = props => {
    const { __, formik, values } = props;
    const refDate = useRef();
    const refTime = useRef();
    const [isOpenDate, setIsOpenDate] = useState(false);
    const [isOpenTime, setIsOpenTime] = useState(false);
    useOnClickOutside(refDate, () => {if(isOpenDate) setIsOpenDate(!isOpenDate)});
    useOnClickOutside(refTime, () => {if(isOpenTime) setIsOpenTime(!isOpenTime)});

    useEffect(() => {
        if(values.length) {
            formik.setFieldValue('day', values[0].date);
        }
    }, [values]);

    useEffect(() => {
        formik.setFieldValue('time', times[0]);
    }, []);

    return (
        <div className={classes.root}>
            <Typo as="h2" variant="h2">{__("WHEN?")}</Typo>
            <div className={classes.fields}>
                <div
                    ref={refDate}
                    className={classes.select}
                    onClick={() => setIsOpenDate(!isOpenDate)}
                >
                    <div className={classes.mainDiv}>
                        <span>{isToday(formik.values.day) ? __('Today') : getArrivalDate(formik.values.day)}</span>
                        <span className={classes.arrow}>
                            {" "}
                            <Arrow />
                        </span>
                    </div>
                    <div 
                        className={isOpenDate ? classes.customOptionsOpen : classes.customOptionsHidden}
                    >
                        {values.map((el, index) => {
                            if(formik.values.day !== el.date) {
                                return (
                                    <div className={classes.option} key={index} onClick={() => formik.setFieldValue('day', el.date)}>
                                        <span>{isToday(el.date) ? __('Today') : getArrivalDate(el.date)}</span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <div
                    ref={refTime}
                    className={classes.select}
                    onClick={() => setIsOpenTime(!isOpenTime)}
                >
                    <div className={classes.mainDiv}>
                        <span>{formik.values.time}</span>
                        <span className={classes.arrow}>
                            {" "}
                            <Arrow />
                        </span>
                    </div>
                    <div
                        className={isOpenTime ? classes.customOptionsOpen : classes.customOptionsHidden}
                    >
                        {times.map((time, index) => {
                            if(formik.values.time !== time) {
                                return (
                                    <div className={classes.option} key={index} onClick={() => formik.setFieldValue('time', time)}>
                                        <span>{time}</span> 
                                    </div>
                                )}
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Date;