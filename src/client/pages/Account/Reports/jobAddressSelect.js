import React, { useState, useRef } from 'react';
import classes from './jobAddressSelect.css';
import Typo from 'ui/Typo';
import Arrow from 'icons/Arrow';
import useOnClickOutside from 'talons/useOnClickOutside';
import JobAddress from './jobAddress';

const JobAddressSelect = (props) => {
    const { __, addresses, selectedAddresses, setSelectedAddresses } = props;
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef();
    useOnClickOutside(rootRef, () => {if(isOpen) setIsOpen(!isOpen)});

    return (
        <div ref={rootRef} className={classes.root}>
            <div className={`${classes.addressBlock} ${isOpen && classes.openedBlock}`} onClick={() => setIsOpen(!isOpen)}>
                <Typo as="p" variant="px" font="regular" className={classes.title}>{selectedAddresses.length ? `${__("Job address")} (${selectedAddresses.length})` : __("Job address")}</Typo>
                <div className={`${classes.arrowIcon} ${isOpen && classes.opened}`}>
                    <Arrow/>
                </div>
            </div>
            {isOpen 
            ?
                <div className={classes.list}>
                    {addresses.map(el => {
                        return (
                            <JobAddress key={el.id} address={el} selectedAddresses={selectedAddresses} setSelectedAddresses={setSelectedAddresses}/>
                        )
                    })}
                </div>
            :
                null
            }
        </div>
    );
};

export default JobAddressSelect;