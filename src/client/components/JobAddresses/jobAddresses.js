import React, { useEffect, useState, useMemo } from 'react';
import Tabs from 'pages/Account/tabs.js';
import { mergeClasses } from 'helper/mergeClasses';
import defaultClasses from './jobAddresses.css';
import Button from 'components/Button';
import EditJobAddresses from './editJobAddresses';
import { useSelector } from 'react-redux';
import { useJobAddresses } from 'talons/Account/useJobAddresses';
import Loading from 'components/Loading';
import { isEmpty } from 'lodash';
import { GET_CUSTOMER_ADDRESS } from 'api/query';
import { DELETE_ADDRESS, ADD_ADDRESS, UPDATE_ADDRESS } from 'api/mutation';
import AppWrapper from 'ui/AppWrapper';
import useWindowDimensions from 'talons/useWindowDimensions';
import { MOBILE_SIZE } from 'conf/consts';
import BackStep from '../../pages/Account/backStep';
import Confirmation from 'components/Confirmation';
import useTranslation from 'talons/useTranslation';

const JobAddresses = ( props ) => {
    const { inCheckout, setStep, step, setAddressId, inCheckoutAddress } = props;
    const customerData = useSelector(state => state.signin.customerData);
    const __ = useTranslation();
    const {width} = useWindowDimensions()
    const [isMobile, setIsMobile] = useState(false)
    const [view, setView] = useState('address')
    const {
        addresses,
        addLoader,
        getAddressLoader,
        setAddresses,
        addAddress,
        updateAddress,
        updateLoader,
        edit,
        setEdit,
        editedAddress,
        setEditedAddress,
        add,
        setAdd,
        showInfo,
        setShowInfo,
        deleteAddress,
        showModal,
        handleShowModal,
        handleCloseModal,
        setCurrentAddress
    } =  useJobAddresses({
                            getAddressQuery: GET_CUSTOMER_ADDRESS,
                            addAddressMutation: ADD_ADDRESS,
                            updateAddressMutation: UPDATE_ADDRESS,
                            removeAddressMutation: DELETE_ADDRESS
                        });

    const classes = mergeClasses(defaultClasses, props.classes);
    const addressesContent = (
      <div className={classes.addresses}>
        {getAddressLoader ? (
          <Loading />
        ) : (
          <div>
            <div className={classes.addAddress}>
              <h3 className={classes.title}>{__("JOB ADDRESSES")}</h3>
              <Button
                type="bordered"
                label={__("ADD NEW ADDRESS")}
                classes={{ button_bordered: classes.addAddressButton }}
                onClick={() => {
                  setView("addNew");
                  setAdd(true);
                  setEdit(false);
                }}
              />
            </div>
            {showInfo
              ? addresses.map((address, index) => (
                  <div key={index} className={classes.customerAddress}>
                    <h3>{address.title ? address.title : `${address.firstname} ${address.lastname}`}</h3>
                    <p>
                      {address.street.join(" ")}, {address.city},{" "}
                      {address.postcode}, {address.region.name},
                      {`${address.region.code}, ${address.country.name}`}
                    </p>
                    {/* <p></p>
                    <p></p>
                    <p></p>
                    <p>{address.country.id}</p>
                    <p></p> */}
                    <div className={classes.edit_delete}>
                      <Button
                        label={__("EDIT")}
                        classes={{ button_primary: classes.editButton }}
                        onClick={() => {
                          setEditedAddress(address);
                          setEdit(true);
                          setAdd(false);
                          setView("addNew");
                        }}
                      />
                      <Button
                        type="bordered"
                        label={__("DELETE")}
                        classes={{ button_bordered: classes.deleteButton }}
                        onClick={() => {
                          setCurrentAddress(address.id);
                          handleShowModal();
                        }}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
    const desktopView = useMemo(() => (
        <section className={classes.body}>
            <div className={classes.tabs}>
                <Tabs active="addresses"/>
             </div>
            { !edit && !add && !inCheckout
                 ?
                    addressesContent
                :
                    <EditJobAddresses
                        request={edit ? updateAddress : addAddress}
                        onAfterSubmit={edit ? () => setEdit(!edit) : () => setAdd(!add)}
                        initialValues={!isEmpty(inCheckoutAddress) ? inCheckoutAddress : edit ? editedAddress : null}
                        addresses={addresses}
                        setAddresses={setAddresses}
                        setShowInfo={setShowInfo}
                        customerToken={customerData.customerToken}
                        loading={edit ? updateLoader : addLoader}
                        inCheckout={inCheckout}
                        setStep={setStep}
                        step={step}
                        setAddressId={setAddressId}
                    />
            }
        </section>))
    
    useEffect(() => {
      if(!isEmpty(inCheckoutAddress)){
          setEdit(true)
      }
    }, [inCheckoutAddress])

    useEffect(() => {
        if(width <= MOBILE_SIZE) {
            setIsMobile(true)
        } 
    }, [width])

    let content;
    if(isMobile) {
        switch(view) {
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="addresses" onClick={() => setView("address")}/>
                        </div>
                break;
            case "address":
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            {addressesContent}
                        </div>
                break;
            case "addNew":
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('address')}>
                                <BackStep/>
                            </div>
                            <EditJobAddresses
                                request={edit ? updateAddress : addAddress}
                                onAfterSubmit={() => setView('address')}
                                initialValues={!isEmpty(inCheckoutAddress) ? inCheckoutAddress : edit ? editedAddress : null}
                                addresses={addresses}
                                setAddresses={setAddresses}
                                setShowInfo={setShowInfo}
                                customerToken={customerData.customerToken}
                                loading={edit ? updateLoader : addLoader}
                                inCheckout={inCheckout}
                                setStep={setStep}
                                step={step}
                                setAddressId={setAddressId}
                            />
                          </div>
                break;
            default:
                content = <div className={classes.tabs}>
                             <Tabs active="addresses" onClick={() => setView("orders")}/>
                          </div>
                break;
        }
    } else {
        content = desktopView
    }
    return (
        <AppWrapper>
            <div className={classes.root}>
                {content}
            </div>
            <Confirmation
              isShown={showModal}
              onClose={handleCloseModal}
              action={deleteAddress}
              text={__("Are you sure you want to delete the address?")}
              title="deletingAddress"
            />
        </AppWrapper>
    );
};

export default JobAddresses;
