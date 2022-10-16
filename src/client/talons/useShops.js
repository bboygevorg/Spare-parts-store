import { useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import pick from "lodash/pick";
import useVisibleShops from '../talons/useVisibleShops';
const FIREBASE_KEYS = [
  "show_ace_icon",
  "show_fg_icon",
  "show_gr_icon",
  "show_hd_icon",
  "show_lw_icon",
  "show_wt_icon",
  "show_gm_icon",
  "show_fd_icon",
  "show_ppe_icon"
];
const useShops = () => {
  const [shops, setShops] = useState([]);
  const firebaseValues = useSelector(state => state.firebase.config);
  const { visibleShops } = useVisibleShops();
  const filteredValues = pick(firebaseValues, FIREBASE_KEYS);

  const handleShops = useCallback(() => {
    const buffStores = [...visibleShops].map((el) => { 
        return ({
          ...el,
          finalImage: filteredValues[el.firebaseKey] === 'true' ? el.original : el.img,
        })
    }); 
    setShops(buffStores);
  }, [visibleShops]);
  
  useEffect(() => {
    handleShops();
  }, [JSON.stringify(filteredValues), visibleShops]);

  useEffect(() => {
    handleShops()
  },[])
  return { shops };
};

export default useShops;
