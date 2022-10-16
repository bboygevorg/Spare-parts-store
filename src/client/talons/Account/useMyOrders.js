import { useEffect, useCallback, useState } from 'react'
import { useAwaitQuery } from 'talons/useAwaitQuery'
import { storage, clearStorage } from "helper/utils";

export const useMyOrders = props => {
    const { getOrdersQuery, setOpenedOrder } = props
    const fetchOrders = useAwaitQuery(getOrdersQuery);
    const [orders, setOrders] = useState([])
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const customerToken = typeof window !== "undefined" && localStorage.getItem('customerToken');

    useEffect(() => {
        handleFetchOrders();
        return () => {
            if(storage("changedOrderId")) {
                clearStorage("changedOrderId");
            }
        }
    }, []);

    useEffect(() => {
        handleFetchOrders();
    }, [currentPage]);

    const handleFetchOrders = () => {
        const pageSize = 10;
        setIsFetching(true);
        fetchOrders({
            variables: {
                customerToken,
                pageSize,
                currentPage
            },
            fetchPolicy: "network-only",
        }).then(res => {
            setTotalPages(Math.ceil(res.data.getOrdersPaginated.totalCount / pageSize))
            setOrders(res.data.getOrdersPaginated.items);
            setIsFetching(false);
        });
    }

    const getOrderDetails = useCallback((id) => {
        const order = orders.find(e => e.id === id)
        setOpenedOrder(order || {})
    }, [orders])
    
    return {
        orders: orders || [],
        getOrderDetails,
        loading: isFetching,
        currentPage,
        setCurrentPage,
        totalPages
    }
}