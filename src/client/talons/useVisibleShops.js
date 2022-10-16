import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { STORES, storesElements } from "conf/consts";


const useVisibleShops = () => {
    const [visibleShops, setVisibleShops] = useState([]);
    const [storeElems, setStoreElems] = useState([]);
    const firebaseValues = useSelector(state => state.firebase.config)
    const supported = firebaseValues && JSON.parse(firebaseValues.supported_vendors);
    const searchable = firebaseValues && JSON.parse(firebaseValues.searchable_vendors);
    const handleVisibleShops = () => {
      const stores = [];
      [...supported].map((el) => {
        const x =  STORES.filter(e => e.vendorcode === el)
        stores.push(x[0]);
      });
      const elements = [];
      [...supported].map(elem => {
        const filtered = storesElements.filter(el => el.value === elem);
        elements.push(filtered[0])
      })
      setVisibleShops(stores);
      setStoreElems(elements);
    }

    useEffect(() => {
      handleVisibleShops();
    }, [JSON.stringify(supported)]);
  
    useEffect(() => {
      handleVisibleShops()
    },[])

    return { visibleShops, storeElements: storeElems, availableStores: supported, searchable };
}

export default useVisibleShops;