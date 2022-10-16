import React, { useState, useEffect, useMemo } from 'react'
import { mergeClasses } from '../../../helper/mergeClasses'
import defaultClasses from './billingAddress.css'
import Tabs from './tabs'
import EditJobAddresses from 'components/JobAddresses/editJobAddresses'
import {GET_CUSTOMER_DEFAULT_BILLING} from '../../graphql/query'
import { UPDATE_ADDRESS, ADD_ADDRESS } from 'api/mutation';
import { useBillingAddress } from 'talons/Account/useBillingAddress'
import useWindowDimensions from 'talons/useWindowDimensions'
import BackStep from './backStep'
import { MOBILE_SIZE, STATIC_DESCRIPTION } from 'conf/consts'
import { isEmpty } from 'lodash'
import AppWrapper from 'components/UI/AppWrapper/index'
import Head from 'components/Head'

const BillingAddress = props => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const {
            updateAddress,
            data,
            customerData,
            addAddress
        } = useBillingAddress({
                    updateAddressMutation: UPDATE_ADDRESS,
                    getCustomerDefaultBilling:GET_CUSTOMER_DEFAULT_BILLING,
                    addAddressMutation: ADD_ADDRESS
                })
    const {width} = useWindowDimensions()
    const [isMobile, setIsMobile] = useState(false)
    const [view, setView] = useState('address')
    const addressContent = useMemo(() => (
        <div className={classes.address}>
            <EditJobAddresses
                request ={isEmpty(data) ? addAddress : updateAddress}
                onAfterSubmit={() => {}}
                initialValues={data}
                addresses={[]}
                setAddresses={() => {}}
                title="Billing Address"
                customerToken={customerData.customerToken}
                inProfile={true}
            />
        </div>
    ))
    useEffect(() => {
        if(width <= MOBILE_SIZE){
            setIsMobile(true)
        } 
    }, [width])
    let content;
    if (isMobile) {
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="billing_address" onClick={() => setView('address')}/>     
                          </div>       
                break;
            case 'address':
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            {addressContent}
                          </div>
                break;
            default:
                content = <div className={classes.tabs}>
                            <Tabs active="billing_address" onClick={() => setView('address')}/>     
                          </div>
                break; 
        }
       
    } else {
      return (
            <div>
                <Head description={STATIC_DESCRIPTION}>
                    Billing address
                </Head>
                <AppWrapper>
                    <div className={classes.root}>
                        <div className={classes.tabs}>
                            <Tabs active="billing_address"/>     
                        </div>
                        {addressContent}
                    </div>
                </AppWrapper>
            </div>
            
        )
    }
    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                Billing address
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                    {content}
                </div>
            </AppWrapper>
        </div>
    ) 
} 

export default BillingAddress