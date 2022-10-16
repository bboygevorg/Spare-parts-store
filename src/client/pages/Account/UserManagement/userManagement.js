import React, { useMemo } from 'react';
import Head from 'components/Head';
import AppWrapper from 'ui/AppWrapper';
import Tabs from '../tabs';
import classes from './userManagement.css';
import { STATIC_DESCRIPTION } from 'conf/consts';
import Typo from 'ui/Typo';
import { useUserManagement } from 'talons/Account/useUserManagement';
import InviteUser from './inviteUser';
import RelatedUsers from './relatedUsers';
import BackStep from '../backStep';
import Loading from 'components/Loading';

const UserManagement = () => {
    const { 
        __, 
        users,
        changeCustomerRole,
        roleChanging, 
        changeCustomerStatus,
        statusChanging,
        view,
        setView,
        width,
        companyRole,
        isFetchingUsers,
        getCustomerCards,
        isFetchingUserCards,
        selectedUserCards,
        setShouldGetCards,
        handleDetachUserCard,
        detachLoading
    } = useUserManagement();

    const usersContent = useMemo(() => {
        return  (
            <div className={classes.content}>
                <div className={classes.header}>
                    <Typo as="h2" variant="h2" className={classes.title}>{__("User management")}</Typo>
                    <InviteUser __={__} width={width} companyRole={companyRole}/>
                </div>
                {!isFetchingUsers ? 
                    <div className={classes.footer}>
                        <RelatedUsers
                            users={users}
                            __={__}
                            changeCustomerRole={changeCustomerRole}
                            roleChanging={roleChanging}
                            changeCustomerStatus={changeCustomerStatus}
                            statusChanging={statusChanging}
                            width={width}
                            companyRole={companyRole}
                            getCustomerCards={getCustomerCards}
                            isFetchingUserCards={isFetchingUserCards}
                            selectedUserCards={selectedUserCards}
                            setShouldGetCards={setShouldGetCards}
                            handleDetachUserCard={handleDetachUserCard}
                            detachLoading={detachLoading}
                        />
                    </div>
                :
                    <div className={classes.loadingWrapper}>
                        <Loading/>
                    </div>
                }
            </div>
        )
    });

    let content;
    if(width <= 784) {
        switch(view){
            case "tabs":
                content = <div className={classes.tabs}>
                            <Tabs active="user_management" onClick={() => setView('users')}/>     
                          </div>       
                break;
            case 'users':
                content = <div>
                            <div className={classes.backStep} onClick={() => setView('tabs')}>
                                <BackStep/>
                            </div>
                            {usersContent}
                          </div>
                break;
            default:
                content = <div className={classes.tabs}>
                            <Tabs active="user_management" onClick={() => setView('users')}/>     
                          </div>
                break; 
        }
    } else {
        return (
              <div>
                    <Head description={STATIC_DESCRIPTION}>
                        User management
                    </Head>
                    <AppWrapper>
                        <div className={classes.root}>
                            <div className={classes.tabs}>
                                <Tabs active="user_management"/>     
                            </div>
                            {usersContent}
                        </div>
                    </AppWrapper>
              </div>
              
          )
      }

    return (
        <div>
            <Head description={STATIC_DESCRIPTION}>
                User management
            </Head>
            <AppWrapper>
                <div className={classes.root}>
                   {content}
                </div>
            </AppWrapper>
        </div>
    );
};

export default UserManagement;