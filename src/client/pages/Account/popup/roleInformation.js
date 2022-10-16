import React from 'react';
import { ROLES_INFO } from 'conf/consts';
import Typo from 'ui/Typo';
import classes from './roleInformation.css';

const RoleInformation = ({ __, width }) => {
    return (
        <div className={classes.root}>
            {ROLES_INFO.map((el, i) =>
                <div key={i} className={classes.info}>
                    <Typo as="p" variant="p" className={classes.name}>{__(el.roleName)}</Typo>
                    {width > 540 ? <Typo as="p" variant="p" font="regular">-</Typo> : null}
                    <Typo as="p" variant="p" font="regular" className={classes.text}>{__(el.text)}</Typo>
                </div>
            )}
        </div>
    );
};

export default RoleInformation;