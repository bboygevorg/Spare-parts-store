import React from "react";

const style = {fill: '#1d1d1b'}

const Hamburger = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="22" viewBox="0 0 30 22">
        <g transform="translate(-337 -26)">
            <rect style={style} width="30" height="2" rx="1" transform="translate(337 26)"/>
            <rect style={style} width="30" height="2" rx="1" transform="translate(337 36)"/>
            <rect style={style} width="30" height="2" rx="1" transform="translate(337 46)"/>
        </g>
    </svg>
)

export default Hamburger;
