import React, { useRef, useState } from 'react';
import classes from './datePicker.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import "../../../../node_modules/react-day-picker/lib/style.css"
import Calendar from 'icons/account/Calendar';
import Typo from 'ui/Typo';
import useOnClickOutside from 'talons/useOnClickOutside';

const modifiersStyles = {
    selected: {
        background: 'transparent linear-gradient(271deg, #FFC400 0%, #FFDC00 100%) 0% 0% no-repeat padding-box',
        color: '#1D1D1B',
        padding: '11px 11px 9px !important',
        margin: '5.5px',
        borderRadius: '6px !important',
        maxWidth: '25px',
        height: '42px',
        width: '42px',
        boxSizing: 'border-box',
        outline: "none"
    }
};

export const handleGetDayString = (day) => {
    const stringDay = day.toDateString().split(" ");
    const value = `${stringDay[2]} ${stringDay[1]} ${stringDay[3]}`;
    return value;   
}

const DatePicker = (props) => {
    const { __, range, setRange } = props;
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef();
    useOnClickOutside(rootRef, () => {if(isOpen) setIsOpen(!isOpen)});

    const handleStartDayClick = (day, { disabled }) => {
        if(disabled) {
            return;
        }
        const newRange = DateUtils.addDayToRange(day, { from: range.from, to: range.to });
        setRange(newRange);
    }

    const modifiers = { start: range.from, end: range.to };

    return (
        <div ref={rootRef} className={classes.root}>
            <div className={classes.dateBlock} onClick={() => setIsOpen(!isOpen)}>
                <Calendar/>
                <Typo as="p" variant="px" font="light" className={classes.selectedRange}>{range.from ? handleGetDayString(range.from) : __("from")} - {range.to ? handleGetDayString(range.to) : __("to")}</Typo>
            </div>
            {isOpen ? 
                <DayPicker 
                    onDayClick={handleStartDayClick}
                    selectedDays={[range.from, { from: range.from, to: range.to }]}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className={classes.dayPicker}
                    fromMonth={new Date("2017")}
                    toMonth={new Date()}
                />
            :
                null
            }
        </div>
        
    );
};

export default DatePicker;