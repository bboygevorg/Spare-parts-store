import React, { Fragment, useState } from 'react';
import classes from './user.css';
import AccountSelect from './accountSelect';
import CardIcon from 'icons/CardIcon';
import { USER_ROLES } from 'conf/consts';
import Typo from 'ui/Typo/';
import Dropdown from 'icons/Dropdown';

const User = (props) => {
    const { 
        __,
        user,
        openRoleConfirmation, 
        openDeleteConfirmation, 
        setSelectedUser, 
        currentRole, 
        width,
        companyRole,
        isAdmin,
        handleOpenAttachDetachCard
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    if(width <= 784) {
        return (
            <div className={classes.block}>
                <div className={classes.header}>
                    <Typo as="p" variant="px" font={isOpen ? "light" : "condensed"}>{user.name}</Typo>
                    <div className={`${classes.dropDown} ${isOpen ? classes.opened : ""}`} onClick={() => setIsOpen(!isOpen)}>
                        <Dropdown/>
                    </div>
                </div>
                {isOpen ? <div className={classes.details}>
                    <div className={classes.rowMobile}>
                        <Typo as="p" variant="px">{__("company.user.email")}</Typo>
                        <Typo as="p" variant="px" font="light">{user.email}</Typo>
                    </div>
                    <div className={classes.rowMobile}>
                        <Typo as="p" variant="px">{__("company.user.phone")}</Typo>
                        <Typo as="p" variant="px" font="light">{user.phone}</Typo>
                    </div>
                    <div className={classes.rowMobile}>
                        <Typo as="p" variant="px">{__("company.user.role")}</Typo>
                        <div className={classes.role} onClick={() => setSelectedUser(user)}>
                            {currentRole.value === 4 || companyRole === 2 || isAdmin ?
                                <Typo as="p" variant="px" font="light">{currentRole.name}</Typo>
                            :
                                <AccountSelect
                                    id="role"
                                    name="role"
                                    value={currentRole}
                                    onChange={openRoleConfirmation}
                                    items={USER_ROLES}
                                    labelKey="name"
                                    classes={{root: classes.roleSelectRoot}}
                                />
                            }
                        </div>
                    </div>
                    {currentRole.value !== 4 && companyRole !== 2 && !isAdmin ?
                        <Fragment>
                            <div className={classes.card} onClick={() => handleOpenAttachDetachCard(user)}>
                                <CardIcon/>
                                <Typo as="p" variant="pxs" color="secondary" font="light">{__("Attach company card")}</Typo>
                            </div>
                            <div>
                                <Typo as="p" variant="px" className={classes.delete} color={user.status ? "code" : "primary"} onClick={() => openDeleteConfirmation(user)}>{user.status ? __("Activate user") : __("Deactivate user")}</Typo>
                            </div>
                        </Fragment>
                    :
                        null
                    }
                </div> : null}
            </div>
        );
    } 


    return (
        <div className={`${classes.rowData} ${companyRole === 2 && classes.shopAdminData}`}>
            <Typo as="p" variant="p" font="light" className={classes.name}>{user.name}</Typo>
            <Typo as="p" variant="p" font="light" className={classes.email}>{user.email}</Typo>
            <Typo as="p" variant="p" font="light">{user.phone}</Typo>
            <div className={classes.role} onClick={() => setSelectedUser(user)}>
                {currentRole.value === 4 || companyRole === 2 || isAdmin ?
                    <Typo as="p" variant="p" font="light">{currentRole.name}</Typo>
                :
                    <AccountSelect
                        id="role"
                        name="role"
                        value={currentRole}
                        onChange={openRoleConfirmation}
                        items={USER_ROLES}
                        labelKey="name"
                    />
                } 
            </div>
            {currentRole.value !== 4 && companyRole !== 2 && !isAdmin ?
                <Fragment>
                    <Typo as="p" variant="p" font="light" className={classes.card} onClick={() => handleOpenAttachDetachCard(user)}><CardIcon/></Typo>
                    <Typo as="p" variant="p" color={user.status ? "code" : "primary"} className={classes.delete} onClick={() => openDeleteConfirmation(user)}>{user.status ? __("Activate user") : __("Deactivate user")}</Typo>
                </Fragment>
            :
                null
            }
        </div>  
    );
};

export default User;