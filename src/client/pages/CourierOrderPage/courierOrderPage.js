import React, { useMemo } from 'react';
import CourierOrder from 'components/CourierOrder';

const CourierOrderPage = () => {
    const type = useMemo(() => {
        if(typeof window !== "undefined") {
            return new URLSearchParams(window.location.search).get("type");
        }
    }, []);

    return (
        <CourierOrder selectedType={type}/>
    );
};

export default CourierOrderPage;