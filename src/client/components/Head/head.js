import React from 'react';
import { Helmet } from 'react-helmet';
import useTranslation from 'talons/useTranslation';

const Head = props => {
    const { children, canonical } = props;
    const __ = useTranslation();

    return (
        <Helmet>
            <title>{props.isProduct || props.isCategory ? children : __(children)}</title>
            <meta property="og:title" content={props.isProduct || props.isCategory ? children : __(children)} />
            {props.description ? <meta property="og:description" content={__(props.description)} /> : null}
            {canonical && <link rel="canonical" href={`https://www.buildclub.com${canonical}`} />}
            {canonical && <link rel='shortlink' href={`https://www.buildclub.com${canonical}`} />}
        </Helmet>
    );
};

export default Head;