import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import SignIn from 'components/SignIn';
import Head from "components/Head";
import { STATIC_DESCRIPTION } from 'conf/consts';
import get from 'lodash/get';
import { useSelector } from "react-redux";
import { codeSplitter } from 'components/Link/link';

const SignInPage = (props) => {
    const history = useHistory();
    const prevPath = get(props, "location.state.state.previousPath", "");
    const isAuth = useSelector(state => state.signin.isAuth);
    const localeId = useSelector(state => state.language.currentLanguage);

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
            <Head canonical="/signin/" description={STATIC_DESCRIPTION}>
                Sign In
            </Head>
            <SignIn prevPath={prevPath}/>
        </div>
    );
};

export default withRouter(SignInPage);