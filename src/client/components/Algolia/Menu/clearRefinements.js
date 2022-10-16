import React from "react"
import {connectCurrentRefinements} from 'react-instantsearch-dom';

const ClearRefinements = ({items, refine,  onClick}) => (
    <div onClick={() => {
        onClick(refine, items.filter(el => el.attribute !== 'vendorcode'))
    }}>
    </div>
)


export default connectCurrentRefinements(ClearRefinements);
