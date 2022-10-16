import React from "react";

const Text = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <defs>
      <clipPath id="textIcon">
        <rect
          style={{ fill: "#1d1d1b" }}
          width="24"
          height="24"
          transform="translate(211 419)"
        />
      </clipPath>
    </defs>
    <g style={{ clipPath: "url(#textIcon)" }} transform="translate(-211 -419)">
      <path
        style={{ fill: "#1d1d1b" }}
        d="M17.621,59.882H1.823A1.825,1.825,0,0,0,0,61.7V72.642a1.825,1.825,0,0,0,1.823,1.823h15.8a1.825,1.825,0,0,0,1.823-1.823V61.7A1.825,1.825,0,0,0,17.621,59.882Zm0,1.215a.6.6,0,0,1,.233.047L9.722,68.192,1.59,61.144a.6.6,0,0,1,.233-.047Zm0,12.152H1.823a.608.608,0,0,1-.608-.608V62.428l8.108,7.027a.609.609,0,0,0,.8,0l8.108-7.027V72.642A.608.608,0,0,1,17.621,73.249Z"
        transform="translate(213.393 363.536)"
      />
    </g>
  </svg>
);

export default Text;
