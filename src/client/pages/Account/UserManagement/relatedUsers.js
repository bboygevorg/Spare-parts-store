import Typo from 'ui/Typo/';
import React, { useState } from 'react';
import classes from './relatedUsers.css';
import { USER_ROLES, ALL_ROLES } from 'conf/consts';
import Confirmation from 'components/Confirmation';
import Modal from 'components/Modal';
import Delete from '../popup/delete';
import User from './user';
import { parameterizedString } from 'helper/utils';
import { useSelector } from 'react-redux';
import orderBy from 'lodash/orderBy';
import AttachDetachCard from '../popup/attachDetachCard';

const RelatedUsers = (props) => {
    const { 
        __, 
        users, 
        changeCustomerRole, 
        roleChanging, 
        changeCustomerStatus,
        statusChanging,
        width,
        companyRole,
        getCustomerCards,
        isFetchingUserCards,
        selectedUserCards,
        setShouldGetCards,
        handleDetachUserCard,
        detachLoading
    } = props;
    const [isOpenChangeRole, setIsOpenChangeRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState();
    const [text, setText] = useState("");
    const [selectedUser, setSelectedUser] = useState({});
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenAttach, setIsOpenAttach] = useState(false);
    const customerData = useSelector(state => state.signin.customerData);

    const handleOpenConfirmation = (newRole) => {
        setSelectedRole(newRole);
        const currentRole = USER_ROLES.find(el => el.value == selectedUser.role);
        setText(parameterizedString(__("Are you sure you want to change role of %s1 from %s2 to %s3?"), selectedUser.name, currentRole.name, newRole.name));
        setIsOpenChangeRole(true);   
        window.scrollTo(0,0);
    }

    const handleOpenDeleteConfirmation = (user) => {
        setSelectedUser(user);
        const message = `Are you sure you want ${user.status ? "activate" : "deactivate"} user %s1 from list of users?`;
        setText(parameterizedString(__(message), user.name));
        setIsOpenDelete(true);
        window.scrollTo(0,0);
    }

    const handleOpenAttachDetachCard = (user) => {
        setSelectedUser(user);
        getCustomerCards(user.id);
        setIsOpenAttach(true);
        window.scrollTo(0,0);
    }

    const handleChangeRole = async () => {
        await changeCustomerRole(selectedUser.id, selectedRole.value);
        setSelectedRole();
        setText("");
        setSelectedUser({});
        setIsOpenChangeRole(false);
    }

    const handleChangeStatus = async () => {
        const newStatus = selectedUser.status ? 0 : 1;
        await changeCustomerStatus(selectedUser.id, newStatus),
        setSelectedUser({});
        setText("");
        setIsOpenDelete(false);
    }

    if(width <= 784) {
        return (
            <div className={classes.root}>
                {orderBy(users, ["status"], ["asc"]).map((user, index) => {
                    const currentRole = ALL_ROLES.find(el => el.value == user.role);
                    const isAdmin = currentRole.value === 3 && customerData.email === user.email;
                    if(currentRole) {
                        return (
                            <User
                                key={index}
                                __={__}
                                user={user}
                                currentRole={currentRole}
                                openRoleConfirmation={handleOpenConfirmation}
                                openDeleteConfirmation={handleOpenDeleteConfirmation}
                                setSelectedUser={setSelectedUser}
                                width={width}
                                companyRole={companyRole}
                                isAdmin={isAdmin}
                                handleOpenAttachDetachCard={handleOpenAttachDetachCard}
                            />
                        )
                    }
                })}
                <Confirmation
                    isShown={isOpenChangeRole}
                    onClose={() => setIsOpenChangeRole(false)}
                    action={handleChangeRole}
                    text={text}
                    isSubmitting={roleChanging}
                />
                <Modal
                    isShown={isOpenDelete}
                    onClose={() => setIsOpenDelete(false)}
                    className={classes.dialog}
                >
                    <Delete
                        title={selectedUser.status ? "Activate user" : "Deactivate user"}
                        process={selectedUser.status ? "activate" : "deactivate"}
                        text={text}
                        onClose={() => setIsOpenDelete(false)}
                        isSubmitting={statusChanging}
                        action={handleChangeStatus}
                    />
                </Modal>
                <Modal
                    isShown={isOpenAttach}
                    onClose={() => setIsOpenAttach(false)}
                    className={classes.attachDialog}
                >
                    <AttachDetachCard
                        __={__}
                        isFetchingUserCards={isFetchingUserCards}
                        cards={selectedUserCards}
                        selectedUser={selectedUser}
                        setShouldGetCards={setShouldGetCards}
                        handleDetachUserCard={handleDetachUserCard}
                        detachLoading={detachLoading}
                    />
                </Modal>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <div className={`${classes.row} ${companyRole === 2 && classes.shopAdminRow}`}>
                <Typo as="p" variant="p">{__("company.user.name")}</Typo>
                <Typo as="p" variant="p">{__("company.user.email")}</Typo>
                <Typo as="p" variant="p">{__("company.user.phone")}</Typo>
                <Typo as="p" variant="p">{__("company.user.role")}</Typo>
                <Typo as="p" variant="p"></Typo>
                <Typo as="p" variant="p"></Typo>
            </div>
            {orderBy(users, ["status"], ["asc"]).map(user => {
                const currentRole = ALL_ROLES.find(el => el.value == user.role);
                const isAdmin = currentRole.value === 3 && customerData.email === user.email;
                if(currentRole) {
                    return (
                        <User
                            key={user.id}
                            __={__}
                            user={user}
                            currentRole={currentRole}
                            openRoleConfirmation={handleOpenConfirmation}
                            openDeleteConfirmation={handleOpenDeleteConfirmation}
                            setSelectedUser={setSelectedUser}
                            width={width}
                            companyRole={companyRole}
                            isAdmin={isAdmin}
                            handleOpenAttachDetachCard={handleOpenAttachDetachCard}
                        />
                    )
                }
            })}
            <Confirmation
              isShown={isOpenChangeRole}
              onClose={() => setIsOpenChangeRole(false)}
              action={handleChangeRole}
              text={text}
              isSubmitting={roleChanging}
            />
            <Modal
                isShown={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                className={classes.dialog}
            >
                <Delete
                    title={selectedUser.status ? "Activate user" : "Deactivate user"}
                    process={selectedUser.status ? "activate" : "deactivate"}
                    text={text}
                    onClose={() => setIsOpenDelete(false)}
                    isSubmitting={statusChanging}
                    action={handleChangeStatus}
                />
            </Modal>
            <Modal
                isShown={isOpenAttach}
                onClose={() => setIsOpenAttach(false)}
                className={classes.attachDialog}
            >
                <AttachDetachCard
                    __={__}
                    isFetchingUserCards={isFetchingUserCards}
                    cards={selectedUserCards}
                    selectedUser={selectedUser}
                    setShouldGetCards={setShouldGetCards}
                    handleDetachUserCard={handleDetachUserCard}
                    detachLoading={detachLoading}
                />
            </Modal>
        </div>
    );
};

export default RelatedUsers;