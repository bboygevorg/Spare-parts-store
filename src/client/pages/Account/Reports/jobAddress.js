import React, { useCallback, useState, useEffect } from 'react';
import CheckBox from 'components/CheckBox';
import classes from './jobAddress.css';

const JobAddress = ({ address, selectedAddresses, setSelectedAddresses }) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const elem = selectedAddresses.find(item => item.id === address.id);
        if(elem) {
            setSelected(true);
        }
        else {
            setSelected(false);
        }
    }, [selectedAddresses, address]);


    const handleSetSelected = useCallback((address) => {
        let arr = [...selectedAddresses];
        if(arr.length) {
            const index = arr.findIndex(item => item.id === address.id);
            if(index !== -1) {
                arr.splice(index, 1);
            }
            else {
                arr.push(address);
            }
        }
        else {
            arr.push(address);
        }
        setSelectedAddresses(arr);
    }, [selectedAddresses]);

    return (
        <div className={classes.root}>
            <CheckBox
                label={address.address.split(",").join(", ")}
                value={selected}
                onChange={() => {
                    handleSetSelected(address);
                }}
                isCheckout={true}
            />
        </div>
    );
};

export default JobAddress;