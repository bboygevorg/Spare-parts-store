import { useState, useEffect } from 'react';

export default function useWindowDimensions(props = { mobileMaxWidth: 600, maxTabletWidth: 900 }) {
  const { mobileMaxWidth, maxTabletWidth } = props;

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false
  });

  const handleResize = () => {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: mobileMaxWidth && window.innerWidth < mobileMaxWidth,
      isTablet: window.innerWidth < maxTabletWidth && window.innerWidth > mobileMaxWidth
    });
  }

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {      
      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  
  return { width: windowSize.width };
}