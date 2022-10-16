import Typo from 'ui/Typo';
import React from 'react';
import classes from './reject.css';
import Button from 'components/Button';

const Reject = (props) => {
    const { __, rejectComment, setRejectComment, handleRejectOrder, rejectLoading } = props;

    return (
        <div className={classes.root}>
            <Typo as="p" variant="h3" className={classes.title}>{__("Reason of rejection")}</Typo>
            <Typo as="p" variant="p" font="regular">{__("Please mention the reason you want reject this order.")}</Typo>
            <textarea 
                cols="10" 
                rows="6" 
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)} 
                placeholder={__("Type the reason")}
                className={classes.comInput}
            />
            <Button
                label={__("Reject")}
                classes={{button_primary: classes.rejectBtn}}
                isSubmitting={rejectLoading}
                onClick={handleRejectOrder}
            />
        </div>
    );
};

export default Reject;