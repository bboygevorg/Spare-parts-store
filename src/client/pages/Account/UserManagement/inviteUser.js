import React, { useCallback, useMemo, useState } from 'react';
import Input from 'components/Input';
import classes from './inviteUser.css';
import { USER_ROLES } from 'conf/consts';
import AccountSelect from './accountSelect';
import Button from 'components/Button';
import Typo from 'ui/Typo';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import Confirmation from 'components/Confirmation';
import { useHistory } from 'react-router';
import { SEND_INVITE } from 'api/mutation';
import { useMutation } from '@apollo/react-hooks';
import Modal from 'components/Modal';
import { getMessage } from 'helper/errors';
import RoleInformation from '../popup/roleInformation';

const InviteUser = (props) => {
    const { __, width, companyRole } = props;
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState(USER_ROLES[USER_ROLES.length - 1]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [isOpenRoleInfo, setIsOpenRoleInfo] = useState(false);
    const customerData = useSelector(state => state.signin.customerData);
    const [sendInviteRequest] = useMutation(SEND_INVITE);

    const handleChangeEmail = value => {
        setEmail(value);
    }

    const handleChangeRole = value => {
        setRole(value);
    }

    const handleInviteUser = useCallback(async () => {
        if(!email) {
            setError("Required");
            return;
        }
        else
        if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setError("Invalid email");
            return;
        }
        else {
            setError("");
            if(email && role) {
                if(!isEmpty(customerData) && customerData.companyName) {
                    try {
                        setIsSubmitting(true);
                        const res = await sendInviteRequest({
                            variables: {
                                customerToken: customerData.customerToken,
                                role: role.value,
                                email
                            }
                        });
                        if(res && res.data && res.data.companySendInviteRequest) {
                            setIsSubmitting(false);
                            setEmail("");
                            setIsOpenSuccess(true);
                        }
                    } catch (err) {
                        setIsSubmitting(false)
                        const parseError = JSON.parse(JSON.stringify(err));
                        const code = parseError.graphQLErrors[0].code;
                        const message = getMessage(code);
                        setError(message);
                    }
                }
                else {
                    setIsOpen(true);
                }
            } 
        }
    }, [email, error, role, customerData])

    const updateCustomerInfo = () => {
        history.replace("/account/profile");
    }

    const visibility = useMemo(() => {
        return (companyRole === 1 || companyRole === 2) ? false : true
    }, [companyRole]);

    return (
        <div className={`${classes.root} ${!visibility && classes.hidden}`}>
            <div className={classes.top}>
                <div className={classes.content}>
                    <Input
                        id="invite"
                        placeholder={__("Enter email address")}
                        classes={{input: `${classes.field} ${error ? classes.errBorder : ""}`}}
                        value={email}
                        onChange={(e) => handleChangeEmail(e.target.value)}
                    />
                    <div className={classes.accountSelect}>
                        <AccountSelect
                            id="role"
                            name="role"
                            value={role}
                            onChange={handleChangeRole}
                            items={USER_ROLES}
                            labelKey="name"
                            setIsOpenRoleInfo={setIsOpenRoleInfo}
                            inInvite={true}
                        />
                    </div>
                </div>
                {width <= 784 && error ? <div className={classes.error}>
                    <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(error)}
                    </Typo>
                    <img className={classes.errorIcon} src="/icons/error.svg" />
                </div> : null}
                <Button
                    onClick={handleInviteUser}
                    label={__("Invite new user")}
                    classes={{button_primary: classes.inviteButton}}
                    isSubmitting={isSubmitting}
                />
            </div>
            {width > 784 && error ? <div className={classes.error}>
                    <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(error)}
                    </Typo>
                    <img className={classes.errorIcon} src="/icons/error.svg" />
                </div> 
            : null}
           <Confirmation
              isShown={isOpen}
              onClose={() => setIsOpen(false)}
              action={updateCustomerInfo}
              text={__("Company field is required. Please update your information.")}
            />
            <Modal
                isShown={isOpenSuccess}
                onClose={() => setIsOpenSuccess(false)}
                className={`${classes.dialog} ${isOpenSuccess ? classes.openModal : ""}`}
            >
                <div className={classes.success}>
                    <Typo as="p" variant="p" font="bold">
                        {__("Your invitation successfully sent.")}
                    </Typo>
                    <Button
                        label={__("OK")}
                        onClick={() => setIsOpenSuccess(false)}
                        classes={{button_primary: classes.okButton}}
                    />
                </div>
            </Modal>
            <Modal
                isShown={isOpenRoleInfo}
                onClose={() => setIsOpenRoleInfo(false)}
                className={classes.roleInfoDialog}
            >
                <RoleInformation __={__} width={width}/>
            </Modal>
        </div>
    );
};

export default InviteUser;