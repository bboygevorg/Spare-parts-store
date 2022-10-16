import React, { useMemo }  from "react";
import { withRouter, useHistory } from "react-router-dom";
import SignUp from 'components/SignUp';
import Head from "components/Head";
import { STATIC_DESCRIPTION } from 'conf/consts';
import get from 'lodash/get';
import { useSelector } from "react-redux";
import { codeSplitter } from 'components/Link/link';

const SignUpPage = (props) => {
    const history = useHistory();
    const prevPath = get(props, "location.state.state.previousPath", "");
    const isAuth = useSelector(state => state.signin.isAuth);
    const localeId = useSelector(state => state.language.currentLanguage);

    const inviteToken = useMemo(() => {
        if(typeof window !== "undefined") {
            return new URLSearchParams(window.location.search).get("invite_token");
        }
    }, []);
    
    if(isAuth) {
        if(localeId === "default") {
            history.push("/account/profile");
        }
        else {
            history.push(`/account/profile${codeSplitter(localeId)}`);
        }
    }

    return (
        <div>
            <Head canonical="/signup/" description={STATIC_DESCRIPTION}>
                Sign Up
            </Head>
            <SignUp inviteToken={inviteToken} prevPath={prevPath}/>
        </div>
    );
};

export default withRouter(SignUpPage);