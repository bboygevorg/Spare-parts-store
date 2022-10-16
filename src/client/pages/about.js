import React, { useEffect } from 'react';
import Link from 'components/Link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPage } from '../../store/actions/page';

const About = () => {
    const dispatch = useDispatch();
    const pages = useSelector(state => state.signin.page.data);
    const aboutUsPage = pages['about-us'];

    useEffect(() => {
        // If aboutUsPage is empty, that mean we didn't render it on the server,
        // so we need to do that now. Maybe user came from another page with React Router
        if (!aboutUsPage) {
            dispatch(fetchPage(74));
        }
    }, []);

    return (
        <div>
            {aboutUsPage ?
                <div dangerouslySetInnerHTML={{__html: aboutUsPage.content.rendered}} />
            : <div>Loading...</div>}
            <Link to="/about">Go to about</Link>
        </div>
    );
}

export const loadData = (store) => {
    return store.dispatch(fetchPage(74));
}

export default About;
