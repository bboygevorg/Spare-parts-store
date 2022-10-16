import React, { useState } from 'react';
import Typo from 'ui/Typo';
import Input from 'components/Input';
import classes from './licenseModal.css';
import useTranslation from 'talons/useTranslation';
import Button from 'components/Button';
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from 'store/actions/user';
import { UPDATE_CUSTOMER_MUTATION } from 'api/mutation';

const LicenseModal = ({ licenses, cancel, add }) => {
    const [hvac, setHvac] = useState('');
    const [epa, setEpa] = useState('');
    const [filled, setFilled] = useState('');
    const [ runUpdateCustomer ] = useMutation(UPDATE_CUSTOMER_MUTATION);
    const customerData = useSelector(state => state.signin.customerData);
    const dispatch = useDispatch();
    const __ = useTranslation();
    const createModalTitle = () => {
        if(licenses.length === 2) {
            if(!filled) {
                return `${licenses[0].placeholder} required to purchase this product.`;
            }
            else
            if(filled === 'one') {
                return  `${licenses[1].placeholder} is required to purchase this product.`;
            }
        }
        else 
        if(licenses[0].placeholder === 'HVAC License') {
            return `${licenses[0].placeholder} required to purchase this product.`
        }
        else {
            return `${licenses[0].placeholder} is required to purchase this product.`
        }
    }

    const handleSubmit = async () => {
        const customer = {
            firstname: customerData.firstname,
                    lastname: customerData.lastname,
                    email: customerData.email,
                    hvacLicense: hvac ? hvac : customerData.hvacLicense,
                    epaCertification: epa ? epa : customerData.epaCertification,
                    resellerId: customerData.resellerId,
                    companyName: customerData.companyName
        }
        const updateResponse = await runUpdateCustomer({
            variables: {
                customer,
                customerToken: customerData.customerToken
            }
        })
        if(updateResponse && updateResponse.data) {
            dispatch(userActions.addCustomerData(updateResponse.data.updateCustomer))
        }
    };
    return (
        <div className={classes.root}> 
            <Typo as="h3" variant="h3" className={classes.title}>
                {__(createModalTitle())}
            </Typo>
            {licenses.map((license, index) => {
                return (
                    <div key={index} className={`${(index === 0 && filled === 'one') || (!filled && index === 1) ? classes.hiddenInput : ''}`}>
                        <Input
                            id={license.title}
                            name={license.title}
                            type="text"
                            placeholder={__(license.placeholder)}
                            classes={{input: classes.inputComponent}}
                            value={license.title === 'hvac' ? hvac : epa}
                            onChange={e => license.title === 'hvac' ? setHvac(e.target.value) : setEpa(e.target.value)}
                        />
                    </div>
                )
            })}
          <div className={classes.buttons}>
            <Button
                label={__("ADD")}
                type="primary"
                onClick={() => { 
                    if(licenses.length === 2) {
                        if(hvac && !epa) {
                            setFilled('one');
                        }
                        else
                        if(epa) {
                            setFilled('two');
                            add();
                            handleSubmit();
                            cancel();
                        }
                    }
                    else {
                        add();
                        handleSubmit()
                        cancel();
                    }
                  
                }}
                classes={{button_primary: classes.addButton}}
                disabled={
                    (licenses.length === 2 && !filled && !hvac) || 
                    (licenses.length === 2 && filled === 'one' && !epa) || 
                    (licenses[0].title === 'hvac' && !hvac) || 
                    (licenses[0].title === 'epa' && !epa)
                }
            />
            <Button
                label={__("CANCEL")}
                type="bordered"
                onClick={cancel}
                classes={{button_bordered: classes.cancelButton}}
            />
          </div>
        </div>
    );
};

export default LicenseModal;