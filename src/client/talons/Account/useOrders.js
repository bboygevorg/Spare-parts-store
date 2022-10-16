import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import useWindowDimensions from 'talons/useWindowDimensions'
import { MOBILE_SIZE } from 'conf/consts'
import useTranslation from 'talons/useTranslation';
import isEmpty from 'lodash/isEmpty';

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const useOrders = () => {
    const {width} = useWindowDimensions();
    const __ = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [view, setView] = useState('orders');
    const [section, setSection] = useState("all");
    const [openedOrder, setOpenedOrder] = useState({})
    const { companyRole } = useSelector(state => state.signin.customerData);
    const { customerData } = useSelector(state => state.signin);
    
    const isShopper = useMemo(() => {
        if(companyRole) {
            return companyRole === 1 ? true : false;
        }
    }, [companyRole]);
    
    const isOwnerWithoutCompany = useMemo(() => {
        return (companyRole === 4 && !isEmpty(customerData) && !customerData.companyName) ? true : false
    }, [companyRole, customerData]);

    useEffect(() => {
        if(width <= MOBILE_SIZE) {
            setIsMobile(true);
        } 
    }, [width]);

    useEffect(() => {
        if(companyRole === 1 || isOwnerWithoutCompany) {
            setSection("my");
        }
    }, [companyRole, isOwnerWithoutCompany]);

    const dateFormat = useCallback((date) => {
        if(date) {
            const newDate = new Date(date.replace(/-/g, "/"))
            const monthIndex = newDate.getMonth()
            const month = months[monthIndex]
            const year = newDate.getFullYear().toString();
            return `${month}, ${year}`
        }
    })
    
    return {
        __,
        width,
        dateFormat,
        isShopper,
        isMobile,
        view,
        setView,
        section,
        setSection,
        openedOrder,
        setOpenedOrder,
        isOwnerWithoutCompany
    }
}