import React, { useMemo } from 'react';
import Head from 'components/Head';
import Typo from 'ui/Typo';
import Tabs from '../tabs';
import Loading from 'components/Loading';
import BackStep from '../backStep';
import classes from './reports.css';
import { STATIC_DESCRIPTION } from 'conf/consts';
import AppWrapper from 'ui/AppWrapper';
import { useReports } from 'talons/Account/useReports';
import ReportsFilter from './reportsFilter';
import Pagination from 'components/Pagination';
import Report from './report';
import Export from 'icons/account/Export';
import { CSVLink } from "react-csv";

const Reports = () => {
    const { 
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
    } = useReports();

    const reportsContent = useMemo(() => {
        return  (
            <div className={classes.content}>
                <div className={classes.header}>
                    <Typo as="h2" variant="h2" className={classes.title}>{__("Reports")}</Typo>
                </div>
                <div className={classes.filter}>
                    <ReportsFilter
                        __={__}
                        range={range} 
                        setRange={setRange}
                        selectedAddresses={selectedAddresses}
                        setSelectedAddresses={setSelectedAddresses}
                        handleGetReports={handleGetReports}
                        addresses={addresses}
                        resetAllFilters={resetAllFilters}
                    />
                </div>
                 {!isFetching ? 
                    reports.length ? 
                        <div className={classes.reports}>
                            <div className={classes.top}>
                                <span className={classes.exportIcon} onClick={createExportCSVUrl}>
                                    <Export/>
                                    <Typo as="p" variant="px" font="regular">{__("Export CSV")}</Typo>
                                    {isFetchingCsvData ? <Typo as="p" variant="px" className={classes.load}>...</Typo> : null}
                                </span>
                                <CSVLink
                                    ref={csvRef}
                                    data={csvData} 
                                    filename={"report.csv"}
                                    style={{display:'none'}}
                                />
                                <div className={classes.grandTotal}>
                                    <Typo as="p" variant="p" font="light" className={classes.totalTitle}>{__("Grand total")}</Typo>
                                    <Typo as="p" variant="p">{grandTotal ? '$' + grandTotal.toFixed(2) : ""}</Typo>
                                </div>
                            </div>
                            {width > 784 ? 
                                <div className={classes.titleRow}>
                                    <Typo as="p" variant="p">{__("Name")}</Typo>
                                    <Typo as="p" variant="p">{__("Address")}</Typo>
                                    <Typo as="p" variant="p">{__("Date of order")}</Typo>
                                    <Typo as="p" variant="p">{__("Date of delivery")}</Typo>
                                    <Typo as="p" variant="p">{__("Total")}</Typo>
                                </div>
                            :
                                null
                            }
                            {reports.map(report => {
                                return (
                                    <Report key={report.id} __={__} width={width} report={report}/>
                                )
                            })}
                        </div>
                    :
                        <Typo as="p" variant="p" font="regular" className={classes.noResult}>{__("No items")}.</Typo>
                :
                    <div className={classes.loadingWrapper}>
                        <Loading/>
                    </div>
                }
                {totalPages > 1 ? 
                    <div className={classes.pagination}>
                        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
                    </div> 
                : null}
            </div>
        )
    });

    let content;
    if(width <= 784) {
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="reports" onClick={() => setView('reports')}/>     
                          </div>       
                break;
            case 'reports':
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            {reportsContent}
                          </div>
                break;
            default:
                content = <div className={classes.tabs}>
                            <Tabs active="reports" onClick={() => setView('reports')}/>     
                          </div>
                break; 
        }
    } else {
        return (
              <div>
                    <Head description={STATIC_DESCRIPTION}>
                        Reports
                    </Head>
                    <AppWrapper>
                        <div className={classes.root}>
                            <div className={classes.tabs}>
                                <Tabs active="reports"/>     
                            </div>
                            {reportsContent}
                        </div>
                    </AppWrapper>
              </div>
              
          )
      }

    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                Reports
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                   {content}
                </div>
            </AppWrapper>
        </div>
    )
};

export default Reports;