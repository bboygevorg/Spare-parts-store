import React from "react";  

const Arrow = () => ( 
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="7.4" 
        viewBox="0 0 12 7.4"
      >
        <defs style={{fill: "#1d1d1b"}}></defs>
        <path 
          className="a"
          d="M0,1.4,1.4,0l6,6-6,6L0,10.6,4.6,6Z" 
          transform="translate(0 7.4) rotate(-90)"
        />
      </svg>
)

export default Arrow; 