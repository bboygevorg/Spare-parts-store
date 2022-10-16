import { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import useTranslation from 'talons/useTranslation';
import useWindowDimensions from 'talons/useWindowDimensions';
import { useDispatch } from 'react-redux';
import { actions } from "store/actions/signIn";
import { GET_REPORTS, COMPANY_GET_ADDRESSES } from 'api/query';
import axios from 'axios';

export const useReports = () => {
    const csvRef = useRef();
    const __ = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [range, setRange] = useState({ from: "", to: ""});
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [reports, setReports] = useState([]);
    const [view, setView] = useState("reports");
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [grandTotal, setGrandTotal] = useState();
    const [addresses, setAddresses] = useState([]);
    const [csvData, setCsvData] = useState("");
    const [currentFilters, setCurrentFilters] = useState({range: {from: "", to: ""}, addresses: []});
    const [previousUrl, setPreviousUrl] = useState("");
    const [isFetchingCsvData, setIsFetchingCsvData] = useState(false);
    const { width } = useWindowDimensions();
    const getReports = useAwaitQuery(GET_REPORTS);
    const getJobAddresses = useAwaitQuery(COMPANY_GET_ADDRESSES);
    const customerToken = typeof window !== "undefined" ? localStorage.getItem("customerToken") : "";

    const handleGetReports = useCallback(async (resetFilters) => {
        setIsFetching(true);
        try {
            const formattedFrom = range.from ? new Date(range.from).toISOString().split('T')[0] + " 00:00:00" : "";
            const formattedTo = range.to ? new Date(range.to).toISOString().split('T')[0] + " 23:59:59" : "";
            const pageSize = 10;
            let ids = [];
            selectedAddresses.map(el => {
                const arr = el.id.split(",").map(el => parseInt(el));
                ids = [...ids, ...arr];
            });
            const res = await getReports({
                variables: {
                    customerToken,
                    pageSize,
                    currentPage: !resetFilters ? currentPage : 1,
                    dateRange: {
                        from: !resetFilters ? formattedFrom : "",
                        to: !resetFilters ? formattedTo : ""
                    },
                    shippingAddressIds: !resetFilters ? ids : []
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetOrderReport) {
                setCurrentFilters({ range: { from: range.from || "", to: range.to || "" }, addresses: selectedAddresses});
                setGrandTotal(res.data.companyGetOrderReport.grandTotal);
                setTotalPages(Math.ceil(res.data.companyGetOrderReport.totalCount / pageSize))
                setReports(res.data.companyGetOrderReport.items);
                setIsFetching(false);
            }
        } catch (err) {
            setIsFetching(false);
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }, [range, customerToken, currentPage, actions, selectedAddresses]);

    const handleGetAddresses = useCallback(async () => {
        try {
            const res = await getJobAddresses({
                variables: {
                    customerToken
                },
                fetchPolicy: "no-cache"
            });
            if(res && res.data && res.data.companyGetAddresses) {
                setAddresses(res.data.companyGetAddresses);
            }
        } catch (err) {
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            if(code === 0) {
                dispatch(actions.signOut());
                history.replace("/signin", { state: { previousPath: history.location.pathname }});
            }
        }
    }, [customerToken, actions]);


    const createExportCSVUrl = useCallback(() => {
        let backendUrl = process.env.BACKEND_URL.split("/");
        backendUrl.pop();
        backendUrl = backendUrl.join("/");
        let ids = [];
        currentFilters.addresses.map(el => {
            const arr = el.id.split(",").map(el => parseInt(el));
            ids = [...ids, ...arr];
        });
        const url =  `${backendUrl}/company-order-report-csv?${range.from ? `&dateFrom=${new Date(range.from).toISOString().split('T')[0]+ " 00:00:00"}` : ""}${currentFilters.range.to ? `&dateTo=${new Date(currentFilters.range.to).toISOString().split('T')[0]+ " 23:59:59"}` : ""}${ids.length ? `&shippingAddressIds=%5B${ids.join(",")}%5D` : ""}`;
        if(csvData && previousUrl === url) {
            csvRef.current.link.click();
            return;
        }
        setIsFetchingCsvData(true);
        axios.post(url, {}, { 'headers': {
                'token': customerToken
            }}).then(res => {
            if(res && res.data) {
                setPreviousUrl(url);
                setIsFetchingCsvData(false);
                setCsvData(res.data);
                csvRef.current.link.click();
            }
        }).catch(err => {
            setIsFetchingCsvData(false);
            console.log('err', err);
        })
    }, [customerToken, currentFilters, csvData, previousUrl]);

    useEffect(() => {
        handleGetAddresses();
    }, []);

    useEffect(() => {
        handleGetReports();
    }, [currentPage]);

    const resetAllFilters = () => {
        if(currentPage === 1) {
            handleGetReports(true);
        }
        setSelectedAddresses([]);
        setRange({ from: "", to: ""});
        setReports([]);
        setCurrentPage(1);
        setTotalPages();
    }

    return {
        __,
        width,
        view,
        setView,
        reports,
        range,
        setRange,
        selectedAddresses,
        setSelectedAddresses,
        handleGetReports,
        isFetching,
        addresses,
        totalPages,
        currentPage,
        setCurrentPage,
        resetAllFilters,
        grandTotal,
        csvData,
        isFetchingCsvData,
        createExportCSVUrl,
        csvRef
    }
};