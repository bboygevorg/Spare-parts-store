import React  from 'react';
import { Hits } from 'react-instantsearch-dom';
import { mergeClasses } from '../../classify';
import defaultClasses from './gallery.css';
import Item from './item';
import NoResults from '../NoResultsAlgoria';

const Gallery = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <section className={classes.containerResults}>
            <header className={`${classes.containerHeader} ${classes.containerOptions}`}>
                <Hits hitComponent={Item} />
                <NoResults />
            </header>
        </section>
    );
};

export default Gallery;