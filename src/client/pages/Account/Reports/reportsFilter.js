import React from 'react';
import classes from './reportsFilter.css';
import DatePicker from 'components/DatePicker';
import JobAddressSelect from './jobAddressSelect';
import Button from 'components/Button';

const ReportsFilter = (props) => {
    const {
        __,
        range,
        setRange,
        selectedAddresses,
        setSelectedAddresses,
        handleGetReports,
        addresses,
        resetAllFilters
    } = props;

    if(!addresses.length) {
        return null;
    }

    return (
        <div className={classes.root}>
            <div className={classes.filters}>
                <DatePicker __={__} range={range} setRange={setRange}/>
                <JobAddressSelect
                    __={__}
                    addresses={addresses}
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                />
            </div>
            <Button
                label="FILTER"
                classes={{button_primary: classes.filterBtn}}
                onClick={() => handleGetReports()}
            />
            <Button
                type="bordered"
                label="RESET ALL"
                classes={{button_bordered: classes.resetFilterBtn}}
                onClick={resetAllFilters}
                disabled={!selectedAddresses.length && !range.from && !range.to}
            />
        </div>
    );
};

export default ReportsFilter;