import React, { useState, useEffect, useMemo, Fragment } from 'react'
import defaultClasses from './profile.css'
import { mergeClasses } from 'helper/mergeClasses'
import Tabs from './tabs'
import { useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import Input from 'components/Input/input'
import Button from 'components/Button/index'
import * as Yup from 'yup';
import { useProfile } from 'talons/Account/useProfile';
import { UPDATE_CUSTOMER_MUTATION } from 'api/mutation';
import AppWrapper from 'ui/AppWrapper';
import { MOBILE_SIZE, STATIC_DESCRIPTION } from 'conf/consts'
import useWindowDimensions from 'talons/useWindowDimensions'
import BackStep from './backStep'
import Typo from 'ui/Typo';
import Head from 'components/Head';
import useTranslation from 'talons/useTranslation';
import CheckBox from 'components/CheckBox';

const SignupSchema = Yup.object().shape({
    firstname: Yup.string()
      .required('Required'),
    lastname: Yup.string()
      .required('Required'),
    telephone: Yup.string()
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
  });


const Profile = props => {
    const { customerData } = useSelector(state => state.signin);
    const __ = useTranslation();
    const talonProps = useProfile({ updateCustomer: UPDATE_CUSTOMER_MUTATION })
    const { handleSubmit, message, errMessage, isSubmitting } = talonProps
    const classes = mergeClasses(defaultClasses, props.classes)
    const {width} = useWindowDimensions()
    const [isMobile, setIsMobile] = useState(false)
    const [showTabs, setShowTabs] = useState(false)
    const [checked, setChecked] = useState(false)
    const [contractorChecked, setContractorChecked] = useState(false)

    useEffect(() => {
        if(customerData.resellerId) {
            setChecked(true);
        }
        if(customerData.contractorLicence) {
            setContractorChecked(true)
        }
    }, [customerData]);

    const form = useMemo(() => (
                <div>
                    <Head description={STATIC_DESCRIPTION}>
                        Profile
                    </Head>
                    <div className={classes.formWrapper}>
                        <div className={classes.form}>
                            <Formik
                                initialValues={customerData}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                                validationSchema={ SignupSchema }
                                >
                                {({ errors, touched, handleChange, values, handleBlur }) => (
                                    <Form>
                                        <div className={classes.title}>
                                            <Typo font="condensed" as="h3" variant="h3">{__("PROFILE")}</Typo>
                                        </div>
                                        {message && <div className={classes.message}><span>{message}</span></div>}
                                        {errMessage && <div className={classes.errorMessage}>{errMessage}</div>}
                                        <Input 
                                               name="firstname"
                                               id="firstname"
                                               placeholder={__("First name")}
                                               value={values.firstname || ""} 
                                               classes={{input: errors.firstname && touched.firstname ? classes.errorField : classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                        />
                                        {errors.firstname && touched.firstname && 
                                            <div className={classes.error}>
                                                <Typo as="p" variant="pxs" color="error" font="regular">{__(errors.firstname)}</Typo>
                                                <img className={classes.errorIcon} src="/icons/error.svg" />
                                            </div>
                                        }
                                        <Input name="lastname"
                                               value={values.lastname || ""}
                                               id="lastname"
                                               placeholder={__("Last name")}
                                               classes={{input: errors.lastname && touched.lastname ? classes.errorField : classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                        />
                                        {errors.lastname && touched.lastname && 
                                            <div className={classes.error}>
                                                <Typo as="p" variant="pxs" color="error" font="regular">{__(errors.lastname)}</Typo>
                                                <img className={classes.errorIcon} src="/icons/error.svg" />
                                            </div>
                                        }
                                        <Input name="email"
                                               id="email"
                                               placeholder={__("E-mail address")}
                                               value={values.email || ""} classes={{input: errors.email && touched.email ? classes.errorField : classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                               disabled={true}
                                        />
                                        {errors.email && touched.email &&
                                            <div className={classes.error}>
                                                <Typo as="p" variant="pxs" color="error" font="regular">{__(errors.email)}</Typo>
                                                <img className={classes.errorIcon} src="/icons/error.svg" />
                                            </div>
                                        }
                                        <Input name="telephone"
                                               type="phone"
                                               placeholder={__("(+1) xxx-xxx-xxxx (supports only mobile numbers)")}
                                               value={values.telephone || ""} classes={{input: errors.telephone && touched.telephone ? classes.errorField : classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                               disabled={true}
                                        />
                                        {errors.telephone && touched.telephone && 
                                            <div className={classes.error}>
                                                <Typo as="p" variant="pxs" color="error" font="regular">{errors.telephone}</Typo>
                                                <img className={classes.errorIcon} src="/icons/error.svg" />
                                            </div>
                                        }
                                        <Input 
                                            name="companyName"
                                            id="companyName"
                                            placeholder={__("Company Name")}
                                            value={values.companyName || ""} 
                                            classes={{input: classes.field}}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={customerData.companyRole != 4}
                                        />
                                        <Input name="hvacLicense"
                                               id="hvacLicense"
                                               placeholder={__("HVAC License (Optional)")}
                                               value={values.hvacLicense || ""} classes={{input: classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                        />
                                        <Input name="epaCertification"
                                               id="epaCertification"
                                               placeholder={__("EPA Certification (Optional)")}
                                               value={values.epaCertification || ""} classes={{input: classes.field}}
                                               onChange={handleChange}
                                               onBlur={handleBlur}
                                        />
                                        <Fragment>
                                            <div className={classes.checkContractor}>
                                                <Typo as="p" variant="p" font="bold">{__("Are a contractor?")}</Typo>
                                                <CheckBox
                                                    label=""
                                                    value={contractorChecked}
                                                    onChange={() => {
                                                        setContractorChecked(!contractorChecked)
                                                    }}
                                                    inSignUp={true}
                                                />
                                            </div>
                                            <Typo as="p" variant="px" font="regular" color="code" className={contractorChecked && classes.contractorMessage}>{__("We have special offers and conditions for contractors")}</Typo>
                                        </Fragment>
                                        {contractorChecked && 
                                            <Fragment>
                                                <div className={classes.inputDiv}>
                                                    <Input
                                                        id="contractorLicence"
                                                        name="contractorLicence"
                                                        type="text"
                                                        placeholder={__("Contract license")}
                                                        classes={{input: classes.field}}
                                                        value={values.contractorLicence}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                            </Fragment>
                                        }
                                        <div className={classes.checkReseller}>
                                            <Typo as="p" variant="p" font="bold">{__("Reseller")}</Typo>
                                            <CheckBox
                                                label=""
                                                value={checked}
                                                onChange={() => {
                                                    setChecked(!checked)
                                                }}
                                                inProfile={true}
                                            />
                                        </div>
                                        {checked && 
                                            <Fragment>
                                                <Input 
                                                    name="resellerId"
                                                    id="resellerId"
                                                    placeholder={__("Reseller ID")}
                                                    value={values.resellerId || ""} 
                                                    classes={{input: classes.field}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Fragment>
                                        }
                                        <div className={classes.submitBtn}>
                                        <Button type="primary" label={__("Save")} classes={{root: classes.submitBtn}} disabled={isSubmitting} Type="submit" isSubmitting={isSubmitting}/>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
                    ), [checked, customerData, handleSubmit, SignupSchema])
    
    useEffect(() => {
        if(width <= MOBILE_SIZE){
            setIsMobile(true)
        } 
    }, [width])
    
    let content;
    if(isMobile){
        if (showTabs) {
            content = <div className={classes.tabs}>
                        <Tabs active="profile" onClick={()=> setShowTabs(false)}/>
                       </div>  
        } else {
            content = <div>
                        <div onClick={() => setShowTabs(true)}>
                            <BackStep />
                        </div>
                        {form}
                      </div>
        }
       
    } else {
        content = <section className={classes.body}>
                        <div className={classes.tabs}>
                            <Tabs active="profile"/>
                        </div>
                        {form}
                  </section>
    }
    return (
        <AppWrapper>
            <div className={classes.root}>
                {content}
            </div>
        </AppWrapper>
    )
}

export default Profile
